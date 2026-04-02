import { createRoot } from "react-dom/client";
import { Widget } from "./Widget";

function mount() {
  const scripts = document.querySelectorAll("script[data-employee-id]");
  if (!scripts.length) return;

  const script = scripts[scripts.length - 1] as HTMLScriptElement;

  const config = {
    employeeId: script.getAttribute("data-employee-id") ?? "",
    tenantKey: script.getAttribute("data-tenant-key") ?? "",
    apiBaseUrl: script.getAttribute("data-api-url") ?? "https://api.aria.ai",
    primaryColor: script.getAttribute("data-primary-color") ?? "#6366F1",
    greeting: script.getAttribute("data-greeting") ?? undefined,
    placeholder: script.getAttribute("data-placeholder") ?? undefined,
    employeeName: script.getAttribute("data-employee-name") ?? "Aria",
  };

  if (!config.employeeId) {
    console.warn("[Aria] Missing data-employee-id attribute on widget script tag.");
    return;
  }

  const container = document.createElement("div");
  container.id = "aria-widget-root";
  document.body.appendChild(container);

  createRoot(container).render(<Widget config={config} />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
