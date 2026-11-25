import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BriefcaseBusiness, ChartNoAxesCombined, Wallet, Files, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
const navigation = [
  { to: "/" as const, label: "Hiring", icon: BriefcaseBusiness },
  { to: "/performance" as const, label: "Performance", icon: ChartNoAxesCombined },
  { to: "/payroll" as const, label: "Payroll", icon: Wallet },
  { to: "/records" as const, label: "Records", icon: Files },
];
export function HRShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current = navigation.find((item) => item.to === pathname);
  return (
    <div className="hr-shell">
      <header className="hr-topbar">
        <Link to="/" className="hr-brand">
          <span className="hr-brand-mark">
            <Layers size={20} />
          </span>
          <span>HR Management</span>
        </Link>
        <nav aria-label="HR navigation">
          {navigation.map((item) => (
            <Button
              asChild
              variant="ghost"
              className={`hr-nav-item ${pathname === item.to ? "hr-nav-active" : ""}`}
              key={item.to}
            >
              <Link
                to={item.to}
                title={item.label}
                aria-current={pathname === item.to ? "page" : undefined}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
        <span className="hr-workspace-label">Human Resources</span>
      </header>
      <div className="hr-main">
        <header className="hr-header">
          <h1>{current?.label ?? "HR Management"}</h1>
        </header>
        <main className="hr-content">{children}</main>
      </div>
    </div>
  );
}
