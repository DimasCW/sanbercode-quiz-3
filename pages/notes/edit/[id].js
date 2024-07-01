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
import { useEffect } from "react";
import { useRouter } from "next/router";
   
   
export default function EditNotes() {
    const router = useRouter()
    const { id } = router?.query;
    const [notes, setNotes] = useState();  

    const HandleSubmit = async () => {
        try{
            const response = await fetch(`https://service.pace-unv.cloud/api/notes/update/${id}`, 
                {
                    method : "PATCH",
                    headers :{
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({ title: notes?.title, description: notes?.description })
                    
                }
            )
            const result = await response.json();
            if (result?.success){
                router.push("/notes")
            }

        }catch(error){}
    }


    useEffect(() => {
        async function fetchingData() {
        const res = await fetch(`https://service.pace-unv.cloud/api/notes/${id}`);
        const listNotes = await res.json();
        setNotes(listNotes?.data);
        }
        fetchingData();
    }, [id]);  
    

    
    
    return (
    <>
        <Card  margin={5} padding={5}>
        <Grid gap={5}>
            <GridItem>
                <Heading>Edit Note</Heading>
            </GridItem>
            <GridItem>
                <Grid gap={5}>
                    <GridItem>
                        <Text>title</Text>
                        <Textarea
                        type="text"
                        value={notes?.title || ''}
                        onChange={(event) => 
                            setNotes({...notes, title: event.target.value})
                        }
                        />
                    </GridItem>
                </Grid>
                <Grid>
                    <GridItem>
                        <Text>Description</Text>
                        <Textarea 
                        type="text"
                        value={notes?.description || ''}
                        onChange={(event) => 
                            setNotes({...notes, description: event.target.value})
                        }
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