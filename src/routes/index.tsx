import { HiringPage } from "@/features/hr/hiring";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recruitment & Hiring | HR Management" },
      {
        name: "description",
        content:
          "Track candidates, manage interviews, review offers, and convert hires into employee profiles.",
      },
      { property: "og:title", content: "Recruitment & Hiring | HR Management" },
      {
        property: "og:description",
        content:
          "Track candidates, manage interviews, review offers, and convert hires into employee profiles.",
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
