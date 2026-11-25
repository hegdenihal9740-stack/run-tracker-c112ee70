import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { performance } from "./data";
const fills = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
export function PerformancePage() {
  const average = performance.reduce((sum, e) => sum + e.score, 0) / performance.length;
  const top = performance.reduce((best, e) => (e.score > best.score ? e : best));
  return (
    <section>
      <h2>Employee Performance Dashboard</h2>
      <div className="hr-summary">
        {[
          { label: "Total Employees", value: performance.length },
          { label: "Average Score", value: average },
          { label: "Top Performer", value: top.name },
        ].map((item) => (
          <article key={item.label}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
      <h3 className="hr-chart-title">Employee Performance Scores</h3>
      <div
        className="hr-chart"
        role="img"
        aria-label={performance.map((e) => `${e.name}: ${e.score} out of 100`).join(", ")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performance} margin={{ top: 20, right: 16, bottom: 45, left: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            />
            <Bar dataKey="score" name="Performance Score" maxBarSize={90} isAnimationActive={false}>
              {performance.map((e, i) => (
                <Cell key={e.name} fill={fills[i % fills.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
