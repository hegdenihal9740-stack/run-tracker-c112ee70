export type Job = {
  id: number;
  title: string;
  department: string;
  vacancies: number;
  employment: string;
  location: string;
  status: string;
  createdAt: string;
  details?: Record<string, string>;
};
export const initialJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    department: "IT",
    vacancies: 2,
    employment: "Full-time",
    location: "Office",
    status: "Open",
    createdAt: "",
  },
  {
    id: 2,
    title: "Marketing Manager",
    department: "Marketing",
    vacancies: 1,
    employment: "Full-time",
    location: "Office",
    status: "Open",
    createdAt: "",
  },
  {
    id: 3,
    title: "Accountant",
    department: "Finance",
    vacancies: 1,
    employment: "Full-time",
    location: "Office",
    status: "Closed",
    createdAt: "",
  },
];
export const employees = [
  { id: "EMP001", name: "John Doe", department: "IT", role: "Software Engineer", status: "Active" },
  {
    id: "EMP002",
    name: "Jane Smith",
    department: "Marketing",
    role: "Marketing Manager",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Bob Johnson",
    department: "Finance",
    role: "Accountant",
    status: "Active",
  },
];
export const performance = [
  { name: "John Doe", score: 85 },
  { name: "Jane Smith", score: 92 },
  { name: "Bob Johnson", score: 78 },
  { name: "Alice Brown", score: 88 },
  { name: "Charlie Wilson", score: 95 },
];
export const payrollColumns = [
  "Sl No",
  "Employee Name",
  "Days Working",
  "Leave",
  "Govt Holiday",
  "Sunday",
  "Training",
  "Total Working Days",
  "Basic Salary",
  "Allowances",
  "Deductions",
  "Total CTC",
  "Payment Mode",
  "Net Salary",
];
export type PayrollRow = string[];
export const emptyPayroll = (): PayrollRow[] =>
  Array.from({ length: 5 }, (_, i) =>
    payrollColumns.map((_, col) => (col === 0 ? String(i + 1) : col === 12 ? "Bank Transfer" : "")),
  );
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | HR Management` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | HR Management` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

/** Fills calculated payroll cells: total days = worked + holidays + Sundays + training (leave excluded); CTC = basic + allowances; net = CTC − deductions. */
export function recalcPayrollRow(row: PayrollRow): PayrollRow {
  const n = (i: number) => Number(row[i]) || 0;
  const has = (...idx: number[]) => idx.some((i) => (row[i] ?? "") !== "");
  const out = [...row];
  out[7] = has(2, 4, 5, 6) ? String(n(2) + n(4) + n(5) + n(6)) : "";
  const ctc = n(8) + n(9);
  out[11] = has(8, 9) ? ctc.toFixed(2) : "";
  out[13] = has(8, 9, 10) ? (ctc - n(10)).toFixed(2) : "";
  return out;
}
export const blankPayrollRow = (index: number): PayrollRow =>
  payrollColumns.map((_, col) => (col === 0 ? String(index + 1) : col === 12 ? "Bank Transfer" : ""));
