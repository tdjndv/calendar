import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export type Note = {
  id: number;
  date: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export function useNotesByDate(date: string | null) {
  return useQuery({
    queryKey: ["notes", "date", date],
    queryFn: async () => {
      const res = await api.get<Note[]>("/notes/", {
        params: { date },
      });
      return res.data;
    },
    enabled: !!date,
  });
}

export function useNotesByMonth(month: string) {
  return useQuery({
    queryKey: ["notes", "month", month],
    queryFn: async () => {
      const res = await api.get<Note[]>("/notes/", {
        params: { month },
      });
      return res.data;
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      date: string;
      title: string;
      content: string;
    }) => {
      const res = await api.post("/notes/", payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", "date", variables.date],
      });

      queryClient.invalidateQueries({
        queryKey: ["notes", "month", variables.date.slice(0, 7)],
      });
    },
  });
}