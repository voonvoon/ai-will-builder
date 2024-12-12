import { Prisma } from "@prisma/client";
import { WillValues } from "./validation";

export interface EditorFormProps {
    willData: WillValues;
    setWillData: (data: WillValues) => void;
}

export const willDataInclude = {
    workExperience: true,
    education: true,
} satisfies Prisma.WillInclude;

export type WillServerData = Prisma.WillGetPayload<{
    include: typeof willDataInclude;
}>;