"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, disabled, className = "", ...props }, ref) => {
    const base = "font-serif rounded-sm transition-all duration-200 tracking-wide cursor-pointer disabled:cursor-default";

    const variants = {
      primary: "bg-ink-dark text-cream hover:bg-ink disabled:bg-sand-dark",
      secondary: "bg-transparent text-ink-dark border border-sand hover:border-ink-dark disabled:text-stone-dark",
      ghost: "bg-transparent text-ink-dark hover:text-ink disabled:text-stone-dark",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? "..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
