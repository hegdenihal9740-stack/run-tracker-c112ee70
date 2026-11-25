import { createFileRoute } from "@tanstack/react-router";
import { PayrollPage } from "@/features/hr/payroll";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/payroll")({
  head: () => pageHead("Payroll", "Manage employee payroll working sheets and salary entries."),
  component: PayrollPage,
});
