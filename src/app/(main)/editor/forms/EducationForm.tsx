import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { EducationValues, educationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorFormProps } from "@/lib/types";
import { GripHorizontal } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"; //restrictToVerticalAxis is a modifier that restricts the movement of the sortable element to the vertical axis.
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function EducationForm({
  willData,
  setWillData,
}: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: willData.educations || [],
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
        educations: values.educations?.filter((edu) => edu !== undefined) || [], // filter out undefined values
      });
    });

    return unsubscribe; //cleanup function
  }, [form, setWillData, willData]);

  //fields: An array of field objects representing the
  //current state of the field array. Each object contains
  //properties like id and the values of the fields.
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  //useSensors is a hook that creates a collection of sensors.
 //Combines multiple sensors into one.
  const sensors = useSensors(
    useSensor(PointerSensor), //Creates a sensor that tracks the mouse pointer.
    //tracks keyboard events and uses a function to get the position of the sortable element.
    useSensor(KeyboardSensor, {
      //KeyboardSensor is a sensor that tracks keyboard events.
      coordinateGetter: sortableKeyboardCoordinates, //sortableKeyboardCoordinates is a function that returns the coordinates of the sortable element.
    }),
  );

  //drag and drop
  function handleDragEnd(event: DragEndEvent) {
    //active: The id of the active item.
    //over: The id of the item being dragged over.
    const { active, over } = event;

    //if over is not null and active id is not equal to over id
    //it means the active item is being dragged over another item
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id); //find the index of the active item
      const newIndex = fields.findIndex((field) => field.id === over.id); //find the index of the item being dragged over
      move(oldIndex, newIndex); //move the active item to the new index
      return arrayMove(fields, oldIndex, newIndex); //return the new array
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Educations</h2>
        <p className="text-sm text-muted-foreground">
          Add as many work Educations as you like
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            //closestCenter is a collision detection strategy that determines the closest center of a sortable element.
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]} //restrict movement
          >
            <SortableContext
              items={fields}
              //verticalListSortingStrategy is a sorting strategy that sorts items in a vertical list.
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <EducationItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  degree: "",
                  school: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="btn btn-primary"
            >
              Add Education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface EducationItemProps {
  //UseFormReturn is a type provided by a form library (likely React Hook Form)
  //that represents the return type of the useForm hook.
  id: string;
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
  const {
    attributes,//attributes: An object containing the attributes that need to be applied to the sortable element.
    listeners,//listeners: An object containing the event listeners that need to be applied to the sortable element.
    setNodeRef,//setNodeRef: A function that sets the ref of the sortable element.
    transform,//transform: The transform property that needs to be applied to the sortable element.
    transition,//transition: The transition property that needs to be applied to the sortable element.
    isDragging,//isDragging: A boolean value that indicates whether the sortable element is being dragged.
  } = useSortable({ id });
  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-2xl",
      )}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" 
         {...attributes}
         {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`educations.${index}.degree`} //position is a field in the workExperiences array
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`educations.${index}.school`} //position is a field in the workExperiences array
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`} //position is a field in the workExperiences array
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  type="date"
                  //slice(0, 10) get only first 10 characters dd/mm/yyyy
                  value={field.value?.slice(0, 10)} //slice to get only the date witout time. rm time from timpstamp
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`educations.${index}.endDate`} //position is a field in the workExperiences array
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  type="date"
                  //slice(0, 10) get only first 10 characters dd/mm/yyyy
                  value={field.value?.slice(0, 10)} //slice to get only the date witout time. rm time from timpstamp
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
