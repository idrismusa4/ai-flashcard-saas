import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'https://refactored-tribble-w5q54pvrqq9c97rv-3000.app.github.dev' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  return (
  <Container maxWidth="200vh">
    
<Box sx={{textAlign: 'center', my: 4}}>
  <Typography variant="h2" component="h1" gutterBottom>
    Welcome to the Limited Beta Test of Studybug Flashcards
  </Typography>
  <Typography variant="h5" component="h2" gutterBottom>
    The easiest way to create flashcards from your text.
  </Typography>
  <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
    Get Started
  </Button>
  <Button variant="outlined" color="primary" sx={{mt: 2}}>
    Learn More
  </Button>
</Box>

<Box sx={{my: 6}}>
  <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
  <Grid container spacing={4}>
    {/* Feature items */}
  </Grid>
</Box>

<Box sx={{my: 6, textAlign: 'center'}}>
  <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
  <Grid container spacing={4} justifyContent="center">
    {/* Pricing plans */}
  </Grid>
</Box>

</Container>
  





  )
}
