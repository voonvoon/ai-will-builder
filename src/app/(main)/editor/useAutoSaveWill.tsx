import { WillValues } from "@/lib/validation";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { saveWill } from "./action";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSaveWill(willData: WillValues) {
  const searchParams = useSearchParams();

  const { toast } = useToast();

  //pass willData and delay time to useDebounce hook to
  // delay the execution of the function until the user has stopped typing for specific time(1500ms).
  const debouncedWillData = useDebounce(willData, 1500);

  const [willId, setWillId] = useState(willData.id);

  const [lastSaveData, setLastSaveData] = useState(
    structuredClone(willData), //structuredClone is a deep clone function by nodejs/javascript
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedWillData]);

  useEffect(() => {
    async function save() {
      // setIsSaving(true);
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      // setLastSaveData(structuredClone(debouncedWillData));
      // setIsSaving(false);
      try {
        setIsSaving(true);
        setIsError(false);

        //create tis clone at very beggining can avoid bug!
        const newData = structuredClone(debouncedWillData);

        const updatedWill = await saveWill({
          ...newData,
          //don't send photo if it's the same
           //fileReplacer: custom function used as the second argument to JSON.stringify.
          ...(JSON.stringify(lastSaveData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: willId,
        });

        setWillId(updatedWill.id);
        setLastSaveData(newData);

        if (searchParams.get("willId") !== updatedWill.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("willId", updatedWill.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could Not Save Changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry Saving
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    }
    //fileReplacer: custom function used as the second argument to JSON.stringify.
    const hasUnsavedChanges =
      JSON.stringify(debouncedWillData, fileReplacer) !==
      JSON.stringify(lastSaveData, fileReplacer);

    if (hasUnsavedChanges && debouncedWillData && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedWillData,
    isSaving,
    lastSaveData,
    isError,
    willId,
    searchParams,
    toast,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(willData) !== JSON.stringify(lastSaveData),
  };
}
