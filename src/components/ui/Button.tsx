import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-extrabold transition-[color,background-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground shadow-[0_8px_0_var(--pink-deep)] hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        light: "bg-white text-indigo-800 shadow-[0_8px_0_#2c2878] hover:-translate-y-0.5",
        island: "bg-[#ff8fb1] text-[#2a0e17] shadow-[0_8px_0_#c9607f] hover:-translate-y-0.5",
        dim: "bg-white/10 text-white hover:bg-white/15",
        link: "text-primary underline-offset-4 hover:underline",
        unstyled: "",
      },
      size: {
        default: "h-10 rounded-md px-4 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "size-10 rounded-md",
        unstyled: "",
      },
      block: {
        true: "w-full",
        false: "",
      },
      large: {
        true: "min-h-15 px-8 text-lg",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, block, large, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return <Component className={cn(buttonVariants({ variant, size, block, large }), className)} {...props} />;
}

export function ButtonLink({
  className,
  variant,
  size,
  block,
  large,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants>) {
  return (
    <a
      className={cn(buttonVariants({ variant, size, block, large }), className)}
      {...props}
    />
  );
}
