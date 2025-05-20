import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-input",
        filled: "bg-muted border-transparent focus-visible:bg-background",
        ghost: "border-transparent bg-transparent shadow-none",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive text-destructive placeholder:text-destructive/50",
        success: "border-success focus-visible:ring-success",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-2 py-1 text-xs rounded-md",
        lg: "h-12 px-4 py-3 text-base rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "state"> {
  variant?: VariantProps<typeof inputVariants>["variant"]
  state?: VariantProps<typeof inputVariants>["state"]
  size?: VariantProps<typeof inputVariants>["size"]
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, state, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, state, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
