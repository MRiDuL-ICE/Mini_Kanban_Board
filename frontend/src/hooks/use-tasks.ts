import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Task } from "@/types/domain";

type MoveTaskVars = {
  taskId: string;
  columnId: string;
  position: number;
};

export function useMoveTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, columnId, position }: MoveTaskVars) =>
      api<Task>(`/tasks/${taskId}/move`, {
        method: "POST",
        body: JSON.stringify({ columnId, position }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
