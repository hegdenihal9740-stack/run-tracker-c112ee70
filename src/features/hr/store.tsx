import { useState, type ReactNode } from "react";
import { initialJobs, emptyPayroll, type PayrollRow } from "./data";
import { initialCandidates, candidateEmployee } from "./recruitment-data";
import type { Employee } from "./db";
import { HRContext } from "./context";
export function HRProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [sessionEmployees, setSessionEmployees] = useState<Employee[]>(() => initialCandidates.filter(c => c.employeeId).map(c => {
    const job = initialJobs.find(j => j.id === c.jobId);
    return candidateEmployee(c, job?.title ?? "", job?.department ?? "", "2026-11-24");
  }));
  const [jobs, setJobs] = useState(initialJobs);
  const [payroll, setPayroll] = useState(emptyPayroll);
  const [savedPayroll, setSavedPayroll] = useState<PayrollRow[] | null>(null);
  return (
    <HRContext.Provider
      value={{ candidates, setCandidates, sessionEmployees, setSessionEmployees, jobs, setJobs, payroll, setPayroll, savedPayroll, setSavedPayroll }}
    >
      {children}
    </HRContext.Provider>
  );
}
