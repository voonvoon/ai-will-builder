import { WillValues } from "@/lib/validation";
import WillPreview from "@/components/WillPreview";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { cn } from "@/lib/utils";

interface WillPreviewSectionProps {
  willData: WillValues;
  setWillData: (data: WillValues) => void;
  className?: string; 
}

export default function WillPreviewSection({
  willData,
  setWillData,
  className
}: WillPreviewSectionProps) {
  return (
    <div className={cn("group relative hidden md:w-1/2 md:!flex w-full", className)}>
      <div className="opacity-50 transition-opacity xl:opacity-100 group-hover:opacity-100 absolute left-1 top-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3">
        <ColorPicker
          color={willData.colorHex}
          onChange={(color) =>
            setWillData({ ...willData, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={willData.borderStyle}
          onChange={(borderStyle) =>
            setWillData({ ...willData, borderStyle })
          } 
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <WillPreview willData={willData} className="max-w-2wl shadow-md" />
      </div>
    </div>
  );
}
