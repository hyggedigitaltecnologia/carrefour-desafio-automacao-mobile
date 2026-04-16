const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const swipePage = require('../pages/SwipePage');

describe('Swipe - Carrossel e scroll', () => {

    beforeEach(async () => {
        await bottomNav.navigateTo('swipe');
        await swipePage.waitForScreenLoaded();
    });

    it('@smoke deve alterar o conteúdo ao realizar swipe para esquerda', async () => {
        const snapshotBefore = await swipePage.getCarouselSnapshot();
        await swipePage.swipeCarouselLeft();

        // Aguarda até que o conteúdo da tela mude
        await driver.waitUntil(async () => {
            const snapshotAfter = await swipePage.getCarouselSnapshot();
            return snapshotAfter !== snapshotBefore;
        }, {
            timeout: 15000,
            interval: 1000,
            timeoutMsg: 'Conteúdo do carrossel não mudou após swipe left',
        });
    });

    it('@regression deve navegar para frente e voltar no carrossel com swipe', async () => {
        const snapshotInitial = await swipePage.getCarouselSnapshot();

        await swipePage.swipeCarouselLeft();
        await driver.waitUntil(async () => {
            const snapshot = await swipePage.getCarouselSnapshot();
            return snapshot !== snapshotInitial;
        }, { timeout: 15000, interval: 1000 });

        const snapshotAfterLeft = await swipePage.getCarouselSnapshot();

        await swipePage.swipeCarouselRight();
        await driver.waitUntil(async () => {
            const snapshot = await swipePage.getCarouselSnapshot();
            return snapshot !== snapshotAfterLeft;
        }, { timeout: 15000, interval: 1000 });
    });

    it('@regression deve revelar conteúdo oculto ao realizar scroll para baixo', async () => {
        const logoVisibleBefore = await swipePage.isLogoVisible();
        expect(logoVisibleBefore).to.be.false;

        await swipePage.scrollDownToLogo();

        const logoVisibleAfter = await swipePage.isLogoVisible();
        expect(logoVisibleAfter).to.be.true;
    });

    it('@regression deve encontrar o texto do logo WebDriverIO após scroll completo', async () => {
        await swipePage.scrollDownToLogo();

        const logoText = await swipePage.getLogoText();
        expect(logoText.toLowerCase()).to.include('you found me');
    });
});
