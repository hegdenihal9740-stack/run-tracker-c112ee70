import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { leaveDays, useEmployees, useLeaveRequests, useSaveLeave } from "./db";

export const LEAVE_ALLOWANCE: Record<string, number> = { Casual: 12, Sick: 10, Earned: 15 };

export function LeavePage() {
  const { data: employees = [] } = useEmployees();
  const { data: requests = [] } = useLeaveRequests();
  const save = useSaveLeave();
  const [f, setF] = useState({ employee_id: "", leave_type: "Casual", start_date: "", end_date: "", reason: "" });
  const nameOf = (id: string) => employees.find((e) => e.id === id)?.name ?? "—";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (leaveDays(f.start_date, f.end_date) === 0) return void toast.error("End date must be on or after start date");
    save.mutate(f, {
      onSuccess: () => { toast.success("Leave request added."); setF({ ...f, start_date: "", end_date: "", reason: "" }); },
      onError: (err) => toast.error(err.message),
    });
  }

  const used = (empId: string, type: string) =>
    requests.filter((r) => r.employee_id === empId && r.leave_type === type && r.status === "Approved")
      .reduce((s, r) => s + leaveDays(r.start_date, r.end_date), 0);

  return (
    <section>
      <h2>Apply for Leave</h2>
      <form className="hr-panel" onSubmit={submit}>
        <div className="hr-form-grid">
          <div className="hr-field"><label htmlFor="lv-emp">Employee</label>
            <select id="lv-emp" required value={f.employee_id} onChange={(e) => setF({ ...f, employee_id: e.target.value })}>
              <option value="">Select…</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select></div>
          <div className="hr-field"><label htmlFor="lv-type">Leave Type</label>
            <select id="lv-type" value={f.leave_type} onChange={(e) => setF({ ...f, leave_type: e.target.value })}>
              {Object.keys(LEAVE_ALLOWANCE).map((t) => <option key={t}>{t}</option>)}
            </select></div>
          <div className="hr-field"><label htmlFor="lv-s">From</label><input id="lv-s" type="date" required value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} /></div>
          <div className="hr-field"><label htmlFor="lv-e">To</label><input id="lv-e" type="date" required value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} /></div>
          <div className="hr-field"><label htmlFor="lv-r">Reason</label><input id="lv-r" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div>
        </div>
        <div className="hr-actions"><Button type="submit" disabled={save.isPending}>Submit Request</Button></div>
      </form>

      <h2>Leave Requests</h2>
      <div className="hr-table-scroll">
        <table className="hr-table">
          <thead><tr>{["Employee", "Type", "From", "To", "Days", "Reason", "Status", ""].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{nameOf(r.employee_id)}</td><td>{r.leave_type}</td><td>{r.start_date}</td><td>{r.end_date}</td>
                <td>{leaveDays(r.start_date, r.end_date)}</td><td>{r.reason}</td>
                <td><span className="hr-status">{r.status}</span></td>
                <td>{r.status === "Pending" && (<>
                  <Button size="sm" onClick={() => save.mutate({ ...r, status: "Approved" })}>Approve</Button>{" "}
                  <Button size="sm" variant="outline" onClick={() => save.mutate({ ...r, status: "Rejected" })}>Reject</Button>
                </>)}</td>
              </tr>
            ))}
            {requests.length === 0 && <tr><td colSpan={8} className="hr-empty">No leave requests yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2>Leave Balances</h2>
      <div className="hr-table-scroll">
        <table className="hr-table">
          <thead><tr><th>Employee</th>{Object.keys(LEAVE_ALLOWANCE).map((t) => <th key={t}>{t} (left / {LEAVE_ALLOWANCE[t]})</th>)}</tr></thead>
          <tbody>{employees.map((e) => (
            <tr key={e.id}><td>{e.name}</td>{Object.entries(LEAVE_ALLOWANCE).map(([t, max]) => <td key={t}>{max - used(e.id, t)}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
