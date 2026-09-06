"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Plus } from "lucide-react";
import { TaskCard } from "./task-card";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  assigneeId?: string;
  createdAt?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string; // optional accent color
}

interface BoardColumnProps {
  column: Column;
  canEdit: boolean;
  onAddTask: (columnId: string) => void;
  onOpenTaskDetail: (task: Task) => void;
  activeTaskId: string | null; // currently dragged task
}

// Palette of column accent colours – cycles by index
const COLUMN_COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#0ea5e9", // sky
  "#f43f5e", // rose
];

let columnColorIndex = 0;
const columnColorMap = new Map<string, string>();

function getColumnColor(id: string) {
  if (!columnColorMap.has(id)) {
    columnColorMap.set(
      id,
      COLUMN_COLORS[columnColorIndex++ % COLUMN_COLORS.length],
    );
  }
  return columnColorMap.get(id)!;
}

// Empty drop zone — so you can drop into an empty column
function EmptyDropZone({ columnId }: { columnId: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: `empty-${columnId}` });
  return (
    <div
      ref={setNodeRef}
      className={[
        "flex min-h-[80px] items-center justify-center rounded-lg border-2 border-dashed text-xs text-muted-foreground transition-colors",
        isOver
          ? "border-primary/50 bg-primary/5 text-primary"
          : "border-border/50",
      ].join(" ")}
    >
      Drop here
    </div>
  );
}

export function BoardColumn({
  column,
  canEdit,
  onAddTask,
  onOpenTaskDetail,
  activeTaskId,
}: BoardColumnProps) {
  const accentColor = getColumnColor(column.id);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column" },
    disabled: !canEdit,
  });

  return (
    <section
      ref={setSortableRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex w-[min(88vw,300px)] shrink-0 flex-col gap-0 rounded-2xl border border-border/60 bg-muted/40 backdrop-blur-sm sm:w-[300px]"
    >
      {/* Column header */}
      <div
        className="flex items-center gap-2 px-3 py-3"
        style={{
          borderTop: `3px solid ${accentColor}`,
          borderRadius: "14px 14px 0 0",
        }}
      >
        {/* Drag handle for column */}
        {canEdit && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-3.5" />
          </div>
        )}

        {/* Color dot + title */}
        <div
          className="size-2 rounded-full"
          style={{ background: accentColor }}
        />
        <h2 className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight">
          {column.title}
        </h2>

        {/* Task count badge */}
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {column.tasks.length}
        </span>

        <button className="rounded-md p-1 text-muted-foreground/50 hover:bg-card hover:text-foreground">
          <MoreHorizontal className="size-3.5" />
        </button>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2 px-2.5 pb-2">
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.length === 0 ? (
            <EmptyDropZone columnId={column.id} />
          ) : (
            column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                canEdit={canEdit}
                onOpenDetail={onOpenTaskDetail}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add task button */}
      {canEdit && (
        <button
          onClick={() => onAddTask(column.id)}
          className="mx-2.5 mb-2.5 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <Plus className="size-3.5" />
          Add task
        </button>
      )}
    </section>
  );
}
