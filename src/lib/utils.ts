import { clsx, type ClassValue } from "clsx"//A utility function for conditionally combining class names.
import { twMerge } from "tailwind-merge"
import { WillServerData } from "./types"
import { WillValues } from "./validation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



//custom function used as the second argument to JSON.stringify.
//allows you to customize how the object is converted to a JSON string.
//used to exclude certain properties or transform values during the stringification process.
//The fileReplacer function is used to handle specific properties in the objects, such as file objects, that might not be directly comparable in their raw form.
//!if don't use this function, the JSON.stringify will return File as empty obj because it can't convert the file object to string
//if empty obj returned, File uncompareable
export function fileReplacer(key:unknown, value:unknown) {
  return value instanceof File ? {
    name: value.name,
    size: value.size,
    type: value.type,
    lastModified: value.lastModified,
  } : value
}

export function mapToWillValues(data: WillServerData): WillValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperience.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0] || undefined,
      endDate: exp.endDate?.toISOString().split("T")[0] || undefined,
      description: exp.description || undefined,
    })),
    educations: data.education.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0] || undefined, 
      endDate: edu.endDate?.toISOString().split("T")[0] || undefined,
    })),
    skills: data.skills,
    borderStyle: data.borderStyle || undefined,
    colorHex: data.colorHex || undefined,
    summary: data.summary || undefined
  }
}