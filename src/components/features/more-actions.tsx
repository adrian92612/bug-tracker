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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";
import { Button } from "../ui/button";

type DeleteDialogProps = {
  id: string;
  name: string;
  deleteFn: (id: string) => Promise<boolean>;
  setIsOpen: (open: boolean) => void;
};

export const DeleteDialog = ({
  id,
  name,
  deleteFn,
  setIsOpen,
}: DeleteDialogProps) => {
  const handleDelete = async () => {
    try {
      setIsOpen(false);
      await deleteFn(id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full text-left px-2 h-9">
        <Button
          variant="ghost"
          size="xs"
          className="h-8 text-sm font-normal justify-start"
        >
          Delete
        </Button>
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

type MoreActionsDropdown = {
  id: string;
  name: string;
  pageHref: string;
  deleteFn: (id: string) => Promise<boolean>;
};

export const MoreActionsDropdown = ({
  id,
  name,
  pageHref,
  deleteFn,
}: MoreActionsDropdown) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="text-3xl justify-center">
        <IoIosMore />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={pageHref}
            className="w-full text-base hover:cursor-pointer"
          >
            Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteDialog
            id={id}
            name={name}
            deleteFn={deleteFn}
            setIsOpen={setIsOpen}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
