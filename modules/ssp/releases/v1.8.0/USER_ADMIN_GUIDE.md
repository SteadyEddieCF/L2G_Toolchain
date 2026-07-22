# User and Administrator Guide — v1.8.0

Use the tool normally for one SSP; no portfolio setup is required. To prepare a modular architecture, open **Actions → Workspace mode → Enable optional SSP portfolio mode**.

Review the migration preview, enter the portfolio name, and choose **Create backup and enable portfolio mode**. The existing SSP becomes the anchor. Use **Add module** for shared services, tenants, products, applications, or enclaves. Select a module before exporting its foundation record.

Use **Roll back to pre-conversion backup** to return to the captured Single-System workspace. Export the portfolio foundation first if module metadata may be needed later.

Administrative cautions:

- Handle exports as potentially sensitive system-security information.
- Do not label child module shells as complete or approved SSPs.
- Do not infer inheritance, applicability, responsibility, or compliance from the hierarchy.
- Keep the HTML and JSON backups in approved local storage.
