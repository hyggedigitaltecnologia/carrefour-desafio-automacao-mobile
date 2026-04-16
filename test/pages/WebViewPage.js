const BasePage = require('./BasePage');
const WaitHelper = require('../helpers/WaitHelper');

class WebViewPage extends BasePage {
    constructor() {
        super('//android.webkit.WebView');
    }

    /**
     * Aguarda o WebView carregar usando polling de contextos.
     * Zero uso de driver.pause().
     */
    async waitForWebViewReady(timeout = 30000) {
        await WaitHelper.waitForExist('//android.webkit.WebView', timeout);
        return WaitHelper.waitForWebViewContext(timeout);
    }

    /**
     * Troca para o contexto WebView.
     * Se o chromedriver não estiver disponível, lança erro com mensagem clara.
     */
    async switchToWebView() {
        const contextName = await this.waitForWebViewReady();
        try {
            await driver.switchContext(contextName);
        } catch (err) {
            if (err.message && err.message.includes('Chromedriver')) {
                throw new Error(
                    'Chromedriver incompatível com a versão do Chrome no emulador. ' +
                    'Instale o chromedriver correto ou atualize o Chrome. Erro: ' + err.message
                );
            }
            throw err;
        }
        return contextName;
    }

    /**
     * Retorna ao contexto nativo
     */
    async switchToNative() {
        await driver.switchContext('NATIVE_APP');
    }

    /**
     * Obtém o título da página no contexto WebView
     */
    async getPageTitle() {
        return driver.getTitle();
    }

    /**
     * Obtém a URL atual no contexto WebView
     */
    async getCurrentUrl() {
        return driver.getUrl();
    }

    /**
     * Lista todos os contextos disponíveis
     */
    async getAvailableContexts() {
        return driver.getContexts();
    }
}

module.exports = new WebViewPage();
