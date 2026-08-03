import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  subtitle?: React.ReactNode;
  meta?: string;
  footer?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function PageTitle({
  title,
  subtitle,
  meta,
  footer,
  align = "left",
  className,
}: PageTitleProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "relative inline-flex flex-col",
        isCenter ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {/* Decorative corner brackets */}
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary/50" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary/50" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary/50" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary/50" />

      {/* Top meta label */}
      {meta && (
        <div className={cn("flex items-center gap-3 mb-3", isCenter && "justify-center")}>
          <span className="h-px w-8 bg-primary/30" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
            {meta}
          </span>
          <span className="h-px w-8 bg-primary/30" />
        </div>
      )}

      {/* Main title with gradient and ghost shadow */}
      <div className="relative">
        <h1
          className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient-title drop-shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
          aria-label={title}
        >
          {title}
        </h1>
        <span
          className="absolute inset-0 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary/10 blur-sm translate-y-1 select-none pointer-events-none"
          aria-hidden="true"
        >
          {title}
        </span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>
      )}

      {/* Footer meta */}
      {footer && (
        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-[10px] text-primary/70">
          {footer}
        </div>
      )}

      {/* Bottom scanline accent */}
      <div
        className={cn(
          "absolute -bottom-5 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent",
          isCenter ? "left-1/2 -translate-x-1/2 w-48" : "left-0 w-32",
        )}
      />
    </div>
  );
}
