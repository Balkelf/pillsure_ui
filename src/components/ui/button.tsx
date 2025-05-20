import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tap-highlight",
  {
    variants: {
      variant: {
        // Primary button: Bold background in primary color, white text
        default: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80 shadow-sm font-medium",
        
        // Secondary button: Lighter or neutral style
        secondary: "bg-gray-100 text-neutral-700 hover:bg-gray-200 active:bg-gray-300 shadow-sm",
        
        // Outline/ghost button: White or transparent background with colored text/border
        outline: "border border-input text-foreground bg-background hover:bg-accent/10 active:bg-accent/20",
        
        // Primary outline button: Clean outline with primary color
        "primary-outline": "border border-primary text-primary bg-transparent hover:bg-primary/10 active:bg-primary/20 font-medium",
        
        // Additional variants - keeping them consistent with the main variants
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 shadow-sm",
        ghost: "bg-transparent hover:bg-muted active:bg-muted/70",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        success: "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 shadow-sm",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-10",
        sm: "h-9 rounded-md px-3 py-1.5 min-h-9 text-xs",
        lg: "h-12 rounded-md px-6 py-3 min-h-12 text-base",
        xl: "h-14 rounded-lg px-8 py-4 min-h-14 text-lg",
        icon: "h-10 w-10 min-h-10 min-w-10",
        "icon-sm": "h-8 w-8 min-h-8 min-w-8 [&_svg]:size-3.5",
        "icon-lg": "h-12 w-12 min-h-12 min-w-12 [&_svg]:size-5",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
