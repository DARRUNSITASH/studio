import type { HTMLAttributes } from "react";

export function Logo({ className, ...props }: HTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/logo.png"
      alt="Medcord Logo"
      className={className}
      {...props}
    />
  );
}
