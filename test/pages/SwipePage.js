const BasePage = require('./BasePage');
const Gestures = require('../helpers/Gestures');
const WaitHelper = require('../helpers/WaitHelper');

class SwipePage extends BasePage {
    constructor() {
        super('~Swipe-screen');
    }

    get wdioLogo()    { return $('~WebdriverIO logo'); }

    /**
     * Captura snapshot do conteúdo visível na área do carrossel.
     * Usa page source para detectar mudanças após swipe.
     */
    async getCarouselSnapshot() {
        const source = await driver.getPageSource();
        // Extrai um trecho relevante do source para comparação
        const cardMatch = source.match(/card[\s\S]{0,500}/g);
        return cardMatch ? cardMatch.join('|') : source.substring(0, 2000);
    }

    async swipeCarouselLeft() {
        await Gestures.swipeHorizontal('left', 0.6);
    }

    async swipeCarouselRight() {
        await Gestures.swipeHorizontal('right', 0.6);
    }

    async scrollDownToLogo() {
        // Tenta múltiplos seletores para o logo (pode variar entre versões do app)
        const logoSelectors = [
            '~WebdriverIO logo',
            '//*[contains(@content-desc,"WebdriverIO")]',
            '//*[contains(@content-desc,"webdriverio")]',
            '//*[contains(@text,"You found me")]',
        ];

        for (const selector of logoSelectors) {
            try {
                return await Gestures.scrollToElement(selector, 'down', 8);
            } catch {
                // Tenta o próximo seletor - navega de volta ao topo
                await Gestures.scrollVertical('up', 0.8);
                await Gestures.scrollVertical('up', 0.8);
            }
        }

        // Último recurso: usa UiScrollable do Android
        const scrollableSelector = 'android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(5)';
        const el = await $(scrollableSelector);
        return el;
    }

    async isLogoVisible() {
        const selectors = ['~WebdriverIO logo', '//*[contains(@content-desc,"WebdriverIO")]'];
        for (const sel of selectors) {
            if (await WaitHelper.isVisible(sel, 2000)) return true;
        }
        return false;
    }

    /**
     * Obtém o texto abaixo do logo (encontrado via scroll)
     */
    async getLogoText() {
        const selectors = [
            '//*[contains(@text,"You found me")]',
            '//*[contains(@content-desc,"You found me")]',
        ];
        for (const sel of selectors) {
            try {
                const el = await $(sel);
                await el.waitForDisplayed({ timeout: 5000 });
                return el.getText();
            } catch {
                continue;
            }
        }
        return '';
    }
}

module.exports = new SwipePage();
