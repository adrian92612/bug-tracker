"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { IoIosMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { TableActions } from "./table-actions";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 w-full justify-start"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 w-full justify-start"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 w-full justify-start"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-3xl justify-center">
            <IoIosMore />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/users/${user.id}/edit`}
                className="w-full text-base"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <TableActions id={user.id} name={user.name} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 70,
  },
];
