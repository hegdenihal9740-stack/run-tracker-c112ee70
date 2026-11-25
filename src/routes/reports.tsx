import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/features/hr/reports";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/reports")({
  head: () => pageHead("Reports", "Headcount, attrition, salary cost and leave reports for your team."),
  component: ReportsPage,
});
