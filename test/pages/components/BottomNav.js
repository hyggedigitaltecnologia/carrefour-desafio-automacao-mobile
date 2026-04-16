const WaitHelper = require('../../helpers/WaitHelper');

/**
 * Componente de navegação inferior (tab bar).
 */
class BottomNav {
    get homeTab()     { return $('~Home'); }
    get webviewTab()  { return $('~Webview'); }
    get loginTab()    { return $('~Login'); }
    get formsTab()    { return $('~Forms'); }
    get swipeTab()    { return $('~Swipe'); }
    get dragTab()     { return $('~Drag'); }

    async navigateTo(tabName) {
        const tabs = {
            home: this.homeTab,
            webview: this.webviewTab,
            login: this.loginTab,
            forms: this.formsTab,
            swipe: this.swipeTab,
            drag: this.dragTab,
        };

        const tab = tabs[tabName.toLowerCase()];
        if (!tab) throw new Error(`Tab "${tabName}" não encontrada`);

        const el = await tab;
        await el.waitForDisplayed({ timeout: 10000 });
        await el.click();
    }

    async waitForNavLoaded(timeout = 10000) {
        await WaitHelper.waitForVisible('~Home', timeout);
    }

    async isTabVisible(tabName) {
        return WaitHelper.isVisible(`~${tabName}`, 3000);
    }
}

module.exports = new BottomNav();
