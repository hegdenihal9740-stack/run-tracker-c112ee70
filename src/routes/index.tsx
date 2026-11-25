import { HiringPage } from "@/features/hr/hiring";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HR Management Dashboard" },
      {
        name: "description",
        content:
          "Manage hiring, employee performance, payroll, and personnel records in one HR workspace.",
      },
      { property: "og:title", content: "HR Management Dashboard" },
      {
        property: "og:description",
        content:
          "Manage hiring, employee performance, payroll, and personnel records in one HR workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <HiringPage />;
}
