import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-primary-foreground shadow-[0_10px_24px_-12px_oklch(0.53_0.106_227/0.6)] hover:shadow-[0_16px_34px_-14px_oklch(0.53_0.106_227/0.7)]",
  outline: "border border-border bg-card text-foreground hover:bg-secondary",
  ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
};

export function ActionButton({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}: {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      {...props}

      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        size === "lg" ? "px-6 py-4 text-[15px]" : "px-5 py-3 text-[14.5px]"
      } ${VARIANTS[variant]} ${className}`}
    >
      {children}
      {icon}
    </motion.button>
  );
}
