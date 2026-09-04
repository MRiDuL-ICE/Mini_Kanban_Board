"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { ArrowLeft, CirclePlus, Users } from "lucide-react";

import { useBoard, useCreateColumn } from "@/hooks/use-boards";
import {
  useCreateTask,
  useMoveTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";

import { BoardColumn } from "@/components/boards/board-column";
import { TaskCard } from "@/components/boards/task-card";
import { TaskDetailModal } from "@/components/boards/task-detail-modal";
import {
  CreateColumnModal,
  CreateTaskModal,
} from "@/components/boards/board-modals";
import { MembersModal } from "@/components/boards/members-modal";
import { PageSkeleton } from "@/components/layout/navbar";

type Role = "OWNER" | "EDITOR" | "VIEWER";

interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  createdAt?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

function canEdit(role: Role | null | undefined): boolean {
  return role === "OWNER" || role === "EDITOR";
}

function canManageBoard(role: Role | null | undefined): boolean {
  return role === "OWNER";
}

function findTaskLocation(
  columns: Column[],
  taskId: string,
): { columnId: string; index: number } | null {
  for (const col of columns) {
    const idx = col.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) return { columnId: col.id, index: idx };
  }
  return null;
}

function resolveDropTarget(
  columns: Column[],
  overId: string,
): { columnId: string; index: number } | null {
  if (overId.startsWith("empty-")) {
    const columnId = overId.slice(6);
    return { columnId, index: 0 };
  }

  const taskLoc = findTaskLocation(columns, overId);
  if (taskLoc) return taskLoc;

  const col = columns.find((c) => c.id === overId);
  if (col) return { columnId: col.id, index: col.tasks.length };

  return null;
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params?.boardId as string;

  const { board, role, loading, error } = useBoard(boardId);
  const { user, loading: authLoading, requireAuth } = useAuth();

  const createColumn = useCreateColumn();
  const createTask = useCreateTask();
  const moveTask = useMoveTask();
  const updateTask = useUpdateTask?.();
  const deleteTask = useDeleteTask?.();

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);

  const [optimisticColumns, setOptimisticColumns] = useState<Column[] | null>(
    null,
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) requireAuth();
  }, [authLoading, requireAuth]);

  useEffect(() => {
    if (board?.columns) setOptimisticColumns(board.columns);
  }, [board?.columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  // ── Derived ────────────────────────────────────────────────────────────────
  const userCanEdit = canEdit(role as Role);
  const userCanManage = canManageBoard(role as Role);
  const columns: Column[] = optimisticColumns ?? board?.columns ?? [];

  const allTaskIds = columns.flatMap((c) => c.tasks.map((t) => t.id));

  const boardMembers: any[] = board?.members ?? [];

  if (loading || authLoading) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
        <PageSkeleton board />
      </main>
    );
  }

  if (error || !board) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-20 text-center text-sm text-muted-foreground">
        Board not found.
      </main>
    );
  }

  async function handleCreateColumn() {
    if (!newColumnTitle.trim()) return;
    try {
      await createColumn.mutateAsync({ boardId, title: newColumnTitle.trim() });
      setNewColumnTitle("");
      setColumnModalOpen(false);
    } catch {
      window.alert("Failed to create column");
    }
  }

  function openTaskModal(columnId: string) {
    setActiveColumnId(columnId);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setTaskModalOpen(true);
  }

  async function handleCreateTask() {
    if (!activeColumnId || !newTaskTitle.trim()) return;
    try {
      await createTask.mutateAsync({
        columnId: activeColumnId,
        title: newTaskTitle.trim(),
        description: newTaskDesc || undefined,
        assigneeId: user?.id,
      });
      setTaskModalOpen(false);
    } catch {
      window.alert("Failed to create task");
    }
  }

  async function handleUpdateTask(taskId: string, data: Partial<Task>) {
    if (!updateTask) return;
    try {
      await updateTask.mutateAsync({ taskId, boardId, data });
      setDetailTask((prev) => (prev ? { ...prev, ...data } : prev));
    } catch {
      window.alert("Failed to update task");
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!deleteTask) return;
    try {
      await deleteTask.mutateAsync({ taskId, boardId });
    } catch {
      window.alert("Failed to delete task");
    }
  }

  function onDragStart({ active }: DragStartEvent) {
    setActiveTaskId(active.id as string);
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over || !userCanEdit) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const sourceLoc = findTaskLocation(columns, taskId);
    const target = resolveDropTarget(columns, overId);

    if (!sourceLoc || !target) return;

    if (
      sourceLoc.columnId === target.columnId &&
      sourceLoc.index === target.index
    )
      return;

    setOptimisticColumns((prev) => {
      if (!prev) return prev;
      const next: Column[] = prev.map((c) => ({
        ...c,
        tasks: [...c.tasks],
      }));

      const srcCol = next.find((c) => c.id === sourceLoc.columnId)!;
      const dstCol = next.find((c) => c.id === target.columnId)!;

      const [task] = srcCol.tasks.splice(sourceLoc.index, 1);

      const insertIdx =
        srcCol === dstCol && target.index > sourceLoc.index
          ? target.index - 1
          : target.index;

      dstCol.tasks.splice(Math.min(insertIdx, dstCol.tasks.length), 0, task);

      return next;
    });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTaskId(null);

    if (!over || !userCanEdit) {
      setOptimisticColumns(board?.columns ?? null);
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    const finalLoc = findTaskLocation(columns, taskId);
    const target = resolveDropTarget(board?.columns ?? columns, overId);

    if (!finalLoc || !target) {
      setOptimisticColumns(board?.columns ?? null);
      return;
    }

    moveTask.mutate(
      {
        boardId,
        taskId,
        columnId: finalLoc.columnId,
        position: finalLoc.index,
      },
      {
        onError: () => {
          setOptimisticColumns(board?.columns ?? null);
          window.alert("Failed to move task");
        },
      },
    );
  }

  const activeTask = activeTaskId
    ? (columns.flatMap((c) => c.tasks).find((t) => t.id === activeTaskId) ??
      null)
    : null;

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        {/* Board header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <button
              onClick={() => router.push("/boards")}
              className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> All boards
            </button>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[0.45rem] bg-primary text-primary-foreground">
                <span className="text-sm font-semibold">
                  {board.title?.charAt(0).toUpperCase()}
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Workspace board
                </p>
                <h1 className="truncate text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {board.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Role-guarded actions */}
          <div className="flex gap-2">
            {userCanManage && (
              <button
                onClick={() => setMembersOpen(true)}
                className="btn-ghost"
                title="Manage members"
              >
                <Users className="size-4" /> Members
              </button>
            )}
            {userCanManage && (
              <button
                onClick={() => setColumnModalOpen(true)}
                className="btn-primary w-full sm:w-auto"
              >
                <CirclePlus className="size-4" /> Add column
              </button>
            )}
          </div>
        </div>

        {/* Sub-header */}
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {columns.length} {columns.length === 1 ? "column" : "columns"} ·{" "}
            {columns.reduce((n, c) => n + c.tasks.length, 0)} tasks
          </span>
          {!userCanEdit && (
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              View only
            </span>
          )}
          {userCanEdit && (
            <span className="hidden text-xs sm:inline">
              Drag tasks between columns to update progress
            </span>
          )}
        </div>

        {/* Board canvas */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={columns.map((c) => c.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-start gap-4 overflow-x-auto pb-8 pt-1">
              {columns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  canEdit={userCanEdit}
                  onAddTask={openTaskModal}
                  onOpenTaskDetail={setDetailTask}
                  activeTaskId={activeTaskId}
                />
              ))}

              {/* Add column placeholder */}
              {userCanManage && (
                <button
                  onClick={() => setColumnModalOpen(true)}
                  className="flex h-[52px] w-[min(88vw,300px)] shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground sm:w-[300px]"
                >
                  + Add column
                </button>
              )}
            </div>
          </SortableContext>

          {/* Drag overlay — renders the ghost card while dragging */}
          <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
            {activeTask ? (
              <div className="rotate-1 scale-105">
                <TaskCard
                  task={activeTask}
                  canEdit={false}
                  onOpenDetail={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <CreateColumnModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        value={newColumnTitle}
        onChange={setNewColumnTitle}
        onSubmit={handleCreateColumn}
        isPending={createColumn.isPending}
      />

      <CreateTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={newTaskTitle}
        description={newTaskDesc}
        onTitleChange={setNewTaskTitle}
        onDescChange={setNewTaskDesc}
        onSubmit={handleCreateTask}
        isPending={createTask.isPending}
      />

      <TaskDetailModal
        task={detailTask}
        open={!!detailTask}
        onClose={() => setDetailTask(null)}
        canEdit={userCanEdit}
        boardMembers={boardMembers}
        onUpdate={handleUpdateTask}
        onDelete={userCanEdit ? handleDeleteTask : undefined}
      />

      <MembersModal
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        board={board}
        role={role}
        currentUserId={user?.id ?? null}
      />
    </main>
  );
}
