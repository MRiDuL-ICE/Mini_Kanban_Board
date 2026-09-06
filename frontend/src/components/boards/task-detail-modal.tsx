"use client";

import { useEffect, useRef, useState } from "react";
import { X, User, AlignLeft, Tag, Trash2, Check, Save } from "lucide-react";
import type { BoardMember } from "@/types/domain";
import { Spinner } from "../layout/navbar";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  assigneeId?: string;
  createdAt?: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  canEdit: boolean;
  boardMembers: BoardMember[];
  onUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

function getInitials(name?: string | null) {
  return (name?.trim() || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TaskDetailModal({
  task,
  open,
  onClose,
  canEdit,
  boardMembers,
  onUpdate,
  onDelete,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setAssigneeId(task.assigneeId ?? null);
      setSaved(false);
    }
  }, [task]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  if (!open || !task) return null;

  const selectedMember = boardMembers.find(
    (member) => member.userId === assigneeId,
  );

  const dirty =
    title !== task.title ||
    description !== (task.description ?? "") ||
    assigneeId !== (task.assigneeId ?? null);

  async function handleSave() {
    if (!task || !dirty) return;
    setSaving(true);
    try {
      await onUpdate(task.id, {
        title: title.trim() || task.title,
        description: description || undefined,
        assigneeId: selectedMember ? selectedMember.userId : undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!task || !onDelete) return;
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`))
      return;
    await onDelete(task.id);
    onClose();
  }

  return (
    <div>
      <div
        className="fixed inset-0 z-40 bg-foreground p-4 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface-0 text-text-primary shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            Task
          </span>
          <div className="flex items-center gap-2">
            {canEdit && dirty && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex btn-primary items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {saved ? (
                  <>
                    <Check className="size-3" /> Saved
                  </>
                ) : saving ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save changes
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={!canEdit}
              rows={1}
              className={[
                "w-full resize-none overflow-hidden bg-transparent text-xl font-semibold leading-snug tracking-tight outline-none",
                canEdit
                  ? "rounded-lg px-2 py-1 -mx-2 hover:bg-muted/60 focus:bg-muted"
                  : "",
              ].join(" ")}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <AlignLeft className="size-3.5" /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              readOnly={!canEdit}
              rows={4}
              placeholder={canEdit ? "Add a description…" : "No description"}
              className={[
                "w-full resize-none rounded-lg bg-muted/50 px-3 py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50 border border-border",
                canEdit
                  ? "focus:bg-muted focus:ring-1 focus:ring-border"
                  : "opacity-70",
              ].join(" ")}
            />
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <User className="size-3.5" /> Assignee
            </label>

            {canEdit ? (
              <div className="relative">
                <button
                  onClick={() => setAssigneeOpen((o) => !o)}
                  className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm hover:bg-muted"
                >
                  {selectedMember ? (
                    <>
                      <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[9px] font-bold text-white">
                        {getInitials(selectedMember.user.name)}
                      </div>
                      <span className="flex-1 text-left">
                        {selectedMember.user.name || selectedMember.user.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedMember.role}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex size-6 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                        <User className="size-3" />
                      </div>
                      <span className="text-muted-foreground">Unassigned</span>
                    </>
                  )}
                </button>

                {assigneeOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-surface-1 shadow-lg">
                    <button
                      onClick={() => {
                        setAssigneeId(null);
                        setAssigneeOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      <div className="flex size-6 items-center justify-center rounded-full border border-dashed border-border">
                        <User className="size-3" />
                      </div>
                      Unassigned
                    </button>
                    {boardMembers.map((member) => (
                      <button
                        key={member.userId}
                        onClick={() => {
                          setAssigneeId(member.userId);
                          setAssigneeOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                      >
                        <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[9px] font-bold text-white">
                          {getInitials(member.user.name)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">
                            {member.user.name || member.user.email}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {member.user.email}
                          </div>
                        </div>
                        {assigneeId === member.userId && (
                          <Check className="size-3.5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                {selectedMember ? (
                  <>
                    <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-[9px] font-bold text-white">
                      {getInitials(selectedMember.user.name)}
                    </div>
                    <span className="text-sm">
                      {selectedMember.user.name || selectedMember.user.email}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Task ID</span>
              <code className="font-mono text-muted-foreground">
                {task.id.slice(0, 8)}…
              </code>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Created</span>
              <span className="text-muted-foreground">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer — danger zone */}
        {canEdit && onDelete && (
          <div className="border-t px-5 py-4">
            <button
              onClick={handleDelete}
              className="flex btn-ghost bg-red-500 text-white border-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" /> Delete task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
