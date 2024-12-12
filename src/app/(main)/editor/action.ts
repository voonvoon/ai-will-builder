"use server";
import { canCreateWill, canUseCustomizations } from "@/lib/permissions";
//this is a server end point that will be called when the user clicks the save button

import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { willSchema, WillValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

//we can just pass any values to this functio, nextjs will automatically parse the values
export async function saveWill(values: WillValues) {
  const { id } = values;

  console.log("received values-------------------->", values);

  // (...): Collects the remaining properties into a new object
  //Purpose: Separates specific properties for different handling or processing.
  const { photo, workExperiences, educations, ...willValues } =
    willSchema.parse(values); //The parse method validates the values object against the schema and returns the validated object.

  //get id of currently logged in user
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  //TODO: check will count for non-premium users
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!id) {
    const willCount: number = await prisma.will.count({
      where: {
        userId,
      },
    });

    if (!canCreateWill(subscriptionLevel, willCount)) {
      throw new Error("You have reached the limit of wills you can create");
    }
  }

  const existingWill = id
    ? await prisma.will.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingWill) {
    throw new Error("Will not found");
  }

  const hasCustomizations =
    (willValues.borderStyle &&
      willValues.borderStyle !== existingWill?.borderStyle) ||
    (willValues.colorHex && willValues.colorHex !== existingWill?.colorHex);

  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("You need a Pro Plus subscription to use customizations");
  }

  //undefined mean don't have the photo
  //null specifically can mean delete
  let newPhotoUrl: string | undefined | null = undefined;

  //delete existing img to avoid reduntancy . free storage
  if (photo instanceof File) {
    if (existingWill?.photoUrl) {
      await del(existingWill.photoUrl);
    }

    //will get image in the blob const
    const blob = await put(`will_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingWill?.photoUrl) {
      await del(existingWill.photoUrl);
    }

    newPhotoUrl = null;
  }

  //save to database
  //this if is for updating existing will
  if (id) {
    return prisma.will.update({
      where: { id },
      data: {
        ...willValues,
        photoUrl: newPhotoUrl,
        workExperience: {
          deleteMany: {}, //delete all existing work experiences
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        education: {
          deleteMany: {}, //delete all existing educations
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    //this is for creating new will
    return prisma.will.create({
      data: {
        ...willValues,
        photoUrl: newPhotoUrl,
        userId, //set the user id for new one
        workExperience: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        education: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}
