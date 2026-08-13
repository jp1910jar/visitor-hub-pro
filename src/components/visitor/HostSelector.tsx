import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Check, UserRound } from "lucide-react";
import { HOSTS, type Host } from "@/lib/visitor-data";

export function HostSelector({
  value,
  onSelect,
  error,
}: {
  value: string;
  onSelect: (host: Host) => void;
  error?: string | undefined;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HOSTS;
    return HOSTS.filter((h) =>
      [h.name, h.department, h.designation].some((f) => f.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <span className="block text-[13px] font-medium text-foreground">Whom are you visiting?</span>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employee, department…"
          aria-label="Search employee"
          className="w-full rounded-xl border bg-card py-3 pl-10 pr-3.5 text-[15px] outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/12"
        />
      </div>

      <div className="max-h-[268px] space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {results.map((host) => {
            const selected = value === host.id;
            return (
              <motion.button
                key={host.id}
                layout
                type="button"
                onClick={() => onSelect(host)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  selected
                    ? "border-primary bg-accent/60 shadow-[0_0_0_4px_oklch(0.53_0.106_227/0.1)]"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/60"
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-[13px] font-semibold text-primary-foreground">
                  {host.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{host.name}</span>
                  <span className="block truncate text-[12.5px] text-muted-foreground">
                    {host.designation} · {host.department}
                  </span>
                </span>
                {selected ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                ) : (
                  <UserRound className="size-4 shrink-0 text-muted-foreground/60" aria-hidden />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="text-[14px] font-medium">No employee found</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Try a different name or ask reception for help.
            </p>
          </div>
        ) : null}
      </div>
      {error ? <p className="text-[12px] font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
