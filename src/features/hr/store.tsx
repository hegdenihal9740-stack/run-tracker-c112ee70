import { useState, type ReactNode } from "react";
import { initialJobs, emptyPayroll, type PayrollRow } from "./data";
import { HRContext } from "./context";
export function HRProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [payroll, setPayroll] = useState(emptyPayroll);
  const [savedPayroll, setSavedPayroll] = useState<PayrollRow[] | null>(null);
  return (
    <HRContext.Provider
      value={{ jobs, setJobs, payroll, setPayroll, savedPayroll, setSavedPayroll }}
    >
      {children}
    </HRContext.Provider>
  );
}
