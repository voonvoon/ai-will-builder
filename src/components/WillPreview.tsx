import { WillValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface WillPreviewProps {
  willData: WillValues;
  contentRef?: React.RefObject<HTMLDivElement>; //make it optional
  className?: string;
}
//aspect[210/297] A4 paper size
export default function WillPreview({ willData, className, contentRef }: WillPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null); // Create a ref object to store the reference to the container element

  const { width } = useDimensions(containerRef); // Call the useDimensions hook with the containerRef, need width only

  return (
    <div
      className={cn(
        "aspect[210/297] h-fit w-full bg-white p-4 text-black",
        className,
      )}
      ref={containerRef} // Assign the ref object to the container element
    >
      <div
        className={cn("space-x-6", !width && "invisible")} // Hide the content if the width is not available else weird for moment!
        style={{
          //(1 / 794) * width adjusts the zoom level based on the actual width of the container.
          //example: const zoom = (1 / 794) * 1588; // zoom = 2
          zoom: (1 / 794) * width, // 210mm = 794pixel (A4)
        }}
        ref={contentRef} // Assign the ref object to the content element
        id="willPreviewContent" // target in css later cuz can't do in tailwindcss
      >
        {/* <h1 className="p-6 text-3xl font-bold">
          This text should be changed with the size of the container div
        </h1> */}
        {/* <pre>{JSON.stringify(willData, null, 2)}</pre> */}
        <PersonalInfoHeader willData={willData} />
        <SummarySection willData={willData} />
        <WorkExperienceSection willData={willData} />
        <EducationSection willData={willData} />
        <SkillsSection willData={willData} />
      </div>
    </div>
  );
}

interface WillSectionProps {
  willData: WillValues;
}

function PersonalInfoHeader({ willData }: WillSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = willData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo); //if photo is a file, set it to empty string else set it to photo

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : ""; //if photo is a file, create an object url else set it to empty string
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc(""); //if photo is null, set it to empty string

    // Clean up the object URL when the component is unmounted
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0px" 
            : borderStyle === BorderStyles.CIRCLE ? "9999px"
            : "10%"
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold"
            style={{
              color: colorHex,
            }}
          >
            {firstName} {lastName}
          </p>
          <p
            className="font-medium"
            style={{
              color: colorHex,
            }}
          >
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country && ", "}
          {country}
          {(city || country) && (phone || email) ? "• " : ""}
          {/*  ensures that only truthy values (non-empty strings in this case) remain in the array. */}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function SummarySection({ willData }: WillSectionProps) {
  const { summary, colorHex } = willData;
  if (!summary) return null;
  return (
    <>
      <hr
        className="border-1 mt-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Profesional Profile
        </p>
        <div className="whitespace-pre-line text-sm font-light mb-4">{summary}</div>
      </div>
    </>
  );
}

function WorkExperienceSection({ willData }: WillSectionProps) {
  const { workExperiences, colorHex } = willData;

  // Filter out work experiences with no data
  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-1 mt-1"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Work experience
        </p>
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function EducationSection({ willData }: WillSectionProps) {
  const { educations, colorHex } = willData;
  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-1 mt-1"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function SkillsSection({ willData }: WillSectionProps) {
  const { skills, colorHex, borderStyle } = willData;

  if (!skills?.length) return null;

  return (
    <>
      <hr
        className="border-1 mt-1"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Skills
        </p>
        <div
          className="flex break-inside-avoid flex-wrap gap-2"
          style={{
            color: colorHex,
          }}
        >
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex,
                borderRadius: borderStyle === BorderStyles.SQUARE ? "0px" 
                : borderStyle === BorderStyles.CIRCLE ? "9999px"
                : "8px"
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
