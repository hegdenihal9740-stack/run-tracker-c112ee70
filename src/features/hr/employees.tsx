import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteEmployee, useEmployees, useSaveEmployee, type EmployeeInput } from "./db";

const blank: EmployeeInput = {
  code: "", name: "", email: "", phone: "", department: "", role: "", manager: "",
  joining_date: null, basic_salary: 0, status: "Active",
};

export function EmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees();
  const save = useSaveEmployee();
  const del = useDeleteEmployee();
  const [form, setForm] = useState<EmployeeInput | null>(null);
  const [search, setSearch] = useState("");
  const set = (k: keyof EmployeeInput, v: string | number | null) => setForm((f) => (f ? { ...f, [k]: v } : f));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    save.mutate(form, {
      onSuccess: () => { toast.success("Employee saved."); setForm(null); },
      onError: (err) => toast.error(err.message),
    });
  }

  const shown = employees.filter((e) =>
    `${e.code} ${e.name} ${e.department} ${e.role} ${e.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  const fields: [keyof EmployeeInput, string, string][] = [
    ["code", "Employee ID", "text"], ["name", "Full Name", "text"], ["email", "Email", "email"],
    ["phone", "Phone", "tel"], ["department", "Department", "text"], ["role", "Designation", "text"],
    ["manager", "Reporting Manager", "text"], ["joining_date", "Joining Date", "date"],
    ["basic_salary", "Basic Salary", "number"],
  ];

  return (
    <section>
      <div className="hr-toolbar">
        <h2>Employee Directory</h2>
        <div className="hr-search"><input aria-label="Search employees" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Button onClick={() => setForm({ ...blank })}><Plus /> Add Employee</Button>
      </div>
      {form && (
        <form className="hr-panel" onSubmit={submit}>
          <h3>{form.id ? "Edit employee" : "New employee"}</h3>
          <div className="hr-form-grid">
            {fields.map(([k, label, type]) => (
              <div className="hr-field" key={k}>
                <label htmlFor={`emp-${k}`}>{label}</label>
                <input id={`emp-${k}`} type={type} required={k === "name"}
                  value={(form[k] as string | number | null) ?? ""}
                  onChange={(e) => set(k, type === "number" ? Number(e.target.value) : type === "date" ? e.target.value || null : e.target.value)} />
              </div>
            ))}
            <div className="hr-field">
              <label htmlFor="emp-status">Status</label>
              <select id="emp-status" value={form.status ?? "Active"} onChange={(e) => set("status", e.target.value)}>
                {["Active", "On Leave", "Resigned"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="hr-actions">
            <Button type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Button>
            <Button type="submit" disabled={save.isPending}>Save Employee</Button>
          </div>
        </form>
      )}
      <div className="hr-table-scroll">
        <table className="hr-table">
          <thead><tr>{["ID", "Name", "Department", "Designation", "Manager", "Joined", "Basic Salary", "Status", ""].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {shown.map((e) => (
              <tr key={e.id}>
                <td>{e.code}</td><td>{e.name}<br /><small>{e.email}</small></td><td>{e.department}</td><td>{e.role}</td>
                <td>{e.manager}</td><td>{e.joining_date ?? "—"}</td><td>{Number(e.basic_salary).toLocaleString()}</td>
                <td><span className="hr-status">{e.status}</span></td>
                <td>
                  <Button variant="ghost" size="icon" aria-label={`Edit ${e.name}`} onClick={() => setForm({ ...e })}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${e.name}`} onClick={() => confirm(`Delete ${e.name}?`) && del.mutate(e.id)}><Trash2 /></Button>
                </td>
              </tr>
            ))}
            {!isLoading && shown.length === 0 && <tr><td colSpan={9} className="hr-empty">No employees found.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
