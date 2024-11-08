import {
  ProjectStatus,
  Role,
  TicketPriority,
  TicketType,
} from "@prisma/client";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email({
    message: "Email address is invalid",
  }),
  password: z.string().trim().min(1, "Password is required"),
});

export const baseUserFormSchema = z.object({
  id: z.string().optional(),
  role: z.enum(
    Object.values(Role).map((role) => role) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a role" }),
    }
  ),
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .max(50, "Cannot be more than 50 characters."),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email(),
  password: z
    .string()
    .trim()
    .refine(
      (value) => {
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
        const minCharCount = value.length > 0;
        const maxCharCount = value.length <= 50;

        if (
          !hasLowercase ||
          !hasUppercase ||
          !hasNumber ||
          !hasSpecialChar ||
          !minCharCount ||
          !maxCharCount
        ) {
          return false;
        }
        return true;
      },
      {
        message:
          "Password must be between 6 to 50 characters; have at least 1 lowercase, 1 uppercase, 1 number, and 1 special character",
      }
    ),
  confirmPassword: z.string().trim(),
});

export const registerUserFormSchema = baseUserFormSchema
  .omit({ role: true, id: true })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const addUserFormSchema = baseUserFormSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Password do not match",
  }
);

export const editUserFormSchema = baseUserFormSchema
  .omit({ password: true, confirmPassword: true })
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

const projectStatus = z.enum(
  Object.values(ProjectStatus).map((status) => status) as [string, ...string[]]
);

export const projectFormSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string().trim().min(1, "Owner Id is required"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Cannot be more than 50 character"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(150, "Cannot be more than 150 character"),
  deadline: z.date({
    required_error: "Deadline is required",
    invalid_type_error: "Invalid date format",
  }),
  status: projectStatus.optional(),
});

const TicketPriorityEnum = z.enum(
  Object.values(TicketPriority).map((prio) => prio) as [string, ...string[]]
);
const TicketTypeEnum = z.enum(
  Object.values(TicketType).map((type) => type) as [string, ...string[]]
);

export const ticketFormSchema = z.object({
  id: z.string().optional(),
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(1, "Title is required").max(50, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(150, "Description is too long"),
  type: TicketTypeEnum.default("Bug"),
  priority: TicketPriorityEnum.default("Medium"),
  assignedToId: z.string().optional(),
});
