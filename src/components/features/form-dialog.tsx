import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

type FormDialogProps = {
  buttonLabel: string;
  formTitle: string;
  children: React.ReactNode;
  forMoreActions?: boolean;
};

export const FormDialog = ({
  buttonLabel,
  formTitle,
  children,
  forMoreActions = false,
}: FormDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className={forMoreActions ? "w-full px-2 h-9" : ""}
      >
        {forMoreActions ? (
          <Button
            variant="ghost"
            size="xs"
            className="h-8 text-sm font-normal justify-start"
          >
            <CiEdit />
            Edit
          </Button>
        ) : (
          <Button variant="tertiary">
            <FaPlus />
            {buttonLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription className="sr-only">Form Dialog</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
