import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Job, PayrollRow } from "./data";

export type HRState = {
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
