
import { env } from "@/env";
import { cache } from "react";
import prisma from "./prisma";

export type SubscriptionLevel = "free" | "pro" | "pro_plus";


//cache is a higher-order function that takes another function as an argument and returns a new function with caching behavior.
//When the cached function is called, it checks if the result for the given arguments is already in the cache.
//If it is, it returns the cached result.
//If not, it calls the original function, stores the result in the cache, and then returns the result.

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const subscription = await prisma.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
      return "free";
    }

    if (
      subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
    ) {
      return "pro";
    }

    if (
      subscription.stripePriceId ===
      env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
    ) {
      return "pro_plus";
    }

    throw new Error("Invalid subscription");
  },
);