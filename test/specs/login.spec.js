const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const alertDialog = require('../pages/components/AlertDialog');
const loginPage = require('../pages/LoginPage');
const DataLoader = require('../helpers/DataLoader');

describe('Login - Autenticação do usuário', () => {
    const credentials = DataLoader.loadCSV('credentials.csv');
    const validCreds = credentials.filter(c => c.tipo === 'valido');

    beforeEach(async () => {
        await alertDialog.dismissIfPresent();
        await bottomNav.navigateTo('login');
        await loginPage.waitForScreenLoaded();
        await loginPage.openLoginTab();
    });

    afterEach(async () => {
        await alertDialog.dismissIfPresent();
    });

    // CENÁRIO 1
    it('@smoke deve realizar login com credenciais válidas e exibir alerta de sucesso', async () => {
        const cred = validCreds[0];
        await loginPage.performLogin(cred.email, cred.password);

        await alertDialog.waitForAlert(15000);
        const title = await alertDialog.getTitle();
        expect(title).to.equal('Success');
    });

    // CENÁRIO 2
    it('@regression deve validar mensagem e corpo do alerta de sucesso', async () => {
        const cred = validCreds[0];
        await loginPage.performLogin(cred.email, cred.password);

        await alertDialog.waitForAlert(15000);
        const message = await alertDialog.getMessage();
        expect(message).to.include('You are logged in');

        await alertDialog.tapOk();
        const loginVisible = await loginPage.isLoginButtonDisplayed();
        expect(loginVisible).to.be.true;
    });

    // CENÁRIO 3 — email inválido não gera alerta de sucesso
    it('@regression deve impedir login com email em formato inválido', async () => {
        await loginPage.fillEmail('email-invalido');
        await loginPage.fillPassword('Test@1234');
        await loginPage.submitLogin();

        // Não deve exibir alerta de sucesso
        const alertVisible = await alertDialog.isAlertVisible(3000);
        expect(alertVisible).to.be.false;
        // Deve permanecer na tela de login
        const loginVisible = await loginPage.isLoginButtonDisplayed();
        expect(loginVisible).to.be.true;
    });

    // CENÁRIO 4 — senha curta não gera alerta de sucesso
    it('@regression deve impedir login com senha com menos de 8 caracteres', async () => {
        await loginPage.fillEmail('qa.tester@webdriver.io');
        await loginPage.fillPassword('123');
        await loginPage.submitLogin();

        const alertVisible = await alertDialog.isAlertVisible(3000);
        expect(alertVisible).to.be.false;
        const loginVisible = await loginPage.isLoginButtonDisplayed();
        expect(loginVisible).to.be.true;
    });
});
