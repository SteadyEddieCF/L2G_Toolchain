export const modules = [
  {
    slug: 'control-center-v0.3.3',
    name: 'L2G Control Center',
    version: 'v0.3.3',
    path: '/modules/control-center/releases/v0.3.3/L2G_CC_v0.3.3.html',
    darkStrategy: 'data-theme',
    visual: false
  },
  {
    slug: 'docconverter-v7.9.5',
    name: 'DocConverter-L2G',
    version: 'v7.9.5.1',
    path: '/modules/docconverter/releases/7.9.5.1/DocConverter-L2G_v7.9.5.1.html'
  },
  {
    slug: 'scoper-v3.12',
    name: 'L2G Scoper',
    version: 'v3.12',
    path: '/modules/scoper/releases/v3.12/L2Scoper-v3.12.html',
    visual: false
  },
  {
    slug: 'workshop-v76',
    name: 'CMMC L2 Gap Workshop Tool',
    version: 'v76',
    path: '/modules/workshop/releases/v76/cmmc_l2_gap_workshop_tool_v76.html',
    darkStrategy: 'dark-mode'
  },
  {
    slug: 'builder-merger-v3.8',
    name: 'L2G Builder/Merger',
    version: 'v3.8',
    path: '/modules/builder-merger/releases/v3.8/L2G-BM_v3.8.html'
  },
  {
    slug: 'ssp-v1.7.1',
    name: 'CMMC L2 SSP Modern Editable',
    version: 'v1.7.1',
    path: '/modules/ssp/releases/1.7.1/CMMC_L2_SSP_Modern_Editable_v1.7.1.html',
    darkStrategy: 'body-dark'
  }
];

export async function stabilizePage(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `
  }).catch(() => {});
  await page.waitForTimeout(500);
}

export async function applyDarkMode(page, strategy) {
  await page.evaluate((mode) => {
    if (mode === 'data-theme') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (mode === 'dark-mode') {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else if (mode === 'body-dark') {
      document.body.classList.add('dark');
    }
  }, strategy);
  await page.waitForTimeout(250);
}
