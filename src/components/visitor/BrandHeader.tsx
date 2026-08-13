import { HelpCircle, Globe } from "lucide-react";
import { COMPANY } from "@/lib/visitor-data";

/**
 * Brand lockup. Drop the official logo file into src/assets and swap the
 * <BrandMark /> block for an <img> once the asset is provided.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-[15px] font-bold tracking-tight text-primary-foreground shadow-[var(--shadow-card)]">
        A
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-semibold tracking-tight">{COMPANY.name}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Visitor Portal
        </div>
      </div>
    </div>
  );
}

export function BrandHeader({ centered = false }: { centered?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 glass-panel">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <BrandMark className={centered ? "mx-auto sm:mx-0" : ""} />
        <div className="hidden items-center gap-1 sm:flex">
          <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Globe className="size-4" aria-hidden />
            EN
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <HelpCircle className="size-4" aria-hidden />
            Need Help?
          </button>
        </div>
      </div>
    </header>
  );
}
