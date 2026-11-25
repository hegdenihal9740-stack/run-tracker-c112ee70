import { employees, type Job } from "./data";
export function JobTable({ jobs, records = false }: { jobs: Job[]; records?: boolean }) {
  return (
    <div className="hr-table-scroll">
      <table className="hr-table">
        <thead>
          <tr>
            {[
              records ? "ID" : "Sl No",
              "Job Title",
              "Department",
              "Vacancies",
              "Employment Type",
              "Work Location",
              "Status",
              ...(records ? ["Created At"] : []),
            ].map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.department}</td>
              <td>{job.vacancies}</td>
              <td>{job.employment}</td>
              <td>{job.location}</td>
              <td>
                <span className={`hr-status ${job.status === "Closed" ? "hr-status-neutral" : ""}`}>
                  {job.status}
                </span>
              </td>
              {records && (
                <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}</td>
              )}
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan={records ? 8 : 7} className="hr-empty">
                No job requirements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export function EmployeeTable({
  search = "",
  department = "All",
}: {
  search?: string;
  department?: string;
}) {
  const filtered = employees.filter(
    (e) =>
      (department === "All" || e.department === department) &&
      `${e.id} ${e.name} ${e.department} ${e.role}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="hr-table-scroll">
      <table className="hr-table">
        <thead>
          <tr>
            {["Employee ID", "Name", "Department", "Designation", "Status"].map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.department}</td>
              <td>{e.role}</td>
              <td>
                <span className="hr-status">{e.status}</span>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="hr-empty">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
