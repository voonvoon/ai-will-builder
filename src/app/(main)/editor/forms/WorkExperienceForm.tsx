import { EditorFormProps } from "@/lib/types";
import { WorkExperienceValues, workExperienceSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GripHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

export default function WorkExperienceForm({
  willData,
  setWillData,
}: EditorFormProps) {
  const form = useForm<WorkExperienceValues>({
    //resolver:integrate external validation libraries (Zod) with react-hook-form.
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: willData.workExperiences || [],
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
        workExperiences:
          values.workExperiences?.filter((exp) => exp !== undefined) || [], // filter out undefined values
      });
    });

    return unsubscribe; //cleanup function
  }, [form, setWillData, willData]);

  //fields: An array of field objects representing the
  //current state of the field array. Each object contains
  //properties like id and the values of the fields.
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  //useSensors is a hook that creates a collection of sensors.
  const sensors = useSensors(
    useSensor(PointerSensor), //PointerSensor is a sensor that tracks the position of the pointer.
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
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add as many work experience as you like
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]} //restrict movement
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <WorkExperienceItem
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
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
              className="btn btn-primary"
            >
              Add Work Experience
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface WorkExperienceItemProps {
  id: string;
  //UseFormReturn is a type provided by a form library (likely React Hook Form)
  //that represents the return type of the useForm hook.
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

function WorkExperienceItem({
  id,
  form,
  index,
  remove,
}: WorkExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
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
        <span className="font-semibold">Work Experience {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`} //position is a field in the workExperiences array
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`} //company is a field in the workExperiences array
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
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
          name={`workExperiences.${index}.startDate`} //position is a field in the workExperiences array
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
          name={`workExperiences.${index}.endDate`} //position is a field in the workExperiences array
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
      <FormDescription>
        Leave <span className="font-semibold">end date</span> empty if you are
        still working here
      </FormDescription>

      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`} //position is a field in the workExperiences array
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
