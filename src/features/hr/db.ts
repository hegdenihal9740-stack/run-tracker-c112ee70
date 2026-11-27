import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useHR } from "./context";
import type { Database } from "@/integrations/supabase/types";

export type Employee = Database["public"]["Tables"]["employees"]["Row"];
export type EmployeeInput = Database["public"]["Tables"]["employees"]["Insert"];
export type LeaveRequest = Database["public"]["Tables"]["leave_requests"]["Row"];
export type LeaveInput = Database["public"]["Tables"]["leave_requests"]["Insert"];

export function useEmployees() {
  const { sessionEmployees } = useHR();
  const query = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employees").select("*").order("code");
      if (error) throw error;
      return data;
    },
  });
  return { ...query, data: [...(query.data ?? []), ...sessionEmployees] };
}

export function useSaveEmployee() {
  const { sessionEmployees, setSessionEmployees } = useHR();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: EmployeeInput) => {
      if (sessionEmployees.some(row => row.id === e.id)) {
        setSessionEmployees(old => old.map(row => row.id === e.id ? { ...row, ...e } : row));
        return;
      }
      const { error } = e.id
        ? await supabase.from("employees").update(e).eq("id", e.id)
        : await supabase.from("employees").insert(e);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useDeleteEmployee() {
  const { sessionEmployees, setSessionEmployees } = useHR();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (sessionEmployees.some(row => row.id === id)) {
        setSessionEmployees(old => old.filter(row => row.id !== id));
        return;
      }
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(),
  });
}

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leave"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (l: LeaveInput) => {
      const { error } = l.id
        ? await supabase.from("leave_requests").update(l).eq("id", l.id)
        : await supabase.from("leave_requests").insert(l);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leave"] }),
  });
}

export function usePayrollSheet(month: string) {
  return useQuery({
    queryKey: ["payroll", month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll_sheets")
        .select("rows")
        .eq("month", month)
        .maybeSingle();
      if (error) throw error;
      return (data?.rows as string[][] | undefined) ?? null;
    },
  });
}

export function useSavePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ month, rows }: { month: string; rows: string[][] }) => {
      const { error } = await supabase
        .from("payroll_sheets")
        .upsert({ month, rows, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["payroll", v.month] }),
  });
}

/** Inclusive calendar days between two ISO dates (0 if invalid or reversed). */
export function leaveDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Number.isFinite(ms) && ms >= 0 ? Math.round(ms / 86400000) + 1 : 0;
}
