import { Button } from "@/components/ui/button";
import { Squircle, Circle, Square } from "lucide-react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

//turn to a array of objects
const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}

export default function BorderStyleButton({
  borderStyle,
  onChange,
}: BorderStyleButtonProps) {

  const subscriptionLevel = useSubscriptionLevel(); 

  const premiumModal = usePremiumModal();
  
  function handleClick() {
    if(!canUseCustomizations(subscriptionLevel)){ 
      premiumModal.setOpen(true);
      return;
    }

    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    // The modulus operation % ensures that the index wraps around to the beginning of the array.
    // Example:
    // Assume borderStyles has 4 elements (length is 4):
    // If currentIndex is 2:
    // nextIndex = (2 + 1) % 4 = 3
    // If currentIndex is 3 (last element):
    // nextIndex = (3 + 1) % 4 = 0
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  }

  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : Squircle;

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
}
