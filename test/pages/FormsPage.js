const BasePage = require('./BasePage');
const Gestures = require('../helpers/Gestures');
const WaitHelper = require('../helpers/WaitHelper');

class FormsPage extends BasePage {
    constructor() {
        super('~Forms-screen');
    }

    get textInput()       { return $('~text-input'); }
    get inputResult()     { return $('~input-text-result'); }
    get switchToggle()    { return $('~switch'); }
    get switchText()      { return $('~switch-text'); }
    get dropdown()        { return $('~Dropdown'); }
    get activeButton()    { return $('~button-Active'); }
    get inactiveButton()  { return $('~button-Inactive'); }

    async fillTextInput(text) {
        await this.type('~text-input', text);
    }

    async getInputResultText() {
        return this.getText('~input-text-result');
    }

    async clearTextInput() {
        const el = await this.textInput;
        await el.waitForDisplayed({ timeout: 10000 });
        await el.clearValue();
    }

    async toggleSwitch() {
        await this.tap('~switch');
    }

    async isSwitchOn() {
        const text = await this.getText('~switch-text');
        return text.includes('ON');
    }

    async selectDropdownOption(optionText) {
        await this.tap('~Dropdown');
        // Aguarda o dialog do picker aparecer, depois seleciona a opção
        // Tenta múltiplas estratégias de seletor para o Android picker
        const strategies = [
            `android=new UiSelector().text("${optionText}")`,
            `//*[@text="${optionText}"]`,
            `android=new UiSelector().textContains("${optionText.split(' ')[0]}")`,
        ];

        for (const selector of strategies) {
            try {
                const el = await $(selector);
                const isDisplayed = await el.waitForDisplayed({ timeout: 5000 }).then(() => true).catch(() => false);
                if (isDisplayed) {
                    await el.click();
                    return;
                }
            } catch {
                continue;
            }
        }
        throw new Error(`Não foi possível selecionar a opção "${optionText}" no dropdown`);
    }

    async getDropdownValue() {
        try {
            // Tenta pegar o texto do elemento Dropdown ou de um TextView filho
            const el = await this.dropdown;
            await el.waitForDisplayed({ timeout: 5000 });
            // Busca o TextView dentro do dropdown
            const textView = await el.$('android.widget.TextView');
            if (await textView.isExisting()) {
                return textView.getText();
            }
            return el.getText();
        } catch {
            return '';
        }
    }

    async tapActiveButton() {
        try {
            await Gestures.scrollToElement('~button-Active', 'down', 3);
        } catch {
            // Já está visível
        }
        await this.tap('~button-Active');
    }

    async tapInactiveButton() {
        try {
            await Gestures.scrollToElement('~button-Inactive', 'down', 3);
        } catch {
            // Já está visível
        }
        await this.tap('~button-Inactive');
    }
}

module.exports = new FormsPage();
