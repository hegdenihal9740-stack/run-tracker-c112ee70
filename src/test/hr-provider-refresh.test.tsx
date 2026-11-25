import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import * as contextModule from "@/features/hr/context";

afterEach(() => {
  cleanup();
  vi.doUnmock("react");
  vi.doUnmock("@/features/hr/context");
  vi.resetModules();
});

it("retains shared-data access when the provider module is re-evaluated", async () => {
  // Fast Refresh re-evaluates a changed provider while unchanged dependencies
  // (React and the context module) retain their identities.
  vi.doMock("react", () => React);
  vi.doMock("@/features/hr/context", () => contextModule);
  vi.resetModules();
  const { HRProvider } = await import("@/features/hr/store");
  function ExistingConsumer() {
    const { jobs } = contextModule.useHR();
    return <output>{jobs.find((job) => job.id === 1)?.title}</output>;
  }
  render(
    <HRProvider>
      <ExistingConsumer />
    </HRProvider>,
  );
  expect(screen.getByRole("status")).toHaveTextContent("Software Engineer");
});
