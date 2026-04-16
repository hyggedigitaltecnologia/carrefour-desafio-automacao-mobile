const BasePage = require('./BasePage');
const Gestures = require('../helpers/Gestures');
const WaitHelper = require('../helpers/WaitHelper');

// IDs das peças do puzzle
const PIECES = ['drag-l1', 'drag-c1', 'drag-r1', 'drag-l2', 'drag-c2', 'drag-r2', 'drag-l3', 'drag-c3', 'drag-r3'];

class DragPage extends BasePage {
    constructor() {
        super('~Drag-drop-screen');
    }

    get retryButton()        { return $('~button-Retry'); }
    get congratsMessage()    { return $('//*[contains(@text,"Congratulations")]'); }
    get renewButton()        { return $('~renew'); }

    /**
     * Arrasta uma peça para o alvo correspondente.
     * Retorna false se a peça não estiver mais visível (já posicionada).
     * @param {number} index - índice da peça (0-8)
     */
    async dragPieceToTarget(index) {
        const pieceId = PIECES[index];
        const dropId = pieceId.replace('drag', 'drop');

        const source = await $(`~${pieceId}`);
        const target = await $(`~${dropId}`);

        // Verifica se a peça ainda está visível antes de tentar arrastar
        const isSourceVisible = await source.isDisplayed().catch(() => false);
        const isTargetVisible = await target.isDisplayed().catch(() => false);

        if (!isSourceVisible || !isTargetVisible) {
            return false;
        }

        await Gestures.dragAndDrop(source, target);
        return true;
    }

    /**
     * Resolve o puzzle completo arrastando todas as peças
     */
    async solvePuzzle() {
        for (let i = 0; i < PIECES.length; i++) {
            await this.dragPieceToTarget(i);
            // Verifica se já resolveu
            if (await this.isCongratulationsVisible(1000)) {
                return true;
            }
        }
        return this.isCongratulationsVisible(3000);
    }

    async isCongratulationsVisible(timeout = 5000) {
        return WaitHelper.isVisible('//*[contains(@text,"Congratulations")]', timeout);
    }

    async getCongratulationsText() {
        return this.getText('//*[contains(@text,"Congratulations")]');
    }

    async isRetryVisible(timeout = 5000) {
        return WaitHelper.isVisible('~button-Retry', timeout);
    }

    async tapRetry() {
        await this.tap('~button-Retry');
    }

    async tapRenew() {
        await this.tap('~renew');
    }
}

module.exports = new DragPage();
