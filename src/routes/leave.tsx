import { createFileRoute } from "@tanstack/react-router";
import { LeavePage } from "@/features/hr/leave";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/leave")({
  head: () => pageHead("Leave", "Leave requests, approvals and leave balances for every employee."),
  component: LeavePage,
});
