"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to create a checkout session");
  }

  // created from webhook for customer
  const stripeCustomerId = user.privateMetadata?.stripeCustomerId as
    | string
    | undefined;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : user.emailAddresses[0].emailAddress,
    //optional, will add metadata to the session
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      //optional, will add metadata to the subscription
      metadata: {
        userId: user.id,
      },
    },
    //optional, will add a checkbox to the checkout page
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read and agree to the [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!session) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}
