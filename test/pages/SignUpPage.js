const BasePage = require('./BasePage');
const WaitHelper = require('../helpers/WaitHelper');

class SignUpPage extends BasePage {
    constructor() {
        super('~Login-screen');
    }

    get emailInput()           { return $('~input-email'); }
    get passwordInput()        { return $('~input-password'); }
    get confirmPasswordInput() { return $('~input-repeat-password'); }
    get signUpButton()         { return $('~button-SIGN UP'); }
    get signUpTabBtn()         { return $('~button-sign-up-container'); }

    // Mensagens de erro
    get emailError()           { return $('//*[contains(@text,"Please enter a valid")]'); }
    get passwordError()        { return $('//*[contains(@text,"Please enter at least 8")]'); }
    get confirmError()         { return $('//*[contains(@text,"Please enter the same password")]'); }

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
        await el.click(); // Dispara blur no campo anterior
        await el.clearValue();
        await el.addValue(password);
    }

    async fillConfirmPassword(confirmPassword) {
        const el = await WaitHelper.waitForVisible('~input-repeat-password');
        await el.click(); // Dispara blur no campo anterior
        await el.clearValue();
        await el.addValue(confirmPassword);
    }

    async submitSignUp() {
        try { await driver.hideKeyboard(); } catch { /* teclado já oculto */ }
        await this.tap('~button-SIGN UP');
    }

    async performSignUp(email, password, confirmPassword) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.fillConfirmPassword(confirmPassword || password);
        await this.submitSignUp();
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

    async getConfirmPasswordErrorText() {
        try {
            const el = await this.confirmError;
            await el.waitForDisplayed({ timeout: 5000 });
            return el.getText();
        } catch {
            return '';
        }
    }
}

module.exports = new SignUpPage();
