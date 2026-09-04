"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, MoreHorizontal, GripVertical } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  createdAt?: string;
}

interface TaskCardProps {
  task: Task;
  canEdit: boolean; // OWNER | EDITOR
  onOpenDetail: (task: Task) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function TaskCard({ task, canEdit, onOpenDetail }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !canEdit,
  });

  const [completed, setCompleted] = useState(false);

  //   console.log("task", task);

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : "auto",
      }}
      className={[
        "group relative rounded-xl border bg-card shadow-sm",
        "transition-all duration-150",
        isDragging
          ? "shadow-2xl ring-2 ring-primary/30 scale-[1.02]"
          : "hover:shadow-md hover:-translate-y-0.5",
        completed ? "opacity-60" : "",
      ].join(" ")}
    >
      {/* Drag handle — only shown to editors/owners */}
      {canEdit && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-0 bottom-0 flex w-7 cursor-grab items-center justify-center rounded-l-xl opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-3.5 text-muted-foreground" />
        </div>
      )}

      <div className={["p-3.5", canEdit ? "pl-7" : ""].join(" ")}>
        {/* Top row */}
        <div className="mb-2.5 flex items-start gap-2">
          <button
            onClick={() => setCompleted((c) => !c)}
            className="mt-0.5 shrink-0"
            aria-label={completed ? "Mark incomplete" : "Mark complete"}
          >
            <CheckCircle2
              className={[
                "size-4 transition-colors",
                completed
                  ? "text-emerald-500"
                  : "text-muted-foreground/30 hover:text-emerald-400",
              ].join(" ")}
            />
          </button>

          <h3
            className={[
              "flex-1 text-sm font-medium leading-snug",
              completed ? "line-through text-muted-foreground" : "",
            ].join(" ")}
          >
            {task.title}
          </h3>

          {/* Actions button */}
          <button
            onClick={() => onOpenDetail(task)}
            className="shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            aria-label="Task options"
          >
            <MoreHorizontal className="size-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Description preview */}
        {task.description && (
          <p className="mb-3 ml-6 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="ml-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
              Task
            </span>
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(task.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
