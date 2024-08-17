"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";

function PricingPlan({ plan, handleSubmit }) {
  const { isLoaded } = useUser();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {plan.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {plan.price}
        </Typography>
        <List>
          {plan.features.map((feature, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {feature}
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isLoaded}
          onClick={() => handleSubmit(plan)}
        >
          Choose Plan
        </Button>
      </CardContent>
    </Card>
  );
}

export default PricingPlan;
