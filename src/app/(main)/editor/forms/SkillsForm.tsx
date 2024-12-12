import { EditorFormProps } from "@/lib/types";
import { SkillsValues, skillsSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

export default function SkillsForm({ willData, setWillData }: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: willData.skills || [],
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
        // do tis else not compatible(TS) cuz work experience can be undefined, we need to filter out undefined values
        skills:
          values.skills
            ?.filter((skill) => skill !== undefined) // filter out undefined values
            .map((skill) => skill.trim()) // empty white spaces in beginning
            .filter((skill) => skill !== "") || [], // filter out empty strings
      });
    });
    return unsubscribe; //cleanup function
  }, [form, setWillData, willData]);

  return (
    <div className="mx-auto max-w-xl space-x-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          What skills do you have?
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control} // control is a prop that is passed to the FormField component to enable the integration of react-hook-form with the form field.
            name="skills" // name is a prop that specifies the name of the field in the form data.
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter your skills, separated by commas"
                    //turn above string into array of skills
                    onChange={(e) => {
                      const skills = e.target.value.split(",");
                      field.onChange(skills);
                    }}
                  />
                </FormControl>
                <FormDescription>
                    Separate skills with commas e.g. JavaScript, React, Node.js
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
