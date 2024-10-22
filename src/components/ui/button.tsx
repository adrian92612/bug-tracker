import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-700 text-neutral-100",
        secondary:
          "bg-gradient-to-b from-slate-50 to-slate-200 hover:from-slate-200 hover:to-slate-200",
        tertiary:
          "bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-700 text-neutral-100",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-700 hover:from-red-700 hover:to-red-700 text-neutral-100",
        outline: "border border-slate-800 bg-transparent hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
        ghost: "hover:bg-accent hover:text-slate-800",
        none: "",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 px-2",
        sm: "h-8 px-2",
        lg: "h-10 px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
