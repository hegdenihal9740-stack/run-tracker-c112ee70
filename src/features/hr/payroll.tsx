import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emptyPayroll, payrollColumns } from "./data";
import { useHR } from "./context";
export function PayrollPage() {
  const { payroll, setPayroll, savedPayroll, setSavedPayroll } = useHR();
  function update(row: number, col: number, value: string) {
    setPayroll((rows) =>
      rows.map((r, i) => (i === row ? r.map((v, j) => (j === col ? value : v)) : r)),
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
                      ) : (
                        <input
                          aria-label={`${label} row ${i + 1}`}
                          type={j < 2 ? "text" : "number"}
                          {...(j >= 2 ? { min: 0, step: j >= 8 ? "0.01" : "1" } : {})}
                          value={row[j] ?? ""}
                          onChange={(e) => update(i, j, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
