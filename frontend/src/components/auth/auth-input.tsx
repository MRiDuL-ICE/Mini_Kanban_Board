"use client";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

export function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  optional,
  autoComplete,
  placeholder,
}: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {optional && (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}
