"use client";

import { CircleAlert } from "lucide-react";

interface AuthErrorAlertProps {
  message: string;
}

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
