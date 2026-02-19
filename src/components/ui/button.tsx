"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, disabled, className = "", ...props }, ref) => {
    const base = "font-sans rounded-full transition-all duration-200 tracking-wide cursor-pointer disabled:cursor-default lowercase";

    const variants = {
      primary: "bg-ink text-white hover:bg-ink-light disabled:bg-border disabled:text-mid-gray",
      secondary: "bg-transparent text-ink border border-border hover:border-ink disabled:text-mid-gray",
      ghost: "bg-transparent text-ink hover:text-ink-light disabled:text-mid-gray",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs font-semibold",
      md: "px-6 py-2.5 text-sm font-semibold",
      lg: "px-8 py-3 text-sm font-semibold",
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
