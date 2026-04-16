const WaitHelper = require('../../helpers/WaitHelper');

// Seletores Android usando UiSelector (mais confiável que XPath para resource-id)
const SELECTORS = {
    container: 'android=new UiSelector().resourceId("com.wdiodemoapp:id/parentPanel")',
    title: 'android=new UiSelector().resourceId("com.wdiodemoapp:id/alert_title")',
    message: 'android=new UiSelector().resourceId("android:id/message")',
    okButton: 'android=new UiSelector().resourceId("android:id/button1")',
};

/**
 * Componente para manipular alertas nativos Android.
 */
class AlertDialog {
    get alertContainer()  { return $(SELECTORS.container); }
    get alertTitle()      { return $(SELECTORS.title); }
    get alertMessage()    { return $(SELECTORS.message); }
    get okButton()        { return $(SELECTORS.okButton); }

    async waitForAlert(timeout = 10000) {
        await WaitHelper.waitForVisible(SELECTORS.container, timeout);
    }

    async isAlertVisible(timeout = 5000) {
        return WaitHelper.isVisible(SELECTORS.container, timeout);
    }

    async getTitle() {
        await this.waitForAlert();
        const el = await this.alertTitle;
        return el.getText();
    }

    async getMessage() {
        await this.waitForAlert();
        const el = await this.alertMessage;
        return el.getText();
    }

    async tapOk() {
        const el = await this.okButton;
        await el.waitForDisplayed({ timeout: 5000 });
        await el.click();
    }

    async dismissIfPresent() {
        try {
            if (await this.isAlertVisible(3000)) {
                await this.tapOk();
            }
        } catch {
            // Tenta fallback com back button
            try {
                await driver.back();
            } catch {
                // Nenhum alerta para fechar
            }
        }
    }
}

module.exports = new AlertDialog();
