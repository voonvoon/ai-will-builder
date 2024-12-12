import { useForm } from "react-hook-form";
import { PersonalInfoValues, personalInfoSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  //FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { EditorFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function PersonalInfoForm({
  willData,
  setWillData,
}: EditorFormProps) {
  const form = useForm<PersonalInfoValues>({
    //function that will handle the validation of the form data.
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      //photo: undefined,
      firstName: willData.firstName || "",
      lastName: willData.lastName || "",
      jobTitle: willData.jobTitle || "",
      city: willData.city || "",
      country: willData.country || "",
      phone: willData.phone || "",
      email: willData.email || "",
    },
  });

  useEffect(() => {
    //watch() is a function that allows you to watch for changes to the form data and perform side effects when the data changes.
    //unsubscribes is a function that will be called when the component is unmounted to clean up the side effects.
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      //update wills data
      setWillData({ ...willData, ...values });
    });

    return unsubscribe; //cleanup function
  }, [form, setWillData, willData]);

  const photoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Personal Info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="photo"
            //render=This is a render prop function that provides the field's state and methods.
            //field is an object that contains the field's value and methods like onChange, onBlur, etc.
            //value is the current value of the field.
            //The spread operator (...) is used to include all other properties and methods from
            //the field object. This typically includes methods like onChange, onBlur, name, ref, etc.
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Your Photo</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                      ref={photoInputRef}
                    />
                  </FormControl>
                  <Button variant="secondary" type="button" onClick={() => {
                    fieldValues.onChange(null)//'null'effectively clears the value of the photo field in the form, removing the selected photo.
                    //clear the file input element (DOM) by setting its value to an empty string.
                    if (photoInputRef.current) {
                      photoInputRef.current.value = "";//clears the value of the file input element, effectively resetting it.
                    }
                    
                  }}>Remove</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Software Engineer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Kual Lumpur" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Malaysia" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="0166307788" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
