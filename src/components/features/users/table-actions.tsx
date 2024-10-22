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
import { deleteUser } from "@/lib/actions/user-actions";
import { useState } from "react";

type TableActionsProps = {
  id: string;
  name: string;
};

export const TableActions = ({ id, name }: TableActionsProps) => {
  const [pending, setPending] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setPending(true);
      await deleteUser(id);
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
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
            and their data on our servers.
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
