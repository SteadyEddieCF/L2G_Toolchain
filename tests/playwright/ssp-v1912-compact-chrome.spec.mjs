import { test, expect } from '@playwright/test';

const runtimePath='/modules/ssp/releases/v1.9.12/CMMC_L2_SSP_Modern_Editable_v1.9.12.html';
const targets=[
  {width:1366,height:768,maxToolbar:120,maxTop:225},
  {width:1440,height:900,maxToolbar:120,maxTop:225},
  {width:1536,height:864,maxToolbar:120,maxTop:225},
  {width:1668,height:1030,maxToolbar:120,maxTop:230},
  {width:1920,height:1080,maxToolbar:120,maxTop:230}
];

test('SSP v1.9.12 keeps laptop chrome compact without changing governed behavior',async({page})=>{
  const pageErrors=[],consoleErrors=[],externalRequests=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('request',request=>{const url=request.url();if(/^https?:/i.test(url)&&!url.startsWith('http://127.0.0.1:4173/'))externalRequests.push(url);});
  await page.goto(runtimePath,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__sspUx4ChromeTestHooks&&window.__sspTestHooks&&document.querySelector('#needsAttentionBtn')&&document.querySelector('#reviewWorkspaceBtn'));
  expect(await page.evaluate(()=>__sspTestHooks.RELEASE_VERSION)).toBe('1.9.12');
  expect(await page.evaluate(()=>__sspTestHooks.APP_VERSION)).toBe('1.9.12');
  expect(await page.evaluate(()=>__sspTestHooks.SCHEMA)).toBe('cmmc-l2-ssp-modern-v1.9.11');
  expect(await page.locator('.control-card').count()).toBe(110);

  for(const target of targets){
    await page.setViewportSize({width:target.width,height:target.height});
    await page.waitForTimeout(80);
    const measurement=await page.evaluate(()=>__sspUx4ChromeTestHooks.measure());
    expect(measurement.toolbarHeight).toBeLessThanOrEqual(target.maxToolbar);
    expect(measurement.documentTop).toBeLessThanOrEqual(target.maxTop);
    expect(await page.locator('#documentStateSummary').evaluate(el=>Math.ceil(el.getBoundingClientRect().height))).toBeLessThanOrEqual(52);
    expect(await page.locator('#stateLocalWarning').evaluate(el=>getComputedStyle(el).display)).toBe('none');
    expect(await page.locator('#uxPortfolioScopeWrap').evaluate(el=>({hidden:el.hidden,display:getComputedStyle(el).display}))).toEqual({hidden:true,display:'none'});
  }

  await page.setViewportSize({width:1366,height:768});
  await expect(page.locator('.history-controls')).toBeHidden();
  await page.locator('#moreMenu > summary').click();
  await expect(page.locator('#undoMenuBtn')).toBeVisible();
  await expect(page.locator('#redoMenuBtn')).toBeVisible();
  await expect(page.locator('#printMenuBtn')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#deliverBtn')).toBeVisible();
  await expect(page.locator('#exportMenu > summary')).toBeVisible();
  await expect(page.locator('#reviewWorkspaceBtn')).toHaveAttribute('aria-label','Open staged review workspace');
  await expect(page.locator('#needsAttentionBtn')).toBeVisible();
  await expect(page.locator('.toolbar-objective-nav')).toBeVisible();

  await page.evaluate(()=>document.body.classList.add('dark'));
  expect(await page.locator('.toolbar').evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
  await page.setViewportSize({width:1366,height:740});
  await page.waitForTimeout(50);
  await expect(page.locator('#guidanceStatus')).toBeHidden();
  await page.emulateMedia({media:'print'});
  await expect(page.locator('.toolbar')).toBeHidden();
  await expect(page.locator('#documentStateSummary')).toBeHidden();
  await page.emulateMedia({media:'screen'});

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
