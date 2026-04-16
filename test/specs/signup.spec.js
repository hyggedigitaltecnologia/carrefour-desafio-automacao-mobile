const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const alertDialog = require('../pages/components/AlertDialog');
const signUpPage = require('../pages/SignUpPage');
const DataLoader = require('../helpers/DataLoader');

describe('Cadastro - Registro de novo usuário', () => {
    const formData = DataLoader.loadJSON('formData.json');
    const validSignUps = formData.signup.validos;

    beforeEach(async () => {
        await alertDialog.dismissIfPresent();
        await bottomNav.navigateTo('login');
        await signUpPage.waitForScreenLoaded();
        await signUpPage.openSignUpTab();
    });

    afterEach(async () => {
        await alertDialog.dismissIfPresent();
    });

    // CENÁRIO 5
    it('@smoke deve cadastrar usuário com dados válidos e exibir alerta de sucesso', async () => {
        const data = validSignUps[0];
        await signUpPage.performSignUp(data.email, data.password);

        await alertDialog.waitForAlert(15000);
        const title = await alertDialog.getTitle();
        expect(title).to.equal('Signed Up!');
    });

    // CENÁRIO 6a — senhas diferentes
    it('@regression deve impedir cadastro quando senhas não coincidem', async () => {
        await signUpPage.fillEmail('novo@test.com');
        await signUpPage.fillPassword('Forte@123');
        await signUpPage.fillConfirmPassword('Diferente@456');
        await signUpPage.submitSignUp();

        // Não deve exibir alerta de sucesso (Signed Up!)
        const alertVisible = await alertDialog.isAlertVisible(3000);
        expect(alertVisible).to.be.false;
    });

    // CENÁRIO 6b — email inválido
    it('@regression deve impedir cadastro com email em formato inválido', async () => {
        await signUpPage.fillEmail('invalido');
        await signUpPage.fillPassword('Forte@123');
        await signUpPage.fillConfirmPassword('Forte@123');
        await signUpPage.submitSignUp();

        const alertVisible = await alertDialog.isAlertVisible(3000);
        expect(alertVisible).to.be.false;
    });

    // CENÁRIO 6c — senha curta
    it('@regression deve impedir cadastro com senha muito curta', async () => {
        await signUpPage.fillEmail('novo@test.com');
        await signUpPage.fillPassword('abc');
        await signUpPage.fillConfirmPassword('abc');
        await signUpPage.submitSignUp();

        const alertVisible = await alertDialog.isAlertVisible(3000);
        expect(alertVisible).to.be.false;
    });
});
