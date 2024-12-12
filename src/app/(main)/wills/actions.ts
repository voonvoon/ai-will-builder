"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteWill(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  //existing will?
  const will = await prisma.will.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!will) {
    throw new Error("Will not found");
  }

  //delete img
  if (will.photoUrl) {
    await del(will.photoUrl);
  }

  //Delete the will
  await prisma.will.delete({
    where: {
      id,
    },
  });

  revalidatePath("/wills"); //this cause the will disappear from the list visually
}
