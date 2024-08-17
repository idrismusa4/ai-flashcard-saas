"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Use Next.js's version
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcardsData = [];
      docs.forEach((doc) => {
        flashcardsData.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcardsData);
    }
    getFlashcards();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={
                      {
                        /* Styling for flip animation */
                      }
                    }
                  >
                    <div
                      style={{
                        transform: flipped[flashcard.id]
                          ? "rotateY(180deg)"
                          : "none",
                        transition: "transform 0.6s",
                      }}
                    >
                      <div
                        style={{
                          display: flipped[flashcard.id] ? "none" : "block",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: flipped[flashcard.id] ? "block" : "none",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
