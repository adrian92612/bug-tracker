import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email({
    message: "Email address is invalid",
  }),
  password: z.string().trim().min(1, "Password is required"),
});

export const registerFormSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const addUserFormSchema = z
  .object({
    role: z.enum(["ADMIN", "MANAGER", "DEVELOPER", "CONTRIBUTOR", "USER"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const editUserFormSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "DEVELOPER", "CONTRIBUTOR", "USER"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .max(50, "Cannot be more than 50 characters."),
});

export const createProjectSchema = z.object({
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
});
