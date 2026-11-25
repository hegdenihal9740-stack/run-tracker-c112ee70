import { payrollColumns, type PayrollRow } from "./data";

const esc = (v: string) => v.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/** Opens a printable payslip; the browser's print dialog saves it as PDF. */
export function openPayslip(row: PayrollRow, month: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  const lines = payrollColumns
    .map((label, i) => (i === 0 ? "" : `<tr><th>${esc(label)}</th><td>${esc(row[i] || "—")}</td></tr>`))
    .join("");
  w.document.write(`<!doctype html><html><head><title>Payslip ${esc(row[1] ?? "")} ${month}</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;color:#111}
h1{margin:0}p{color:#555}table{width:100%;border-collapse:collapse;margin-top:24px}
th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f4f4f4;width:50%}
tr:last-child td{font-weight:700}</style></head><body>
<h1>Payslip</h1><p>Pay period: ${esc(month)}</p><table>${lines}</table>
<script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}
