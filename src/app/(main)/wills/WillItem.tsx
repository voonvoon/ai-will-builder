"use client";

import { Button } from "@/components/ui/button";
import WillPreview from "@/components/WillPreview";
import { useToast } from "@/hooks/use-toast";
import { WillServerData } from "@/lib/types";
import { mapToWillValues } from "@/lib/utils";

import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { deleteWill } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingButton from "@/components/LoadingButton";
import { useReactToPrint } from "react-to-print";

interface WillItemProps {
  will: WillServerData;
}

export default function WillItem({ will }: WillItemProps) {

  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: will.title || "Will",
  });

  const wasUpdated = will.updatedAt !== will.createdAt; //Check if the will was updated

  // border-border:1st border indicates that you are applying a border style, 2nd border is  a custom color or style defined
  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        <Link
          href={`/editor?willId=${will.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {will.title || "No Title"}
          </p>
          {will.description && (
            <p className="line-clamp-2 text-sm">{will.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on :{" "}
            {formatDate(will.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?willId=${will.id}`}
          className="relative inline-block w-full"
        >
          <WillPreview
            willData={mapToWillValues(will)}
            contentRef={contentRef}
            className="overflow-hidden shadow-md transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <MoreMenu willId={will.id} onPrintClick={reactToPrintFn}/>
    </div>
  );
}

interface MoreMenuProps {
  willId: string;
  onPrintClick: () => void;
}

function MoreMenu({ willId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={onPrintClick}
          >
            <Printer className="size-4" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        willId={willId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationDialogProps {
  willId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  willId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast();

  //when use revalidatePath in client, should use useTransition to avoid flickering
  //isPending: A boolean that indicates whether the transition is ongoing.
  //startTransition: A function that you use to start the transition.
  //useTransition is used to manage non-urgent state updates.
  const [isPending, startTransition] = useTransition();


  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteWill(willId);
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Something went wrong, please try again later",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the will. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
