# Visual Regression Report — v1.9.9

**Bounded result:** Passed in Chromium execution.

Evidence includes the initial light-mode workspace and a dark constrained-viewport workspace after explicit v0.2 adoption and runtime restore. Print media hides the modal. The container blocks all browser navigation by policy, so screenshots were produced using the same standalone HTML through `setContent`; native Windows `file://` is separately pending in draft-PR CI.
