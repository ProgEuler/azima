import type React from "react";
import { cn } from "@/lib/utils";

export type LogoSize = "sm" | "md" | "lg";

const sizeMap: Record<LogoSize, { badge: number; text: string }> = {
  sm: { badge: 24, text: "text-base" },
  md: { badge: 56, text: "text-xl" },
  lg: { badge: 86, text: "text-2xl" },
};

const HAS_HEIGHT_CLASS = /\bh-\d|\bsize-\d/;

export type LogoProps = Omit<React.ComponentProps<"div">, "children"> & {
  size?: LogoSize;
  full?: boolean;
  /** Optional alt text. Defaults to "Azima". */
  alt?: string;
};

export function Logo({
  size = "md",
  full = false,
  alt = "Azima",
  className,
  ...props
}: LogoProps) {
  const { badge, text } = sizeMap[size];

  // If the caller passes their own sizing class, defer to it for the badge
  // and drop the wordmark text size utility — caller is in charge.
  const callerHasSize = !!className && HAS_HEIGHT_CLASS.test(className);

  const img = (
    <img
      src="/logo.png"
      alt={alt}
      width={badge}
      height={badge}
      draggable={false}
      className={cn("block shrink-0", callerHasSize ? "h-full w-auto" : "size-auto")}
      style={callerHasSize ? undefined : { width: badge, height: badge }}
    />
  );

  if (!full) {
    return (
      <div
        {...props}
        className={cn("inline-flex shrink-0 items-center", className)}
      >
        {img}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={cn("inline-flex shrink-0 items-center gap-2", className)}
    >
      {img}
      <span
        className={cn(
          "font-heading font-bold tracking-tight text-foreground leading-none",
          callerHasSize ? "" : text,
        )}
      >
        azima
      </span>
    </div>
  );
}

/**
 * Bare-image variant kept for backward compatibility with old call sites
 * that used `<LogoIcon />`. Renders just the PNG at the requested size.
 */
export function LogoIcon({
  size = "md",
  alt = "Azima",
  className,
  ...props
}: Omit<React.ComponentProps<"img">, "src"> & { size?: LogoSize }) {
  const { badge } = sizeMap[size];
  const callerHasSize = !!className && HAS_HEIGHT_CLASS.test(className);
  return (
    <img
      {...props}
      src="/logo.png"
      alt={alt}
      width={badge}
      height={badge}
      draggable={false}
      className={cn("block shrink-0", callerHasSize ? "h-full w-auto" : "size-auto", className)}
      style={callerHasSize ? undefined : { width: badge, height: badge }}
    />
  );
}
