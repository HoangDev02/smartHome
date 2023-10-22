const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page/loginPage');

test('Test đăng nhập', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to the login page using the Playwright page object
    await page.goto('http://localhost:3000/login');
  
    // Thực hiện đăng nhập
    await loginPage.login('a', '123456');
  
    // Nhấn nút đăng nhập
    await page.locator('button.login-button', {hasText: 'Continue'}).click();

  
    // Kiểm tra rằng sau khi đăng nhập thành công, URL đã chuyển đổi
    await expect(page).toHaveURL('http://localhost:3000');
});
test('Failed login with incorrect username', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    
    await page.goto('http://localhost:3000/login');
  
    // Perform login with incorrect username
    await loginPage.login('r', '123456');
    
    // Click the login button
    await page.locator('button.login-button', {hasText: 'Continue'}).click();
  
    // Check if an error message is displayed
    const errorMessageLocator = page.locator('.error-message'); 
    const errorMessage = await errorMessageLocator.innerText();
  
    // Assert that the error message exists
    await expect(errorMessage).toContain('Wrong username or password'); 
  
    // Check that after a failed login, the URL does not change 
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
  
  test('Failed login with incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
  
    // Perform login with incorrect password
    await loginPage.login('a', '12347');
  
    // Click the login button
    await page.locator('button.login-button', {hasText: 'Continue'}).click();
      // Check if an error message is displayed
      const errorMessageLocator = page.locator('.error-message'); 
      const errorMessage = await errorMessageLocator.innerText();
    
      // Assert that the error message exists
      await expect(errorMessage).toContain('Wrong username or password'); // Replace with the expected error message
    
  
    // Check that after a failed login, the URL does not change (or you can check for error messages)
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
  test('Failed login with empty username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
  
    // Perform login with empty username and password
    await loginPage.login('', '');
  
    // Click the login button
    await page.locator('button.login-button', {hasText: 'Continue'}).click();

      // Check if an error message is displayed
      const errorMessageLocator = page.locator('.error-message'); // Replace with the actual selector for the error message
      const errorMessage = await errorMessageLocator.innerText();
    
      // Assert that the error message exists
      await expect(errorMessage).toContain('Please enter username and password'); // Replace with the expected error message
    
    // Check that after a failed login, the URL does not change (or you can check for error messages)
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
  
  test('Failed login with valid username and empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
  
    // Perform login with a valid username and an empty password
    await loginPage.login('a', '123#');
  
    // Click the login button
    await page.locator('button.login-button', {hasText: 'Continue'}).click();

    const errorMessageLocator = page.locator('.error-message'); // Replace with the actual selector for the error message
    const errorMessage = await errorMessageLocator.innerText();
  
    // Assert that the error message exists
    await expect(errorMessage).toContain('Wrong username or password'); // Replace with the expected error message
    // Check that after a failed login, the URL does not change (or you can check for error messages)
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
  
  test('Failed login with non-existent username and valid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    // Navigate to the login page
    await page.goto('http://localhost:3000/login');
  
    // Perform login with a non-existent username and a valid password
    await loginPage.login('iou', '123456');
  
    // Click the login button
    await page.locator('button.login-button', {hasText: 'Continue'}).click();

  
    // Check that after a failed login, the URL does not change (or you can check for error messages)
    await expect(page).toHaveURL('http://localhost:3000/login');
  });