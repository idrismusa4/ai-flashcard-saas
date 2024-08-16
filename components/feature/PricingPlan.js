"use client"

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, Button } from '@mui/material';

function PricingPlan({ title, price, features, handleSubmit }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {price}
        </Typography>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index}>{feature}</ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Choose Plan
        </Button>
      </CardContent>
    </Card>
  );
}

export default PricingPlan;
