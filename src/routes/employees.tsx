import { createFileRoute } from "@tanstack/react-router";
import { EmployeesPage } from "@/features/hr/employees";
import { pageHead } from "@/features/hr/data";

export const Route = createFileRoute("/employees")({
  head: () => pageHead("Employees", "Employee profiles with contact, department, manager and salary details."),
  component: EmployeesPage,
});
