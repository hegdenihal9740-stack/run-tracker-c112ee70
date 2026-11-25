import { EmployeeTable, JobTable } from "./tables";
import { useHR } from "./context";
import { payrollColumns } from "./data";
export function RecordsPage() {
  const { jobs, savedPayroll } = useHR();
  return (
    <section className="hr-records">
      <h2>Employee Records</h2>
      <h3>Job Requirements (Hiring Records)</h3>
      <JobTable jobs={jobs} records />
      <h3>Existing Employees</h3>
      <EmployeeTable />
      {savedPayroll && (
        <>
          <h3>Payroll Records</h3>
          <div className="hr-table-scroll">
            <table className="hr-table">
              <thead>
                <tr>
                  {payrollColumns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savedPayroll.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell || "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
