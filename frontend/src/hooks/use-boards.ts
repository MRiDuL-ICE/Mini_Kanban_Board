import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Board } from "@/types/domain";

export function useBoards() {
  const { data, isLoading, error } = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: () => api<Board[]>("/boards"),
  });

  return {
    boards: data || [],
    loading: isLoading,
    error,
  };
}

export function useBoard(boardId: string) {
  const { data, isLoading, error } = useQuery<Board>({
    queryKey: ["boards", boardId],
    queryFn: () => api<Board>(`/boards/${boardId}`),
    enabled: !!boardId,
  });

  return {
    board: data || null,
    loading: isLoading,
    error,
  };
}

export function useCreateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) =>
      api<Board>("/boards", {
        method: "POST",
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
