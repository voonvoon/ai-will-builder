import { EditorFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { SummaryValues, summarySchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function SummaryForm({
  willData,
  setWillData,
}: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: willData.summary || "",
    },
  });

  useEffect(() => {
    //watch() is a function that allows you to watch for changes to the form data and perform side effects when the data changes.
    //unsubscribes is a function that will be called when the component is unmounted to clean up the side effects.
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      //update wills data
      setWillData({
        ...willData,
        ...values,
      });
    });
    return unsubscribe; //cleanup function
  }, [form, setWillData, willData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a brief summary of your professional background and career
          objectives or let the AI generate one from your entered data.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="brief, engaging text about yourself"
                  />
                
                </FormControl>
                <FormMessage />
                <FormDescription>
                    Write a brief summary of your professional background and
                    career objectives.
                  </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
