import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { willDataInclude } from "@/lib/types";
import WillItem from "./WillItem";
import CreateWillButton from "./CreateWillButton";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateWill } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Your Will",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [wills, totalCount, subscriptionLevel] = await Promise.all([
    prisma.will.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: willDataInclude,
    }),
    prisma.will.count({
      where: {
        userId,
      },
    }),
    getUserSubscriptionLevel(userId),
  ]);

  //Check quota for non-premium users

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateWillButton canCreate={canCreateWill(subscriptionLevel, totalCount)} />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold"> Your Wills</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {wills.map((will) => (
          <WillItem key={will.id} will={will} />
        ))}
      </div>
    </main>
  );
}
