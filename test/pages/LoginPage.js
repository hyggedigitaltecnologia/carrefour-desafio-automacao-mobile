const BasePage = require('./BasePage');
const WaitHelper = require('../helpers/WaitHelper');

class LoginPage extends BasePage {
    constructor() {
        super('~Login-screen');
    }

    // Abas
    get loginTabBtn()    { return $('~button-login-container'); }
    get signUpTabBtn()   { return $('~button-sign-up-container'); }

    // Campos de login
    get emailInput()     { return $('~input-email'); }
    get passwordInput()  { return $('~input-password'); }
    get loginButton()    { return $('~button-LOGIN'); }

    // Mensagens de erro
    get emailError()     { return $('//*[contains(@text,"Please enter a valid")]'); }
    get passwordError()  { return $('//*[contains(@text,"Please enter at least 8")]'); }

    async openLoginTab() {
        await this.tap('~button-login-container');
    }

    async openSignUpTab() {
        await this.tap('~button-sign-up-container');
    }

    async fillEmail(email) {
        const el = await WaitHelper.waitForVisible('~input-email');
        await el.click();
        await el.clearValue();
        await el.addValue(email);
    }

    async fillPassword(password) {
        const el = await WaitHelper.waitForVisible('~input-password');
        await el.click(); // Click dispara blur no campo anterior → validação
        await el.clearValue();
        await el.addValue(password);
    }

    async submitLogin() {
        // Esconde o teclado para revelar o botão LOGIN
        try { await driver.hideKeyboard(); } catch { /* teclado já oculto */ }
        await this.tap('~button-LOGIN');
    }

    async performLogin(email, password) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.submitLogin();
    }

    async getEmailErrorText() {
        try {
            const el = await this.emailError;
            await el.waitForDisplayed({ timeout: 5000 });
            return el.getText();
        } catch {
            return '';
        }
    }

    async getPasswordErrorText() {
        try {
            const el = await this.passwordError;
            await el.waitForDisplayed({ timeout: 5000 });
            return el.getText();
        } catch {
            return '';
        }
    }

    async isLoginButtonDisplayed() {
        return this.isVisible('~button-LOGIN');
    }
}

module.exports = new LoginPage();
