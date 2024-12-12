import { Metadata } from "next";
import WillEditor from "./WillEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { willDataInclude } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ willId?: string }>;
}

export const metadata: Metadata = {
  title: "Design Your Will",
};

export default async function Page({ searchParams }: PageProps) {
  const { willId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const willToEdit = willId
    ? await prisma.will.findUnique({
        where: { id: willId, userId },
        include: willDataInclude,
      })
    : null;

  return <WillEditor willToEdit={willToEdit} />;
}
