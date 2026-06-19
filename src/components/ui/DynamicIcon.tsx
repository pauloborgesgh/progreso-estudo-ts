import { type LucideIcon, FileCode } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function DynamicIcon({
  name,
  size,
  className,
  fallback,
}: {
  name: string;
  size?: number;
  className?: string;
  fallback?: LucideIcon;
}) {
  const key = name as keyof typeof LucideIcons;
  const Icon = (LucideIcons[key] as LucideIcon | undefined) ?? fallback ?? FileCode;
  return <Icon size={size} className={className} />;
}
