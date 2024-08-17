"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
} from "@mui/material";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config"; // Adjust import path as needed
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const search = searchParams.get("id"); // Get the flashcard set ID from the URL

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return; // Ensure the user and search parameters are available

      const colRef = collection(
        doc(collection(db, "users"), user.id),
        "flashcardSets",
        search,
        "flashcards"
      );
      const docs = await getDocs(colRef);
      const flashcardsData = [];
      docs.forEach((doc) => {
        flashcardsData.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcardsData);
    }

    if (search) {
      getFlashcards();
    }
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the flipped state of the clicked card
    }));
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id || index}>
            <Card sx={{ perspective: "1000px" }}>
              <CardActionArea
                onClick={() => handleCardClick(flashcard.id || flashcard.name)}
              >
                <CardContent sx={{ position: "relative", height: "200px" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s",
                      transform: flipped[flashcard.id]
                        ? "rotateY(180deg)"
                        : "none",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" component="div">
                        {flashcard.front}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" component="div">
                        {flashcard.back}
                      </Typography>
                    </Box>
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
