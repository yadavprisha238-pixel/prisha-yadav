import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hoverEffect = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl ${
        hoverEffect ? "glass-panel-hover cursor-pointer" : ""
      } ${glow ? "shadow-glass-glow border-indigo-500/20" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
