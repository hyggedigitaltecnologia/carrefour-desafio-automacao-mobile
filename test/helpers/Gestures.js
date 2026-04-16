/**
 * Helper de gestos mobile usando Appium mobile commands.
 * Os comandos mobile: delegam ao driver nativo (UiAutomator2).
 * IMPORTANTE: O parâmetro percent deve estar entre 0.0 e 1.0
 */
class Gestures {
    /**
     * Swipe horizontal usando mobile:swipeGesture (UiAutomator2)
     * @param {'left'|'right'} direction
     * @param {number} percent - porcentagem do swipe (0.0 a 1.0)
     */
    static async swipeHorizontal(direction, percent = 0.75) {
        const { width, height } = await driver.getWindowSize();
        await driver.execute('mobile: swipeGesture', {
            left: Math.round(width * 0.1),
            top: Math.round(height * 0.4),
            width: Math.round(width * 0.8),
            height: Math.round(height * 0.2),
            direction,
            percent: Math.min(percent, 1.0),
        });
    }

    /**
     * Scroll vertical usando mobile:scrollGesture (UiAutomator2)
     * @param {'down'|'up'} direction
     * @param {number} percent - porcentagem do scroll (0.0 a 1.0)
     */
    static async scrollVertical(direction = 'down', percent = 0.75) {
        const { width, height } = await driver.getWindowSize();
        await driver.execute('mobile: scrollGesture', {
            left: Math.round(width * 0.1),
            top: Math.round(height * 0.2),
            width: Math.round(width * 0.8),
            height: Math.round(height * 0.6),
            direction,
            percent: Math.min(percent, 1.0),
        });
    }

    /**
     * Scroll até um elemento ficar visível
     * @param {string} selector - seletor do elemento alvo
     * @param {'down'|'up'} direction
     * @param {number} maxAttempts
     */
    static async scrollToElement(selector, direction = 'down', maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            const el = await $(selector);
            if (await el.isDisplayed().catch(() => false)) {
                return el;
            }
            await Gestures.scrollVertical(direction, 0.5);
        }
        throw new Error(`Elemento "${selector}" não encontrado após ${maxAttempts} tentativas de scroll`);
    }

    /**
     * Drag and drop usando mobile:dragGesture (UiAutomator2)
     * @param {WebdriverIO.Element} source
     * @param {WebdriverIO.Element} target
     */
    static async dragAndDrop(source, target) {
        const sourceLocation = await source.getLocation();
        const sourceSize = await source.getSize();
        const targetLocation = await target.getLocation();
        const targetSize = await target.getSize();

        const startX = Math.round(sourceLocation.x + sourceSize.width / 2);
        const startY = Math.round(sourceLocation.y + sourceSize.height / 2);
        const endX = Math.round(targetLocation.x + targetSize.width / 2);
        const endY = Math.round(targetLocation.y + targetSize.height / 2);

        await driver.execute('mobile: dragGesture', {
            startX,
            startY,
            endX,
            endY,
            speed: 800,
        });
    }

    /**
     * Swipe em um elemento específico
     * @param {WebdriverIO.Element} element
     * @param {'left'|'right'|'up'|'down'} direction
     * @param {number} percent - entre 0.0 e 1.0
     */
    static async swipeOnElement(element, direction, percent = 0.75) {
        const location = await element.getLocation();
        const size = await element.getSize();

        await driver.execute('mobile: swipeGesture', {
            left: Math.round(location.x),
            top: Math.round(location.y),
            width: Math.round(size.width),
            height: Math.round(size.height),
            direction,
            percent: Math.min(percent, 1.0),
        });
    }
}

module.exports = Gestures;
