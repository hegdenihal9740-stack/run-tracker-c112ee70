import { createFileRoute } from "@tanstack/react-router";
import { PerformancePage } from "@/features/hr/performance";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/performance")({
  head: () => pageHead("Performance", "Review employee scores and performance summaries."),
  component: PerformancePage,
});
