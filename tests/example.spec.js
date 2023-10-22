// @ts-check
const { test, expect } = require('@playwright/test');

// e2e.spec.ts
test('Test turn on/off fan', async ({ page }) => {

  await page.goto('https://smart-offices.vercel.app/');

  await page.click('label.button_PAN ');

  await page.waitForTimeout(1000); 

  const isLightOn = await page.evaluate(() => {
    const label = document.querySelector('label.button_PAN ');
    return label ? label.classList.contains('checked') : false;
  });

  expect(isLightOn).toBe(true);

  await page.click('label.button_PAN ');

  await page.waitForTimeout(1000); 

  const isLightOff = await page.evaluate(() => {
    const label = document.querySelector('label.button_PAN ');
    return label ? !label.classList.contains('checked') : true;
  });

  expect(isLightOff).toBe(true);

});

test('Test turn on/off light', async ({ page }) => {
  await page.goto('https://smart-offices.vercel.app/');

  await page.click('label.button_LED');

  await page.waitForTimeout(1000); // Adjust the timeout as needed

  const isLightOn = await page.evaluate(() => {
    const label = document.querySelector('label.button_LED');
    return label ? label.classList.contains('checked') : false;
  });

  expect(isLightOn).toBe(true);

  await page.click('label.button_LED');

  await page.waitForTimeout(1000); 

  const isLightOff = await page.evaluate(() => {
    const label = document.querySelector('label.button_LED');
    return label ? !label.classList.contains('checked') : true;
  });

  expect(isLightOff).toBe(true);
});