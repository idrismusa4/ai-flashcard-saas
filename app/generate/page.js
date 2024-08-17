"use client";

import { useState, useCallback } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { doc, collection, writeBatch, getDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust import path as needed
import { useUser } from "@clerk/nextjs";
import Loading from '../components/loading.js';

function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = useCallback(() => setIsFlipped(!isFlipped), [isFlipped]);

  return (
    <Card
      sx={{
        cursor: "pointer",
        perspective: "1000px", // Added for better 3D effect
        width: "100%",
        height: "200px", // Adjust as needed
      }}
      onClick={flip}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of the card */}
        <CardContent
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "4px", // Add border radius if needed
            boxShadow: isFlipped ? "none" : "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6">Question</Typography>
          <Typography>{front}</Typography>
        </CardContent>
        {/* Back of the card */}
        <CardContent
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            transform: "rotateY(180deg)",
            borderRadius: "4px", // Add border radius if needed
            boxShadow: isFlipped ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          <Typography variant="h6">Answer:</Typography>
          <Typography>{back}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default function Generate() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();
  const [file, setFile] = useState(null);


  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    if (!user) {
      alert("Please sign in to save flashcards.");
      return;
    }

    try {
      setLoading(true)
      const userDocRef = doc(collection(db, 'users'), user.id);
      const userDocSnap = await getDoc(userDocRef);
      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();
      setLoading(false)
      alert('Flashcards saved successfully!');
      handleCloseDialog();
      setSetName("");
    } catch (error) {
      console.error('Error saving flashcards:', error);
      setLoading(false)
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      setLoading(true)
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw server response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Failed to parse server response");
      }
      setLoading(false)
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setLoading(false)
      alert(error.message || 'An error occurred while generating flashcards. Please try again.');
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/extract_text", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setText(result.text);
      } else {
        console.error("Error:", result.error);
      }
    }
  };

  return (
    loading ? <Loading /> :
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
        {/* <input type="file" accept=".pdf" onChange={handleFileChange} />
        Upload PDF */}
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Flashcard front={flashcard.front} back={flashcard.back} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Save Flashcards
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
