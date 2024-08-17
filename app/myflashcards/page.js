'use client'

import { useState, useCallback, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Box, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js'; // Adjust import path as needed
import { useUser } from '@clerk/nextjs';
import Loading from '../components/loading.js';
import "../styles/myflashcards.css"


function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = useCallback(() => setIsFlipped(!isFlipped), [isFlipped]);

  return (
    <Card 
      sx={{
        cursor: 'pointer',
        perspective: '1000px', // Added for better 3D effect
        width: '100%',
        height: '200px', // Adjust as needed
      }}
      onClick={flip}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of the card */}
        <CardContent
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: '4px', // Add border radius if needed
            boxShadow: isFlipped ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6">Question</Typography>
          <Typography>{front}</Typography>
        </CardContent>
        {/* Back of the card */}
        <CardContent
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            transform: 'rotateY(180deg)',
            borderRadius: '4px', // Add border radius if needed
            boxShadow: isFlipped ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <Typography variant="h6">Answer:</Typography>
          <Typography>{back}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default function MyFlashcards() {
  const [loading, setLoading] = useState(true);
  const [flashcardsSetList, setFlashcardsSetList] = useState([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState(null);
  const { user } = useUser();


  async function selectFlashcardset(name) {
    setLoading(true)
    const flashcardsetRef = doc(db, `users/${user.id}/flashcardSets/${name}`);
    console.log(flashcardsetRef)

    const docSnap = await getDoc(flashcardsetRef);

    if (docSnap.exists()) {
      // Document data found
      console.log("Flashcard Set Data:", docSnap.data().flashcards);
      setSelectedFlashcards({name, data: docSnap.data().flashcards});
    } else {
      // No such document exists
      alert("No such flashcardset");
      return null;
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if(!user?.id) return
        const userDocRef = doc(collection(db, `users/`), user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const flashcardData = userDocSnap.data()
          setFlashcardsSetList(flashcardData.flashcardSets);
          console.log(flashcardData)
        } else {
          alert("oops that user does not exist")
          setLoading(false)
        }
    
        setLoading(false)
      } catch (error) {
        console.error('Error generating flashcards:', error);
        setLoading(false)
        alert(error.message || 'An error occurred while generating flashcards. Please try again.');
      }
    };
    fetchUser()
  }, [user?.id])

  console.log(selectedFlashcards)
  return (
    loading ? <Loading /> :
    <Container sx={{marginLeft: 0}} maxWidth="md">
      <h1 style={{marginTop: "20px", textAlign: "center", width: "96vw"}}>My FlashCards</h1>
      {flashcardsSetList?.length > 0 ? (
        <div className='myflashcards-main'>
          <div className='flashcards-list'>
          {
            flashcardsSetList?.map((f, i) => {
              return <div onClick={async ()=> await selectFlashcardset(f?.name)} key={i} className={f?.name === selectedFlashcards?.name ? "selected": "flashcard-item"}>{f.name}</div>
            })
          }
          </div>
          <div style={{ width: "83%", height: "100%", overflowY: "auto", paddingRight: "5px"}}>
           {!(selectedFlashcards?.data&&selectedFlashcards?.data.length>0) ? <h3 style={{textAlign: "center", width: "100%"}}>Select a set of flashcards to view</h3>:
            <>
              <Typography sx={{textAlign: "center"}} variant="h5" component="h2" gutterBottom>
                {selectedFlashcards?.name}
              </Typography>
              <Grid container spacing={2}>
                {selectedFlashcards?.data.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Flashcard front={flashcard.front} back={flashcard.back} />
                  </Grid>
                ))}
              </Grid>
            </>}
          </div>
        </div>
      ) : <h3 style={{textAlign: "center",  marginTop:"200px",width: "94vw"}}>{"You haven't created any flashcards yet"}</h3>}
    </Container>
  );
}

