import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const artifactPath = path.join(repoRoot, "apps", "integrated-suite-v0.4", "dist", "L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html");
export const artifactUrl = "/apps/integrated-suite-v0.4/dist/L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html";
export const artifactFileUrl = pathToFileURL(artifactPath).href;
export const syntheticPassphrase = "Synthetic-V04-Playwright-Passphrase";

export async function openV04(page, useFileOrigin = false) {
  const requests = [];
  page.on("request", request => {
    const url = request.url();
    if (!url.startsWith("data:") && !url.startsWith("blob:") && !url.startsWith("file:") && !url.includes("127.0.0.1") && !url.includes("localhost")) requests.push(url);
  });
  await page.goto(useFileOrigin ? artifactFileUrl : artifactUrl);
  await page.locator("#workspace").waitFor({ state: "visible" });
  return requests;
}

export async function chooseDialog(page, buttonText) {
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor({ state: "visible" });
  await dialog.getByRole("button", { name: buttonText, exact: true }).click();
}

export async function enterPassphrase(page, title, passphrase = syntheticPassphrase, confirm = false) {
  const dialog = page.getByRole("dialog").filter({ hasText: title });
  await dialog.waitFor({ state: "visible" });
  const passwords = dialog.locator('input[type="password"]');
  await passwords.nth(0).fill(passphrase);
  if (confirm) await passwords.nth(1).fill(passphrase);
  await dialog.getByRole("button", { name: "Continue" }).click();
}
