import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Job, PayrollRow } from "./data";

import type { Candidate } from "./recruitment-data";
import type { Employee } from "./db";

export type HRState = {
  candidates: Candidate[];
  setCandidates: Dispatch<SetStateAction<Candidate[]>>;
  sessionEmployees: Employee[];
  setSessionEmployees: Dispatch<SetStateAction<Employee[]>>;
  jobs: Job[];
  setJobs: Dispatch<SetStateAction<Job[]>>;
  payroll: PayrollRow[];
  setPayroll: Dispatch<SetStateAction<PayrollRow[]>>;
  savedPayroll: PayrollRow[] | null;
  setSavedPayroll: Dispatch<SetStateAction<PayrollRow[] | null>>;
};

// Keep context identity outside the provider's Fast Refresh boundary.
export const HRContext = createContext<HRState | null>(null);

export function useHR() {
  const state = useContext(HRContext);
  if (!state) throw new Error("HR pages require HRProvider");
  return state;
}
