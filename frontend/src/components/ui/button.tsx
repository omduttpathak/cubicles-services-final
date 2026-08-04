import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded-xl border border-transparent bg-clip-padding",
    "text-sm font-semibold whitespace-nowrap",
    "transition-all duration-300 outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3",
    "aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50",
    "dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "brand-gradient brand-gradient-hover",
          "text-white",
          "shadow-[0_10px_28px_rgb(37_99_235/0.22)]",
          "hover:shadow-[0_18px_42px_rgb(37_99_235/0.3)]",
        ].join(" "),

        outline: [
          "border-slate-300/80",
          "bg-white/80 text-slate-800",
          "backdrop-blur-xl",
          "hover:-translate-y-0.5",
          "hover:border-blue-300",
          "hover:bg-blue-50/80",
          "hover:text-blue-700",
          "hover:shadow-[0_12px_30px_rgb(37_99_235/0.12)]",
          "aria-expanded:border-blue-300",
          "aria-expanded:bg-blue-50",
          "dark:border-white/15",
          "dark:bg-white/5",
          "dark:text-white",
          "dark:hover:border-blue-400/40",
          "dark:hover:bg-white/10",
          "dark:hover:text-blue-200",
        ].join(" "),

        secondary: [
          "border-slate-200/70",
          "bg-slate-100 text-slate-900",
          "hover:-translate-y-0.5",
          "hover:border-indigo-200",
          "hover:bg-indigo-50",
          "hover:text-indigo-700",
          "hover:shadow-[0_10px_28px_rgb(79_70_229/0.1)]",
          "aria-expanded:bg-indigo-50",
          "aria-expanded:text-indigo-700",
          "dark:border-white/10",
          "dark:bg-white/10",
          "dark:text-white",
          "dark:hover:bg-white/15",
        ].join(" "),

        ghost: [
          "text-slate-700",
          "hover:bg-gradient-to-r",
          "hover:from-blue-50",
          "hover:to-violet-50",
          "hover:text-indigo-700",
          "aria-expanded:bg-indigo-50",
          "aria-expanded:text-indigo-700",
          "dark:text-slate-200",
          "dark:hover:bg-white/10",
          "dark:hover:text-blue-200",
        ].join(" "),

        destructive: [
          "border-red-200/80",
          "bg-red-50 text-red-700",
          "hover:-translate-y-0.5",
          "hover:border-red-300",
          "hover:bg-red-100",
          "hover:shadow-[0_10px_28px_rgb(220_38_38/0.12)]",
          "focus-visible:border-red-400",
          "focus-visible:ring-red-500/20",
          "dark:border-red-400/20",
          "dark:bg-red-500/15",
          "dark:text-red-300",
          "dark:hover:bg-red-500/25",
        ].join(" "),

        link: [
          "h-auto rounded-none px-0",
          "text-indigo-600 underline-offset-4",
          "shadow-none",
          "hover:text-violet-700",
          "hover:underline",
          "dark:text-blue-300",
          "dark:hover:text-violet-300",
        ].join(" "),

        white: [
          "border-white",
          "bg-white",
          "text-blue-700",
          "shadow-[0_12px_30px_rgb(15_23_42/0.16)]",
          "hover:-translate-y-0.5",
          "hover:border-slate-100",
          "hover:bg-slate-100",
          "hover:text-blue-800",
          "hover:shadow-[0_18px_40px_rgb(15_23_42/0.2)]",
          "focus-visible:border-white",
          "focus-visible:ring-white/40",
        ].join(" "),

        glass: [
          "border-white/20",
          "bg-white/10",
          "text-white",
          "backdrop-blur-xl",
          "shadow-[0_10px_28px_rgb(15_23_42/0.12)]",
          "hover:-translate-y-0.5",
          "hover:border-white/30",
          "hover:bg-white/20",
          "hover:text-white",
          "hover:shadow-[0_16px_36px_rgb(15_23_42/0.18)]",
          "focus-visible:border-white/40",
          "focus-visible:ring-white/30",
        ].join(" "),
      },

      size: {
        default:
          "h-10 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",

        xs: [
          "h-7 gap-1 rounded-lg px-2.5 text-xs",
          "in-data-[slot=button-group]:rounded-lg",
          "has-data-[icon=inline-end]:pr-2",
          "has-data-[icon=inline-start]:pl-2",
          "[&_svg:not([class*='size-'])]:size-3",
        ].join(" "),

        sm: [
          "h-9 gap-1.5 rounded-lg px-4 text-[0.82rem]",
          "in-data-[slot=button-group]:rounded-lg",
          "has-data-[icon=inline-end]:pr-3",
          "has-data-[icon=inline-start]:pl-3",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(" "),

        lg: [
          "h-12 gap-2 rounded-xl px-7 text-base",
          "has-data-[icon=inline-end]:pr-6",
          "has-data-[icon=inline-start]:pl-6",
        ].join(" "),

        xl: [
          "h-14 gap-2.5 rounded-2xl px-9 text-base",
          "has-data-[icon=inline-end]:pr-8",
          "has-data-[icon=inline-start]:pl-8",
          "[&_svg:not([class*='size-'])]:size-5",
        ].join(" "),

        icon: "size-10 rounded-xl",

        "icon-xs": [
          "size-7 rounded-lg",
          "in-data-[slot=button-group]:rounded-lg",
          "[&_svg:not([class*='size-'])]:size-3",
        ].join(" "),

        "icon-sm": [
          "size-9 rounded-lg",
          "in-data-[slot=button-group]:rounded-lg",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(" "),

        "icon-lg":
          "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-5",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  render,
  nativeButton,
  ...props
}: ButtonProps) {
  const classes = cn(
    buttonVariants({
      variant,
      size,
      className,
    })
  )

  /*
   * When asChild is used, the rendered element may be a React Router Link
   * or an anchor instead of a native button.
   *
   * Base UI must therefore receive nativeButton={false}.
   */
  if (asChild && React.isValidElement(children)) {
    return (
      <ButtonPrimitive
        data-slot="button"
        className={classes}
        render={children}
        nativeButton={false}
        {...props}
      />
    )
  }

  /*
   * When a custom render element is supplied, it may also not be a button.
   * The caller can explicitly provide nativeButton.
   *
   * Otherwise, normal Button usage defaults to a real native button.
   */
  return (
    <ButtonPrimitive
      data-slot="button"
      className={classes}
      render={render}
      nativeButton={nativeButton ?? (render ? false : true)}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
