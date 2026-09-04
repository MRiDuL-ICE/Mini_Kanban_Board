"use client";

import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/layout/navbar";

interface CreateColumnModalProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function CreateColumnModal({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
  isPending,
}: CreateColumnModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="New column">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Column name
          </label>
          <input
            className="input"
            placeholder="e.g. In Review, Blocked, Done…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            autoFocus
          />
        </div>
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={isPending || !value.trim()}
            onClick={onSubmit}
          >
            {isPending ? (
              <>
                <Spinner /> Creating…
              </>
            ) : (
              "Create column"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function CreateTaskModal({
  open,
  onClose,
  title,
  description,
  onTitleChange,
  onDescChange,
  onSubmit,
  isPending,
}: CreateTaskModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="New task">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Task title <span className="text-destructive">*</span>
          </label>
          <input
            className="input"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSubmit()}
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Description
          </label>
          <textarea
            className="input min-h-[96px] resize-y"
            placeholder="Optional notes, context, or acceptance criteria…"
            value={description}
            onChange={(e) => onDescChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={isPending || !title.trim()}
            onClick={onSubmit}
          >
            {isPending ? (
              <>
                <Spinner /> Creating…
              </>
            ) : (
              "Create task"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
