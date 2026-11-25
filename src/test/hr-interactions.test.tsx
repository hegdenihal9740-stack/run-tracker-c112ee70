import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HRProvider } from "@/features/hr/store";
import { HiringPage } from "@/features/hr/hiring";
import { PayrollPage } from "@/features/hr/payroll";
import { RecordsPage } from "@/features/hr/records";

afterEach(cleanup);
describe("Native HR interactions", () => {
  it("filters employees by input and department", () => {
    render(
      <HRProvider>
        <HiringPage />
      </HRProvider>,
    );
    fireEvent.change(screen.getByLabelText("Search employees"), { target: { value: "Jane" } });
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filter department"), { target: { value: "IT" } });
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("adds a job and reads it back from hiring records", () => {
    render(
      <HRProvider>
        <HiringPage />
        <RecordsPage />
      </HRProvider>,
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

  it("keeps entered payroll in session records and cancels unsaved changes", () => {
    render(
      <HRProvider>
        <PayrollPage />
        <RecordsPage />
      </HRProvider>,
    );
    const name = screen.getByLabelText("Employee Name row 1");
    fireEvent.change(name, { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Net Salary row 1"), { target: { value: "4500" } });
    fireEvent.click(screen.getByRole("button", { name: "Keep Payroll" }));
    expect(screen.getByText("4500")).toBeInTheDocument();
    fireEvent.change(name, { target: { value: "Unsaved name" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(name).toHaveValue("John Doe");
  });
});
