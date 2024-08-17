"use client";

import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import PricingPlan from "./PricingPlan"; // Import the individual plan component
import getStripe from "@/utils/get-stripe";

const pricingPlans = [
  {
    title: "Basic Plan",
    price: "$10/month",
    price_number: 10,
    features: [
      "Create up to 1,000 flashcards",
      "Access to basic templates",
      "Study on 1 device",
      "Basic progress tracking",
      "Limited to 3 shared decks",
    ],
  },
  {
    title: "Standard Plan",
    price: "$20/month",
    price_number: 20,
    features: [
      "Create up to 5,000 flashcards",
      "Access to all templates",
      "Sync across 3 devices",
      "Advanced progress tracking",
      "Unlimited shared decks",
      "Export decks as PDFs",
    ],
  },
  {
    title: "Premium Plan",
    price: "$30/month",
    price_number: 30,
    features: [
      "Unlimited flashcards",
      "Custom templates and themes",
      "Sync across unlimited devices",
      "Detailed analytics and insights",
      "Collaboration on shared decks",
      "Priority customer support",
      "Offline access to decks",
    ],
  },
];


function PricingList() {
  const handleSubmit = async (plan) => {
    // return console.log(plan)
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: process.env.HOST_ORIGIN,
      },
      body: JSON.stringify({
        product_name: plan.title,
        product_price: plan.price_number,
      }),
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Our Pricing Plans
      </Typography>
      <Grid container spacing={4}>
        {pricingPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.title}>
            <PricingPlan plan={plan} handleSubmit={handleSubmit} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default PricingList;
