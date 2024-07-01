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
import { useRef } from "react";
import React from "react";

export async function getStaticProps() {
  const res = await fetch(`https://service.pace-unv.cloud/api/notes`);
  const repo = await res.json();
  return { props: { repo } };
}

export default function EditNotes({ repo }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen : isOpenAdd, onOpen : onOpenAdd, onClose : onCloseAdd } = useDisclosure();
  const router = useRouter();
  const [notes, setNotes] = useState(repo, { title: "", description: "" });
  const [noteToDelete, setNoteToDelete] = useState(null);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const HandleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://service.pace-unv.cloud/api/notes/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result?.success) {
        router.reload();
      }
    } catch (error) {}
  };

  const HandleSubmit = async () => {
    try {
      const response = await fetch("https://service.pace-unv.cloud/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notes),
      });
      const result = await response.json();
      if (result?.success) {
        router.push("/notes");
      }
    } catch (error) {}
  };

  return (
    <>
      <Box padding="5">
        <Flex justifyContent="end">
          <Button colorScheme="blue" onClick= {()=> {
            onOpenAdd()
          }}>
            Add Notes
          </Button>
        </Flex>
        <Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            {notes?.data?.map((item) => (
              <GridItem>
                <Card>
                  <CardHeader>
                    <Heading>{item?.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{item?.description}</Text>
                  </CardBody>
                  <CardFooter justify="space-between" flexWrap="wrap">
                    <Button
                      onClick={() => router.push(`/notes/edit/${item?.id}`)}
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
                HandleDelete(noteToDelete);
                onClose();
              }}
              colorScheme="red"
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
      >
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
                  setNotes({ ...notes, title: event.target.value });
                }}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                type="text"
                onChange={(event) => {
                  setNotes({ ...notes, description: event.target.value });
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                HandleSubmit();
                onClose();
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
