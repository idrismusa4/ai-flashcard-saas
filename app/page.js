import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PricingList from "@/components/feature/PricingList";

export default function Home() {

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
  {/* <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography> */}
  <Grid container spacing={4} justifyContent="center">
    {/* Pricing plans */}
    <PricingList />
  </Grid>
</Box>

</Container>
  





  )
}
