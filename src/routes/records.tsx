import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/features/hr/records";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/records")({
  head: () =>
    pageHead("Records", "View job requirements, employee details, and session payroll records."),
  component: RecordsPage,
});
