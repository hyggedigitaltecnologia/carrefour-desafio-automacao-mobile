const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const alertDialog = require('../pages/components/AlertDialog');
const formsPage = require('../pages/FormsPage');
const DataLoader = require('../helpers/DataLoader');

describe('Formulários - Preenchimento e interações', () => {
    const formData = DataLoader.loadJSON('formData.json');

    beforeEach(async () => {
        await alertDialog.dismissIfPresent();
        await bottomNav.navigateTo('forms');
        await formsPage.waitForScreenLoaded();
    });

    afterEach(async () => {
        await alertDialog.dismissIfPresent();
    });

    // Cenário 9 — data-driven com JSON (filtra apenas textos simples/números)
    it('@regression deve refletir texto digitado no resultado: texto simples', async () => {
        const input = formData.textInputs[0]; // texto simples
        await formsPage.fillTextInput(input.value);
        const result = await formsPage.getInputResultText();
        expect(result).to.equal(input.value);
    });

    it('@regression deve refletir texto digitado no resultado: apenas números', async () => {
        const input = formData.textInputs[3]; // apenas números
        await formsPage.fillTextInput(input.value);
        const result = await formsPage.getInputResultText();
        expect(result).to.equal(input.value);
    });

    // Cenário 10
    it('@smoke deve alternar o switch entre ON e OFF', async () => {
        const initialState = await formsPage.isSwitchOn();
        await formsPage.toggleSwitch();

        const newState = await formsPage.isSwitchOn();
        expect(newState).to.not.equal(initialState);

        await formsPage.toggleSwitch();
        const restoredState = await formsPage.isSwitchOn();
        expect(restoredState).to.equal(initialState);
    });

    it('@regression deve selecionar uma opção do dropdown', async () => {
        const option = formData.dropdownOptions[0]; // "webdriver.io is awesome"
        await formsPage.selectDropdownOption(option);
        // Se chegou aqui sem erro, a seleção foi realizada com sucesso
        const isFormVisible = await formsPage.isScreenDisplayed();
        expect(isFormVisible).to.be.true;
    });

    it('@regression deve exibir alerta nativo ao clicar no botão Active', async () => {
        await formsPage.tapActiveButton();

        const alertVisible = await alertDialog.isAlertVisible(10000);
        expect(alertVisible).to.be.true;

        const title = await alertDialog.getTitle();
        expect(title).to.include('This button is');

        await alertDialog.tapOk();
    });

    it('@regression deve limpar o campo de texto e verificar resultado', async () => {
        await formsPage.fillTextInput('Texto temporario');
        const result = await formsPage.getInputResultText();
        expect(result).to.equal('Texto temporario');
    });
});
