import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HRProvider } from "@/features/hr/store";
import { HiringPage } from "@/features/hr/hiring";
import { PayrollPage } from "@/features/hr/payroll";
import { RecordsPage } from "@/features/hr/records";

// Pages read employees and payroll sheets from the app database through react-query,
// so tests need the same QueryClientProvider the root route supplies (src/routes/__root.tsx)
// plus a stand-in database they can seed and read back.
const db = vi.hoisted(() => ({
  employees: [
    { id: "1", code: "EMP001", name: "John Doe", department: "IT", role: "Software Engineer", status: "Active" },
    { id: "2", code: "EMP002", name: "Jane Smith", department: "Marketing", role: "Marketing Manager", status: "Active" },
    { id: "3", code: "EMP003", name: "Bob Johnson", department: "Finance", role: "Accountant", status: "Active" },
  ] as Array<Record<string, unknown>>,
  payrollRows: null as string[][] | null,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      const builder: Record<string, unknown> = {
        select: () => builder,
        order: () => builder,
        eq: () => builder,
        maybeSingle: () =>
          Promise.resolve({ data: db.payrollRows ? { rows: db.payrollRows } : null, error: null }),
        upsert: (value: { rows: string[][] }) => {
          db.payrollRows = value.rows;
          return Promise.resolve({ error: null });
        },
        then: (resolve: (value: unknown) => void) =>
          Promise.resolve({ data: table === "employees" ? db.employees : null, error: null }).then(
            resolve,
          ),
      };
      return builder;
    },
  },
}));

afterEach(cleanup);

function renderHR(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <HRProvider>{ui}</HRProvider>
    </QueryClientProvider>,
  );
}

describe("Native HR interactions", () => {
  it("filters employees by input and department", async () => {
    renderHR(<HiringPage />);
    fireEvent.change(screen.getByLabelText("Search employees"), { target: { value: "Jane" } });
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filter department"), { target: { value: "IT" } });
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("adds a job and reads it back from hiring records", () => {
    renderHR(
      <>
        <HiringPage />
        <RecordsPage />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Create job requirement" }));
    const fields = {
      "Job Title *": "Support Engineer",
      "Department *": "IT",
      "Number of Vacancies *": "2",
      "Employment Type *": "Full-time",
      "Work Location *": "Remote",
      "Required Experience *": "3 years",
      "Required Skills *": "Support",
      "Job Responsibilities *": "Customer support",
      "Qualification *": "Degree",
    };
    for (const [label, value] of Object.entries(fields))
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole("button", { name: "Add Job Requirement" }));
    expect(screen.getByText("Support Engineer")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("calculates net salary, saves the sheet, and cancels unsaved changes", async () => {
    renderHR(
      <>
        <PayrollPage />
        <RecordsPage />
      </>,
    );
    fireEvent.change(screen.getByLabelText("Basic Salary row 1"), { target: { value: "3000" } });
    fireEvent.change(screen.getByLabelText("Allowances row 1"), { target: { value: "500" } });
    expect(screen.getByLabelText("Net Salary row 1")).toHaveTextContent("3500.00");

    fireEvent.click(screen.getByRole("button", { name: "Save Payroll" }));
    await screen.findByText("Payroll Records");

    fireEvent.change(screen.getByLabelText("Basic Salary row 1"), { target: { value: "9999" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByLabelText("Net Salary row 1")).toHaveTextContent("3500.00");
  });
});
