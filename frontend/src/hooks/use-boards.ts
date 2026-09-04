import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Board,
  BoardListItem,
  BoardResponse,
  Column,
} from "@/types/domain";

export function useBoards() {
  const { data, isLoading, error } = useQuery<BoardListItem[]>({
    queryKey: ["boards"],
    queryFn: () => api<BoardListItem[]>("/boards"),
  });

  return {
    boards: data || [],
    loading: isLoading,
    error,
  };
}

export function useBoard(boardId: string) {
  const { data, isLoading, error } = useQuery<BoardResponse>({
    queryKey: ["boards", boardId],
    queryFn: () => api<BoardResponse>(`/boards/${boardId}`),
    enabled: !!boardId,
  });

  return {
    board: data?.board || null,
    role: data?.role || null,
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

export function useCreateColumn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, title }: { boardId: string; title: string }) =>
      api<Column>(`/boards/${boardId}/columns`, {
        method: "POST",
        body: JSON.stringify({ title }),
      }),
    onSuccess: (_, { boardId }) => {
      qc.invalidateQueries({ queryKey: ["boards", boardId] });
    },
  });
}
