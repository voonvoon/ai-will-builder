"use client";

//import GeneralInfoForm from "./forms/GeneralInfoForm";
//import PersonalInfoForm from "./forms/PersonalInfoForm";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { WillValues } from "@/lib/validation";
import WillPreviewSection from "./WillPreviewSection";
import { cn, mapToWillValues } from "@/lib/utils";
import useAutoSaveWill from "./useAutoSaveWill";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { WillServerData } from "@/lib/types";

interface WillEditorProps { 
  willToEdit: WillServerData | null;
}

//mapToWillValues function is used to convert the data from the server to the format expected by the WillEditor component.
export default function WillEditor({willToEdit}: WillEditorProps) {
  const [willData, setWillData] = useState<WillValues>(
    willToEdit ? mapToWillValues(willToEdit) : {},
  );

  console.log('willToEdit---------------------------->', willToEdit);

  const [showSmWillPreview, setShowSmWillPreview] = useState(false);

  const {isSaving, hasUnsavedChanges} = useAutoSaveWill(willData);


  useUnloadWarning(hasUnsavedChanges);

  //The useSearchParams hook from the next/navigation package is used to access the query string parameters of the current URL.
  const searchParams = useSearchParams();

  //The currentStep variable is set to the value of the "step" query string parameter, or the first step key if no parameter is present.
  const currentStep = searchParams.get("step") || steps[0].key;

  //The setStep function updates the URL query string to reflect the current step.
  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    //The pushState method of the window.history object is used to update the URL in the browser's address bar without reloading the page.
    //The first argument (null) is the state object associated with the new history entry.
    //The second argument ("") is the title of the new history entry.
    //The third argument (?${newSearchParams.toString()}) is the new URL, which includes the updated query string.
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  //The FormComponent variable is set to the component associated with the current step key.
  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;



  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design You Will</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your will. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:!block md:w-1/2",
              showSmWillPreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent willData={willData} setWillData={setWillData} />
            )}
          </div>
          <div className="grow md:border-r" />

          {/* <pre>{JSON.stringify(willData, null, 2)}</pre> */}
          <WillPreviewSection
            willData={willData}
            setWillData={setWillData}
            className={cn(showSmWillPreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmWillPreview={showSmWillPreview}
        setShowSmWillPreview={setShowSmWillPreview}
        isSaving={isSaving}
      />
    </div>
  );
}
