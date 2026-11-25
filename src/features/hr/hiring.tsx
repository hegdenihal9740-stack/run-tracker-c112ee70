import { useState } from "react";
import { Plus, Search, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobTable, EmployeeTable } from "./tables";
import { JobForm } from "./job-form";
import { useHR } from "./context";

export function HiringPage() {
  const [tab, setTab] = useState("Existing");
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const { jobs } = useHR();
  if (creating)
    return (
      <JobForm
        onDone={() => {
          setCreating(false);
          setTab("Existing");
        }}
      />
    );
  return (
    <section>
      <div className="hr-tabs" role="tablist" aria-label="Hiring views">
        {["Hiring", "Existing", "Lock"].map((label) => (
          <Button
            key={label}
            variant="ghost"
            role="tab"
            aria-selected={tab === label}
            aria-controls={`panel-${label}`}
            id={`tab-${label}`}
            className={tab === label ? "hr-tab hr-tab-active" : "hr-tab"}
            onClick={() => setTab(label)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              const tabs = ["Hiring", "Existing", "Lock"];
              const next = tabs[(tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : 2)) % 3];
              if (next) {
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
          >
            {label}
          </Button>
        ))}
        <Button
          size="icon"
          className="hr-add"
          title="Create job requirement"
          aria-label="Create job requirement"
          onClick={() => setCreating(true)}
        >
          <Plus />
        </Button>
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "Lock" ? (
          <div className="hr-empty hr-lock">
            <LockKeyhole size={32} />
            <h2>Lock Functionality</h2>
            <p>Lock functionality coming soon.</p>
          </div>
        ) : (
          <>
            <div className="hr-section-heading">
              <h2>{tab === "Existing" ? "Existing Employees" : "Job Requirements"}</h2>
            </div>
            <div className="hr-filters">
              <div className="hr-search">
                <Search size={16} />
                <input
                  aria-label={tab === "Existing" ? "Search employees" : "Search job requirements"}
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                aria-label="Filter department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {["All", "IT", "Marketing", "Finance", "HR", "Operations"].map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All departments" : d}
                  </option>
                ))}
              </select>
            </div>
            {tab === "Existing" ? (
              <EmployeeTable search={search} department={department} />
            ) : (
              <JobTable
                jobs={jobs.filter(
                  (j) =>
                    (department === "All" || j.department === department) &&
                    `${j.title} ${j.department} ${j.status}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                )}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
