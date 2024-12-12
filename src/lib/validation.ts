//zod is a TypeScript-first schema declaration and validation library. It allows you to define schemas for your
//data and then validate that data against those schemas. This is particularly useful in TypeScript projects
//because it ensures that your data conforms to the expected structure and types, reducing runtime errors and
//improving code reliability.

import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    // refine() allows you to define more complex validation rules that go beyond the built-in schema types.
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File size must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

// start of work experience zod schema

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString, //is a string because it is a date
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(), //because this array can be undefined later we allow it to be optional
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

//start of education zod schema
export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

//end of education zod schema

//start of skills zod schema
export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;
//end of skills zod schema

//start of summary zod schema

export const summarySchema = z.object({
  summary: optionalString,
});


//infer utility to extract the TypeScript type that corresponds to the structure defined
export type SummaryValues = z.infer<typeof summarySchema>;
//end of summary zod schema

//end of work experience zoc schema
export const willSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});


// Omit is a utility type that constructs a new type by picking all properties from an existing type except for the ones specified.
export type WillValues = Omit<z.infer<typeof willSchema>, "photo"> & {
  id?: string; // when update exsiting will will have id but when creating new will it will not have id
  // when updating will photo it will be string but when creating new will photo will be file
  // this way it can be file or string or null
  photo?: File | string | null;
};
