const { test, expect } = require('@playwright/test');


test('test register flow', async ({ page }) => {

  // Locators
  const emailInput = page.locator('input[placeholder="Enter your email"]');
  const usernameInput = page.locator('input[placeholder="Enter your username"]');
  const passwordInput = page.locator('input[placeholder="Enter your password"]');

  const registerForm = page.locator('.register-form');
  const submitButton = registerForm.locator('button[type="submit"]');

  // Test
  await page.goto('http://localhost:3000/register');

  await emailInput.fill('test@example.com');
  await usernameInput.fill('testuser');
  await passwordInput.fill('123456');
  const [response] = await Promise.all([
    page.waitForResponse('http://localhost:3100/api/user/register'),
    submitButton.click() 
  ]);

  expect(response.status()).toBe(200);

  await expect(page).toHaveURL('http://localhost:3000/login');
});
test('test register validation', async ({ page }) => {

  // Locators
 // Locators
 const emailInput = page.locator('input[placeholder="Enter your email"]');
 const passwordInput = page.locator('input[placeholder="Enter your password"]');
 const registerForm = page.locator('.register-form');
 const submitButton = registerForm.locator('button[type="submit"]');

  const errorMessages = page.locator('.register-error-message');
  // Test
  await page.goto('http://localhost:3000/register');

  await emailInput.fill('');
  await passwordInput.fill('');
  await submitButton.click() 

  // Expect
  await expect(errorMessages).toHaveCount(1);

  await expect(errorMessages).toContainText('Password must contain at least 6 characters');
});
test('Failed register with empty username and password', async ({ page }) => {

  // Locators
 // Locators
 const emailInput = page.locator('input[placeholder="Enter your email"]');
 const passwordInput = page.locator('input[placeholder="Enter your password"]');
 const registerForm = page.locator('.register-form');
 const submitButton = registerForm.locator('button[type="submit"]');
  const errorMessages = page.locator('.register-error-message');
  // Test
  await page.goto('http://localhost:3000/register');

  await emailInput.fill('');
  await passwordInput.fill('');
  await submitButton.click() 

  // Expect
  await expect(errorMessages).toHaveCount(1);

  await expect(errorMessages).toContainText('Please enter username and password');
});