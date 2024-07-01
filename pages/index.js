import dynamic from "next/dynamic";
import {
  
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
   
export async function getStaticProps() {
    const res = await fetch(`https://service.pace-unv.cloud/api/notes`)
    const repo = await res.json()
    return { props: { repo } }
  }
   
export default function EditNotes({repo}) {
  
 const router = useRouter();
 const [notes, setNotes] = useState(repo);  

 
console.log(notes)
 const HandleDelete = async (id) =>{
    try{
        const response = await fetch(`https://service.pace-unv.cloud/api/notes/delete/${id}`, 
            {
                method : "DELETE",
            }
        )
        const result = await response.json();
        if (result?.success){
            router.reload()
        }

    }catch(error){}

 }
   
 return (
 <>
   <Box padding="5">
    <Flex justifyContent="end">
     <Button
      colorScheme="blue"
      onClick={() => router.push("/notes")}
     >
      Manage Note
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
        </Card>
       </GridItem>
      ))}
     </Grid>
    </Flex>
   </Box>
 </>
);
}