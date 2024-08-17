"use client";

import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import PricingPlan from "./PricingPlan"; // Import the individual plan component
import getStripe from "@/utils/get-stripe";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const pricingPlans = [
  {
    id: "basic",
    title: "Basic Plan",
    price: "$10/month",
    price_number: 10,
    features: [
      "Limited Flashcards",
      "Basic AI Assistance",
      "Text-Only Flashcards",
      "Basic Analytics",
      "Standard Deck Management",
    ],
  },
  {
    id: "standard",
    title: "Standard Plan",
    price: "$20/month",
    price_number: 20,
    features: [
      "Increased Flashcard Limit",
      "Advanced AI Assistance",
      "Multimedia Flashcards",
      "Enhanced Analytics",
      "Custom Deck Management",
    ],
  },
  {
    id: "premium",
    title: "Premium Plan",
    price: "$30/month",
    price_number: 30,
    features: [
      "Unlimited Flashcards",
      "AI-Powered Adaptive Learning",
      "Collaborative Decks",
      "Priority Support",
      "Custom Branding",
    ],
  },
];

function PricingList() {
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (plan) => {
    if (!user) return router.push("/sign-in");

    // return console.log(plan)
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: process.env.NEXT_PUBLIC_HOST_ORIGIN,
      },
      body: JSON.stringify({
        product_id: plan.id,
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
