import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const artifact = pathToFileURL(path.join(process.cwd(), "apps/integrated-suite-v0.6/dist/L2G_Integrated_Suite_Scope_v0.6.0.html")).href;

async function openScope(page) {
  await page.goto(artifact, { waitUntil: "commit", timeout: 30000 });
  const scope = page.locator('[data-workspace="scope"]');
  await expect(scope).toBeVisible({ timeout: 30000 });
  await scope.click();
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
}

async function addAdvisorOnlyAsset(page, label) {
  const replies = [label, "server"];
  const handler = async dialog => dialog.accept(replies.shift() ?? "");
  page.on("dialog", handler);
  await page.getByRole("button", { name: "Add asset" }).click();
  page.off("dialog", handler);
  await page.getByRole("button", { name: "Systems & Assets", exact: true }).click();
  await expect(page.getByText(label, { exact: true })).toBeVisible();
}

async function switchProfile(page, profile) {
  await page.locator("#profile-select").selectOption(profile);
  await expect(page.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
}

test("v0.6.1 clears Advisor-only Scope selection and inspector before Client render", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  await openScope(page);
  const secret = "Advisor secret asset — must not survive Client switch";
  await addAdvisorOnlyAsset(page, secret);
  await page.getByRole("button", { name: new RegExp(secret) }).click();
  await expect(page.getByRole("heading", { name: secret, exact: true })).toBeVisible();
  await expect(page.locator(".scope-inspector")).toContainText("Advisor Only");

  await switchProfile(page, "client");

  await expect(page.getByText(secret, { exact: true })).toHaveCount(0);
  await expect(page.locator(".scope-inspector-heading")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(secret);
  const focused = await page.evaluate(() => document.activeElement?.id ?? "");
  expect(["scope-title", "workspace", "profile-select"]).toContain(focused);
  expect(errors).toEqual([]);
});

test("v0.6.1 rebuilds Client diagram DOM and alternatives from visible projected records only", async ({ page }) => {
  const remote = [];
  const errors = [];
  page.on("request", request => { if (/^https?:/i.test(request.url())) remote.push(request.url()); });
  page.on("pageerror", error => errors.push(String(error)));
  await openScope(page);
  const secret = "Advisor-only diagram node — hidden from Client";
  await addAdvisorOnlyAsset(page, secret);

  await page.getByRole("button", { name: "Generate diagram" }).click();
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const generated = page.locator(".scope-diagram-card").filter({ hasText: "Scope diagram 2" }).first();
  await expect(generated).toBeVisible();
  await expect(generated).toContainText(secret);
  await generated.getByRole("button", { name: "Mark reviewed" }).click();

  await switchProfile(page, "client");
  await page.getByRole("button", { name: "Diagrams", exact: true }).click();
  const clientDiagram = page.locator(".scope-diagram-card").filter({ hasText: "Scope diagram 2" }).first();
  await expect(clientDiagram).toBeVisible();
  await expect(clientDiagram).not.toContainText(secret);
  await expect(clientDiagram.locator(".scope-diagram-canvas")).not.toHaveAttribute("aria-label", new RegExp(secret));
  await clientDiagram.getByText("Accessible text alternative").click();
  await expect(clientDiagram.locator("details p")).not.toContainText(secret);
  await expect(clientDiagram.locator(".scope-client-diagram-qualification")).toContainText(/omitted internal records and relationships are not shown or counted/i);
  await expect(page.locator("body")).not.toContainText(secret);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(item => ["serious", "critical"].includes(item.impact))).toEqual([]);
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
});
