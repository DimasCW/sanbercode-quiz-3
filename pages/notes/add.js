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
 Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
   
   
export default function Notes() {
    const router = useRouter()
    const [notes, setNotes] = useState(
        {title:"",
        description:""}
    );  

    const HandleSubmit = async () => {
        try{
            const response = await fetch("https://service.pace-unv.cloud/api/notes", 
                {
                    method : "POST",
                    headers :{
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify(notes)
                    
                }
            )
            const result = await response.json();
            if (result?.success){
                router.push("/notes")
            }

        }catch(error){}
    }
    
    
    return (
    <>
        <Card  margin={5} padding={5}>
        <Grid gap={5}>
            <GridItem>
                <Heading>Add Note</Heading>
            </GridItem>
            <GridItem>
                <Grid gap={5}>
                    <GridItem>
                        <Text>title</Text>
                        <Textarea 
                        type="text"
                        onChange={(event) => {
                            setNotes({...notes, title: event.target.value})
                        }}
                        />
                    </GridItem>
                </Grid>
                <Grid>
                    <GridItem>
                        <Text>Description</Text>
                        <Textarea 
                        type="text"
                        onChange={(event) => {
                            setNotes({...notes, description: event.target.value})
                        }}
                        />
                    </GridItem>
                </Grid>
            </GridItem>
            <GridItem>
            <Button onClick={() => HandleSubmit()} colorScheme="blue">
        Submit
        </Button>        

            </GridItem>
        </Grid>
        </Card>
    </>
    );
}