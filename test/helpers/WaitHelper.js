/**
 * Helper de espera explícita sem uso de driver.pause().
 * Todas as esperas são baseadas em condições reais.
 */
class WaitHelper {
    /**
     * Aguarda um elemento estar visível e retorna ele
     * @param {string|WebdriverIO.Element} selectorOrElement
     * @param {number} timeout
     * @returns {Promise<WebdriverIO.Element>}
     */
    static async waitForVisible(selectorOrElement, timeout = 15000) {
        const el = typeof selectorOrElement === 'string'
            ? await $(selectorOrElement)
            : selectorOrElement;
        await el.waitForDisplayed({ timeout, timeoutMsg: `Elemento não visível após ${timeout}ms` });
        return el;
    }

    /**
     * Aguarda um elemento existir no DOM
     * @param {string} selector
     * @param {number} timeout
     * @returns {Promise<WebdriverIO.Element>}
     */
    static async waitForExist(selector, timeout = 15000) {
        const el = await $(selector);
        await el.waitForExist({ timeout, timeoutMsg: `Elemento não existe após ${timeout}ms` });
        return el;
    }

    /**
     * Aguarda até que uma condição retorne true
     * @param {Function} conditionFn - função que retorna boolean
     * @param {number} timeout
     * @param {string} message
     */
    static async waitUntilCondition(conditionFn, timeout = 15000, message = 'Condição não atendida') {
        await driver.waitUntil(conditionFn, {
            timeout,
            timeoutMsg: `${message} após ${timeout}ms`,
            interval: 500,
        });
    }

    /**
     * Aguarda que o contexto WEBVIEW esteja disponível (sem pause!)
     * @param {number} timeout
     * @returns {Promise<string>} nome do contexto webview
     */
    static async waitForWebViewContext(timeout = 30000) {
        let webviewContext = null;
        await driver.waitUntil(async () => {
            const contexts = await driver.getContexts();
            webviewContext = contexts.find(
                ctx => typeof ctx === 'string' && ctx.toUpperCase().includes('WEBVIEW')
            );
            return !!webviewContext;
        }, {
            timeout,
            timeoutMsg: `Contexto WEBVIEW não disponível após ${timeout}ms`,
            interval: 1000,
        });
        return webviewContext;
    }

    /**
     * Clica em um elemento após aguardar visibilidade
     * @param {string|WebdriverIO.Element} selectorOrElement
     * @param {number} timeout
     */
    static async tapWhenReady(selectorOrElement, timeout = 15000) {
        const el = await WaitHelper.waitForVisible(selectorOrElement, timeout);
        await el.click();
        return el;
    }

    /**
     * Digita texto após aguardar visibilidade
     * @param {string|WebdriverIO.Element} selectorOrElement
     * @param {string} text
     * @param {number} timeout
     */
    static async typeWhenReady(selectorOrElement, text, timeout = 15000) {
        const el = await WaitHelper.waitForVisible(selectorOrElement, timeout);
        await el.clearValue();
        await el.setValue(text);
        return el;
    }

    /**
     * Obtém texto de um elemento após aguardar
     * @param {string|WebdriverIO.Element} selectorOrElement
     * @param {number} timeout
     * @returns {Promise<string>}
     */
    static async getTextWhenReady(selectorOrElement, timeout = 10000) {
        const el = await WaitHelper.waitForVisible(selectorOrElement, timeout);
        return el.getText();
    }

    /**
     * Verifica se um elemento está visível (sem erro)
     * @param {string} selector
     * @param {number} timeout
     * @returns {Promise<boolean>}
     */
    static async isVisible(selector, timeout = 5000) {
        try {
            const el = await $(selector);
            await el.waitForDisplayed({ timeout });
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = WaitHelper;
