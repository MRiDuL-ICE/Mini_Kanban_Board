import { FolderKanban, Plus, X } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../layout/navbar";

export default function CreateBoardModal({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-border bg-[var(--surface-0)] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <FolderKanban className="size-4 text-primary" />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          Create a new board
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Give your next project a place to land.
        </p>
        <div className="mb-5">
          <label
            htmlFor="board-title"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Board name
          </label>
          <input
            id="board-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Product launch Q4"
            className="input"
          />
        </div>
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button disabled={isPending || !title.trim()} className="btn-primary">
            {isPending ? (
              <>
                <Spinner /> Creating…
              </>
            ) : (
              <>
                <Plus className="size-4" /> Create board
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
