import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { blankPayrollRow, emptyPayroll, employees, payrollColumns, recalcPayrollRow } from "./data";
import { useHR } from "./context";
export function PayrollPage() {
  const { payroll, setPayroll, savedPayroll, setSavedPayroll } = useHR();
  function update(row: number, col: number, value: string) {
    setPayroll((rows) =>
      rows.map((r, i) =>
        i === row ? recalcPayrollRow(r.map((v, j) => (j === col ? value : v))) : r,
      ),
    );
  }
  const calculated = [7, 11, 13];
  function addRow() {
    setPayroll((rows) => [...rows, blankPayrollRow(rows.length)]);
  }
  function removeRow(row: number) {
    setPayroll((rows) =>
      rows.filter((_, i) => i !== row).map((r, i) => [String(i + 1), ...r.slice(1)]),
    );
  }
  return (
    <section>
      <h2>Payroll Working Sheet</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSavedPayroll(payroll.map((r) => [...r]));
          toast.success("Payroll kept for this session.");
        }}
      >
        <div className="hr-table-scroll">
          <table className="hr-table hr-payroll">
            <thead>
              <tr>
                {payrollColumns.map((label) => (
                  <th key={label}>{label}</th>
                ))}
                <th aria-label="Row actions" />
              </tr>
            </thead>
            <tbody>
              {payroll.map((row, i) => (
                <tr key={i}>
                  {payrollColumns.map((label, j) => (
                    <td key={label}>
                      {j === 12 ? (
                        <select
                          aria-label={`${label} row ${i + 1}`}
                          value={row[j] ?? ""}
                          onChange={(e) => update(i, j, e.target.value)}
                        >
                          {["Bank Transfer", "Cheque", "Cash"].map((mode) => (
                            <option key={mode}>{mode}</option>
                          ))}
                        </select>
                      ) : j === 0 || calculated.includes(j) ? (
                        <output aria-label={`${label} row ${i + 1}`} className="hr-calc">
                          {row[j] || "—"}
                        </output>
                      ) : (
                        <input
                          {...(j === 1 ? { list: "payroll-employees" } : {})}
                          aria-label={`${label} row ${i + 1}`}
                          type={j < 2 ? "text" : "number"}
                          {...(j >= 2 ? { min: 0, step: j >= 8 ? "0.01" : "1" } : {})}
                          value={row[j] ?? ""}
                          onChange={(e) => update(i, j, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                  <td>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove row ${i + 1}`}
                      onClick={() => removeRow(i)}
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <datalist id="payroll-employees">
            {employees.map((e) => (
              <option key={e.id} value={e.name} />
            ))}
          </datalist>
        </div>
        <Button type="button" variant="outline" className="mt-3" onClick={addRow}>
          <Plus /> Add Row
        </Button>
        <div className="hr-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPayroll(savedPayroll?.map((r) => [...r]) ?? emptyPayroll());
              toast("Payroll changes cancelled.");
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Keep Payroll</Button>
        </div>
      </form>
    </section>
  );
}
