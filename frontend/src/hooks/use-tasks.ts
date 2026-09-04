import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BoardResponse, Task } from "@/types/domain";

type MoveTaskVars = {
  boardId: string;
  taskId: string;
  columnId: string;
  position: number;
};

type CreateTaskVars = {
  columnId: string;
  title: string;
  description?: string;
  assigneeId?: string;
};

type UpdateTaskVars = {
  taskId: string;
  boardId: string;
  data: {
    title?: string;
    description?: string;
    assigneeId?: string;
  };
};

type DeleteTaskVars = {
  taskId: string;
  boardId?: string;
};

export function useMoveTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, taskId, columnId, position }: MoveTaskVars) =>
      api<Task>(
        `/tasks/${taskId}/move?boardId=${encodeURIComponent(boardId)}`,
        {
          method: "POST",
          body: JSON.stringify({ columnId, position }),
        },
      ),

    // Optimistic update
    onMutate: async (vars) => {
      const queryKey = ["boards", vars.boardId];

      await qc.cancelQueries({ queryKey });

      const previous = qc.getQueryData<BoardResponse>(queryKey);

      if (previous?.board) {
        const board = previous.board;

        let movedTask: any = null;
        const newColumns = board.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => {
            if (t.id === vars.taskId) {
              movedTask = t;
              return false;
            }
            return true;
          }),
        }));

        if (!movedTask) return { previous };

        const updatedColumns = newColumns.map((col) => {
          if (col.id === vars.columnId) {
            const tasks = [...col.tasks];
            const idx = Math.min(vars.position, tasks.length);
            tasks.splice(idx, 0, {
              ...movedTask,
              columnId: col.id,
              position: idx,
            });
            return { ...col, tasks };
          }
          return col;
        });

        qc.setQueryData<BoardResponse>(queryKey, {
          ...previous,
          board: {
            ...board,
            columns: updatedColumns,
          },
        });
      }

      return { previous };
    },
    onSuccess: (_, vars) => {
      qc.refetchQueries({
        queryKey: ["boards", vars.boardId],
        exact: true,
      });
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        qc.setQueryData(["boards", context.previous.boardId], context.previous);
      }
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      title,
      description,
      assigneeId,
    }: CreateTaskVars) => {
      // console.log({ columnId, title, description, assigneeId });
      return api<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify({ columnId, title, description, assigneeId }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, boardId, data }: UpdateTaskVars) => {
      // console.log({ taskId, boardId, data });
      return api<Task>(
        `/tasks/${taskId}?boardId=${encodeURIComponent(boardId)}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
      );
    },
    onSuccess: (_, { boardId }) => {
      if (boardId) {
        qc.refetchQueries({ queryKey: ["boards", boardId], exact: true });
      }
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: DeleteTaskVars) =>
      api(`/tasks/${taskId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, { boardId }) => {
      if (boardId) {
        qc.refetchQueries({ queryKey: ["boards", boardId], exact: true });
      }
    },
  });
}
