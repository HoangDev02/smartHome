export class LoginPage {

    constructor(page) {
      this.page = page;
  
      // Locators
      this.usernameField = page.locator('#formUsername');
      this.passwordField = page.locator('#formPassword'); 
    }
  
    async login(username, password) {
      await this.usernameField.fill(username);
      await this.passwordField.fill(password); 
    }
  
  }