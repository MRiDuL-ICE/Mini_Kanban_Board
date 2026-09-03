"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBoard } from "@/hooks/use-boards";
import { useMoveTask } from "@/hooks/use-tasks";
import { useAuthStore } from "@/store/auth-store";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { board, loading, error } = useBoard(boardId);
  const { requireAuth, loading: authLoading } = useAuth();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const moveTask = useMoveTask();

  useEffect(() => {
    if (!authLoading) {
      requireAuth();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading board...
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Board not found.
      </div>
    );
  }

  async function onDropTask(
    taskId: string,
    columnId: string,
    position: number,
  ) {
    try {
      await moveTask.mutateAsync({ taskId, columnId, position });
    } catch {
      alert("Failed to move task");
    }
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <header className="border-b border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">
            {board.title}
          </h1>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="btn-ghost"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="flex gap-4 overflow-x-auto">
          {board.columns.map((col) => (
            <div
              key={col.id}
              className="min-w-[280px] max-w-[280px] bg-surface-2 border border-border rounded p-3"
            >
              <h2 className="font-semibold text-text-primary mb-2">
                {col.title}
              </h2>
              <div className="space-y-2">
                {col.tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="card p-3 cursor-grab"
                    onDrop={(e) => {
                      e.preventDefault();
                      onDropTask(task.id, col.id, index);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="font-medium text-text-primary">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-text-secondary mt-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
