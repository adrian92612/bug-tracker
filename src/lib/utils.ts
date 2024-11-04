import { Role } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAdminOrManager = (role: Role): boolean => {
  return role === "ADMIN" || role === "MANAGER";
};
