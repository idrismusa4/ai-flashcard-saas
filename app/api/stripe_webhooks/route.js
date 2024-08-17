import { db } from "@/firebase"; // Adjust the path to your config file
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const { userId, product_id: plan_id } =
        event.data.object.metadata;
      console.log("checkout.session.completed was successful!");

      // Reference the user's document in Firestore
      const userDocRef = doc(db, "users", userId);

      // Update the user's document with the plan information
      await updateDoc(userDocRef, {
        plan: plan_id, // Assuming there's a single plan
        planActive: true,
        planStartDate: new Date(),
      });

      break;
    // ... handle other event types
    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
