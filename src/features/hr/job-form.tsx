import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import fields from "./job-fields.json";
import { useHR } from "./context";

export function JobForm({ onDone }: { onDone: () => void }) {
  const { setJobs } = useHR();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const details = Object.fromEntries(
      Array.from(new FormData(form), ([key, value]) => [key, String(value).trim()]),
    );
    if (fields.some((field) => field.required && !details[field.id])) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setJobs((jobs) => [
      ...jobs,
      {
        id: Math.max(0, ...jobs.map((j) => j.id)) + 1,
        title: details["job-title"] ?? "",
        department: details["department"] ?? "",
        vacancies: Number(details["vacancies"]),
        employment: details["employment-type"] ?? "",
        location: details["work-location"] ?? "",
        status: details["status"] ?? "Draft",
        createdAt: new Date().toISOString(),
        details,
      },
    ]);
    toast.success("Job requirement added to this session.");
    onDone();
  }
  return (
    <section>
      <h2>Create Job Requirement</h2>
      <form onSubmit={submit}>
        <div className="hr-form-grid">
          {fields.map((field) => (
            <div className="hr-field" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              {field.kind === "select" ? (
                <select id={field.id} name={field.id} required={field.required}>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option || `Select ${field.label.replace(" *", "")}`}
                    </option>
                  ))}
                </select>
              ) : field.kind === "textarea" ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  {...(field.type === "number"
                    ? {
                        min: field.id === "vacancies" ? 1 : 0,
                        step: field.id === "vacancies" ? 1 : 0.01,
                      }
                    : {})}
                />
              )}
            </div>
          ))}
        </div>
        <div className="hr-actions">
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit">Add Job Requirement</Button>
        </div>
      </form>
    </section>
  );
}
