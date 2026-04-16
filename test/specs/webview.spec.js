const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const webViewPage = require('../pages/WebViewPage');

describe('WebView - Contexto web dentro do app', () => {

    beforeEach(async () => {
        await bottomNav.navigateTo('webview');
    });

    afterEach(async () => {
        try { await webViewPage.switchToNative(); } catch { /* já nativo */ }
    });

    it('@smoke deve carregar o WebView e verificar que o elemento existe', async () => {
        const webviewExists = await webViewPage.isScreenDisplayed(20000);
        expect(webviewExists).to.be.true;

        const contexts = await webViewPage.getAvailableContexts();
        const hasWebview = contexts.some(
            ctx => typeof ctx === 'string' && ctx.toUpperCase().includes('WEBVIEW')
        );
        expect(hasWebview, 'Contexto WEBVIEW deve estar disponível').to.be.true;
    });

    // Usa function() ao invés de arrow para ter acesso a this.skip()
    it('@regression deve obter título da página após troca de contexto', async function () {
        try {
            await webViewPage.switchToWebView();
            const title = await webViewPage.getPageTitle();
            expect(title).to.be.a('string');
            expect(title.length).to.be.greaterThan(0);
            await webViewPage.switchToNative();
        } catch (err) {
            if (err.message.includes('Chromedriver')) {
                this.skip();
            }
            throw err;
        }
    });

    it('@regression deve verificar que a URL contém referência ao WebDriverIO', async function () {
        try {
            await webViewPage.switchToWebView();
            const url = await webViewPage.getCurrentUrl();
            expect(url.toLowerCase()).to.include('webdriver');
            await webViewPage.switchToNative();
        } catch (err) {
            if (err.message.includes('Chromedriver')) {
                this.skip();
            }
            throw err;
        }
    });
});
