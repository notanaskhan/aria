import Link from "next/link";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function GradientButton({
  href,
  onClick,
  children,
  size = "md",
  className,
  type = "button",
  disabled,
}: GradientButtonProps) {
  const baseClasses = clsx(
    "inline-flex items-center font-medium rounded-full transition-all duration-200",
    "bg-gradient-brand text-white",
    "hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {children}
    </button>
  );
}
