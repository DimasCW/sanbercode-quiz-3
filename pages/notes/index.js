import dynamic from "next/dynamic";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Box,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import React from "react";

export async function getStaticProps() {
  const res = await fetch(`http://localhost:3000/api/hello`);
  const repo = await res.json();
  return { props: { repo } };
}

export default function EditNotes({ repo }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const router = useRouter();
  const [notes, setNotes] = useState(repo.data || []);
  const [noteToEdit, setNoteToEdit] = useState({ title: "", description: "" });
  const [noteToDelete, setNoteToDelete] = useState(null);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { id } = router?.query;

  // Edit
  const handleEdit = async () => {
    try {
      const response = await fetch(`https://service.pace-unv.cloud/api/notes/update/${noteToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: noteToEdit.title, description: noteToEdit.description }),
      });
      const result = await response.json();
      if (result?.success) {
        router.reload();
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  // Fetching the note data when opening the edit modal
  const openEditModal = async (note) => {
    setNoteToEdit(note);
    onOpenEdit();
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://service.pace-unv.cloud/api/notes/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result?.success) {
        router.reload();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Add
  const handleSubmit = async () => {
    try {
      const response = await fetch("https://service.pace-unv.cloud/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteToEdit),
      });
      const result = await response.json();
      if (result?.success) {
        router.reload();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <>
      <Box padding="5">
        <Flex justifyContent="end">
          <Button colorScheme="blue" onClick={onOpenAdd}>
            Add Notes
          </Button>
        </Flex>
        <Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            {notes.map((item) => (
              <GridItem key={item.id}>
                <Card>
                  <CardHeader>
                    <Heading>{item.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{item.description}</Text>
                  </CardBody>
                  <CardFooter justify="space-between" flexWrap="wrap">
                    <Button
                      onClick={() => openEditModal(item)}
                      flex="1"
                      variant="ghost"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setNoteToDelete(item.id);
                        onOpen();
                      }}
                      flex="1"
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Flex>
      </Box>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apakah anda ingin menghapus ini?</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleDelete(noteToDelete);
                onClose();
              }}
              colorScheme="red"
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add */}
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenAdd} onClose={onCloseAdd}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title"
                type="text"
                onChange={(event) => {
                  setNoteToEdit({ ...noteToEdit, title: event.target.value });
                }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                type="text"
                onChange={(event) => {
                  setNoteToEdit({ ...noteToEdit, description: event.target.value });
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handleSubmit();
                onCloseAdd();
              }}
              colorScheme="blue"
              mr={3}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit */}
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title"
                value={noteToEdit.title}
                type="text"
                onChange={(event) => {
                  setNoteToEdit({ ...noteToEdit, title: event.target.value });
                }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                value={noteToEdit.description}
                type="text"
                onChange={(event) => {
                  setNoteToEdit({ ...noteToEdit, description: event.target.value });
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handleEdit();
                onCloseEdit();
              }}
              colorScheme="blue"
              mr={3}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
