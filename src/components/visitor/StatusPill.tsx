import { STATUS_META, type VisitStatus } from "@/lib/visitor-data";

const TONES: Record<string, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  info: "bg-accent text-accent-foreground",
  success: "bg-success/12 text-success",
  warning: "bg-warning/16 text-[oklch(0.5_0.13_60)]",
  danger: "bg-destructive/12 text-destructive",
};

export function StatusPill({
  status,
  pulse = false,
}: {
  status: VisitStatus;
  pulse?: boolean;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${TONES[meta.tone]}`}
    >
      <span className="relative grid size-2 place-items-center">
        <span className="size-2 rounded-full bg-current" />
        {pulse ? (
          <span className="absolute size-2 animate-ping rounded-full bg-current opacity-70" />
        ) : null}
      </span>
      {meta.label}
    </span>
  );
}
