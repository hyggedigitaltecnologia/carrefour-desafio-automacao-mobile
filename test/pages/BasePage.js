const WaitHelper = require('../helpers/WaitHelper');

/**
 * Classe base para todos os Page Objects.
 * Usa composição com WaitHelper ao invés de métodos inline de espera.
 */
class BasePage {
    constructor(screenSelector) {
        this._screenSelector = screenSelector;
    }

    get screenElement() {
        return $(this._screenSelector);
    }

    async waitForScreenLoaded(timeout = 15000) {
        await WaitHelper.waitForVisible(this._screenSelector, timeout);
    }

    async isScreenDisplayed(timeout = 5000) {
        return WaitHelper.isVisible(this._screenSelector, timeout);
    }

    async tap(selector, timeout = 15000) {
        return WaitHelper.tapWhenReady(selector, timeout);
    }

    async type(selector, text, timeout = 15000) {
        return WaitHelper.typeWhenReady(selector, text, timeout);
    }

    async getText(selector, timeout = 10000) {
        return WaitHelper.getTextWhenReady(selector, timeout);
    }

    async isVisible(selector, timeout = 5000) {
        return WaitHelper.isVisible(selector, timeout);
    }
}

module.exports = BasePage;
