import { useEmployees, useLeaveRequests } from "./db";

export function ReportsPage() {
  const { data: employees = [] } = useEmployees();
  const { data: leave = [] } = useLeaveRequests();
  const active = employees.filter((e) => e.status === "Active");
  const resigned = employees.filter((e) => e.status === "Resigned").length;
  const byDept = Object.entries(
    employees.reduce<Record<string, { count: number; cost: number }>>((acc, e) => {
      const d = e.department || "Unassigned";
      acc[d] ??= { count: 0, cost: 0 };
      acc[d].count++;
      acc[d].cost += Number(e.basic_salary) || 0;
      return acc;
    }, {}),
  );
  const max = Math.max(1, ...byDept.map(([, v]) => v.count));
  const cards = [
    ["Total Employees", employees.length],
    ["Active", active.length],
    ["Attrition", employees.length ? `${Math.round((resigned / employees.length) * 100)}%` : "0%"],
    ["Monthly Salary Cost", active.reduce((s, e) => s + (Number(e.basic_salary) || 0), 0).toLocaleString()],
    ["Pending Leave", leave.filter((l) => l.status === "Pending").length],
  ];
  return (
    <section>
      <div className="hr-stats">
        {cards.map(([label, value]) => (
          <div className="hr-panel hr-stat" key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </div>
      <h2>Headcount by Department</h2>
      <div className="hr-panel">
        {byDept.map(([dept, v]) => (
          <div className="hr-bar-row" key={dept}>
            <span>{dept}</span>
            <div className="hr-bar"><div style={{ width: `${(v.count / max) * 100}%` }} /></div>
            <span>{v.count} · {v.cost.toLocaleString()}</span>
          </div>
        ))}
        {byDept.length === 0 && <p className="hr-empty">No employees yet.</p>}
      </div>
    </section>
  );
}
