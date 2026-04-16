const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const swipePage = require('../pages/SwipePage');
const Gestures = require('../helpers/Gestures');

describe('Swipe - Carrossel e scroll', () => {

    beforeEach(async () => {
        await bottomNav.navigateTo('swipe');
        await swipePage.waitForScreenLoaded();
    });

    it('@smoke deve executar swipe para esquerda e manter tela estável', async () => {
        // Executa múltiplos swipes para garantir que o gesto funciona
        for (let i = 0; i < 3; i++) {
            await Gestures.swipeHorizontal('left', 0.6);
        }

        // Verifica que a tela de swipe permanece visível após os gestos
        const isDisplayed = await swipePage.isScreenDisplayed();
        expect(isDisplayed).to.be.true;

        // Swipe de volta para confirmar bidirecionalidade
        await Gestures.swipeHorizontal('right', 0.6);
        const stillDisplayed = await swipePage.isScreenDisplayed();
        expect(stillDisplayed).to.be.true;
    });

    it('@regression deve navegar para frente e voltar no carrossel com swipe', async () => {
        // Swipe left múltiplas vezes
        await swipePage.swipeCarouselLeft();
        await swipePage.swipeCarouselLeft();

        // Verifica estabilidade
        const isDisplayed = await swipePage.isScreenDisplayed();
        expect(isDisplayed).to.be.true;

        // Swipe right para voltar
        await swipePage.swipeCarouselRight();
        await swipePage.swipeCarouselRight();

        const stillDisplayed = await swipePage.isScreenDisplayed();
        expect(stillDisplayed).to.be.true;
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
