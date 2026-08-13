import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

const baseField =
  "w-full rounded-xl border bg-card px-3.5 py-3 text-[15px] text-foreground shadow-[0_1px_2px_oklch(0.25_0.05_240/0.04)] outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/12 disabled:opacity-60";

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={htmlFor} className="block text-[13px] font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-destructive">
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormInput({
  label,
  error,
  hint,
  icon,
  className,
  ...props
}: {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
} & ComponentPropsWithoutRef<"input">) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint} className={className}>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          aria-invalid={!!error}
          {...props}
          className={`${baseField} ${icon ? "pl-10" : ""} ${
            error ? "border-destructive focus:border-destructive focus:ring-destructive/12" : ""
          }`}
        />
      </div>
    </FieldShell>
  );
}

export function PhoneInput({
  label = "Mobile Number",
  error,
  value,
  onChange,
}: {
  label?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div
        className={`flex items-stretch overflow-hidden rounded-xl border bg-card transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/12 ${
          error ? "border-destructive" : ""
        }`}
      >
        <span className="grid place-items-center border-r border-border bg-secondary px-3.5 text-[15px] font-medium text-muted-foreground">
          +91
        </span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="tel"
          placeholder="98765 43210"
          aria-invalid={!!error}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d ]/g, "").slice(0, 11))}
          className="w-full bg-transparent px-3.5 py-3 text-[15px] tabular-nums outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: {
  label: string;
  error?: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseField} appearance-none pr-10 ${value ? "" : "text-muted-foreground"} ${
            error ? "border-destructive" : ""
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    </FieldShell>
  );
}

export function TextareaField({
  label,
  error,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} error={error} className={className}>
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseField} resize-none ${error ? "border-destructive" : ""}`}
      />
    </FieldShell>
  );
}
