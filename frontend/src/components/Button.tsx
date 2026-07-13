/* Spec §2 — Button component
   Four variants × three sizes. Never invent a fifth variant. */

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "proof" | "ghost" | "danger";
type Size    = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-axiom text-bone font-semibold hover:bg-axiom-hover border-0",
  proof:   "bg-proof text-[#2B1206] font-semibold hover:bg-proof-hover border-0",
  ghost:   "bg-transparent text-t2 border border-line hover:text-ink hover:border-t3",
  danger:  "bg-transparent text-danger border border-danger/35 hover:bg-danger-tint",
};

const sizeClasses: Record<Size, string> = {
  lg: "px-6 py-[13px] text-[15px] rounded-md",
  md: "px-[18px] py-[10px] text-[13.5px] rounded-md",
  sm: "px-[13px] py-[7px] font-mono text-[12px] rounded-sm",
};

/* Ghost variant on ink surface (header) */
export const GhostInkButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", size = "md", block, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
        inline-flex items-center gap-2 transition-all duration-[120ms]
        bg-transparent text-ti2 border border-line-ink hover:text-ti1 hover:border-ti3
        active:translate-y-px focus-visible:outline-2 focus-visible:outline-axiom
        disabled:opacity-40 disabled:pointer-events-none
        ${sizeClasses[size]} ${block ? "w-full justify-center" : ""} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
);
GhostInkButton.displayName = "GhostInkButton";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block, className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
        inline-flex items-center gap-2 transition-all duration-[120ms]
        active:translate-y-px focus-visible:outline-2 focus-visible:outline-axiom
        disabled:opacity-40 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${block ? "w-full justify-center" : ""} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

export default Button;
