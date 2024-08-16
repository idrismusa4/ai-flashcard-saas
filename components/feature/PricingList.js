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
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  },
  {
    title: "Standard Plan",
    price: "$20/month",
    price_number: 20,
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  },
  {
    title: "Premium Plan",
    price: "$30/month",
    price_number: 30,
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
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
