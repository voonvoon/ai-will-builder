"use server"

import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { env } from "@/env";

export async function createCustomerPortalSession() { 
    const user = await currentUser();

    if (!user) {
        throw new Error("You must be signed in to create a customer portal session");
    }

    const stripeCustomerId = user.privateMetadata?.stripeCustomerId as string | undefined;

    if (!stripeCustomerId) {
        throw new Error("No stripeCustomerId found for user");
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    });

    if (!session.url) {
        throw new Error("Failed to create customer portal session");
    }

    return session.url;
}