import { describe, it, expect } from "vitest";
import { blankPayrollRow, recalcPayrollRow } from "@/features/hr/data";

function row(vals: Record<number, string>) {
  const r = blankPayrollRow(0);
  for (const [k, v] of Object.entries(vals)) r[Number(k)] = v;
  return recalcPayrollRow(r);
}
describe("payroll calculations", () => {
  it("total working days excludes leave", () => {
    expect(row({ 2: "20", 3: "2", 4: "1", 5: "4", 6: "1" })[7]).toBe("26");
  });
  it("CTC is basic plus allowances", () => {
    expect(row({ 8: "30000", 9: "5000" })[11]).toBe("35000.00");
  });
  it("net salary is CTC minus deductions", () => {
    expect(row({ 8: "30000", 9: "5000", 10: "2500" })[13]).toBe("32500.00");
  });
});
