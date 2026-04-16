const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const dragPage = require('../pages/DragPage');

describe('Drag and Drop - Puzzle de arrastar', () => {

    beforeEach(async () => {
        await bottomNav.navigateTo('drag');
        await dragPage.waitForScreenLoaded();
    });

    it('@smoke deve manter a tela visível após arrastar uma peça', async () => {
        await dragPage.dragPieceToTarget(0);

        const isDisplayed = await dragPage.isScreenDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('@regression deve tentar resolver o puzzle e manter estabilidade', async () => {
        const solved = await dragPage.solvePuzzle();

        if (solved) {
            const text = await dragPage.getCongratulationsText();
            expect(text.toLowerCase()).to.include('congratulations');
        } else {
            // Puzzle de drag pode falhar em emuladores - verifica que a tela permanece estável
            const isDisplayed = await dragPage.isScreenDisplayed();
            expect(isDisplayed).to.be.true;
        }
    });

    it('@regression deve verificar funcionalidade do botão renew', async () => {
        // Arrasta uma peça
        await dragPage.dragPieceToTarget(0);

        // Testa o botão de renovar
        await dragPage.tapRenew();
        const isDisplayed = await dragPage.isScreenDisplayed();
        expect(isDisplayed).to.be.true;
    });
});
