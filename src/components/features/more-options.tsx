"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TableActionsProps = {
  id: string;
  name: string;
  deleteFn: (id: string) => Promise<boolean>;
};

export const TableActions = ({ id, name, deleteFn }: TableActionsProps) => {
  // const [pending, setPending] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await deleteFn(id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full text-left px-2 h-9">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {name}{" "}
            and related data on our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
