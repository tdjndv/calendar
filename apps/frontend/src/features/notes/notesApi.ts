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
      const res = await api.post<Note>("/notes/", payload);
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

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: number;
      date: string;
      title: string;
      content: string;
    }) => {
      const { id, ...body } = payload;
      const res = await api.patch<Note>(`/notes/${id}/`, body);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", "date", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes", "month", variables.date.slice(0, 7)],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes", "date", data.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes", "month", data.date.slice(0, 7)],
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: number; date: string }) => {
      await api.delete(`/notes/${payload.id}/`);
      return payload;
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", "date", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes", "month", variables.date.slice(0, 7)],
      });
    },
  });
}