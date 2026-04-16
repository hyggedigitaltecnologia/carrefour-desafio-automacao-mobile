const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const alertDialog = require('../pages/components/AlertDialog');
const homePage = require('../pages/HomePage');
const loginPage = require('../pages/LoginPage');
const formsPage = require('../pages/FormsPage');
const swipePage = require('../pages/SwipePage');

describe('E2E - Jornada completa do usuário', () => {

    afterEach(async () => {
        await alertDialog.dismissIfPresent();
    });

    it('@e2e deve completar jornada: Home → Login → Forms → Swipe → Home', async () => {
        // 1. Verifica Home
        const homeVisible = await homePage.isScreenDisplayed();
        expect(homeVisible).to.be.true;

        // 2. Realiza login com sucesso
        await bottomNav.navigateTo('login');
        await loginPage.waitForScreenLoaded();
        await loginPage.openLoginTab();
        await loginPage.performLogin('qa.tester@webdriver.io', 'Senha@1234');

        await alertDialog.waitForAlert(15000);
        const alertTitle = await alertDialog.getTitle();
        expect(alertTitle).to.equal('Success');
        await alertDialog.tapOk();

        // 3. Preenche formulário
        await bottomNav.navigateTo('forms');
        await formsPage.waitForScreenLoaded();
        await formsPage.fillTextInput('Teste E2E completo');
        const formResult = await formsPage.getInputResultText();
        expect(formResult).to.equal('Teste E2E completo');

        // 4. Faz swipe no carrossel
        await bottomNav.navigateTo('swipe');
        await swipePage.waitForScreenLoaded();
        const snapshotBefore = await swipePage.getCarouselSnapshot();
        await swipePage.swipeCarouselLeft();
        await driver.waitUntil(async () => {
            const snapshotAfter = await swipePage.getCarouselSnapshot();
            return snapshotAfter !== snapshotBefore;
        }, { timeout: 15000, interval: 1000 });

        // 5. Retorna à Home
        await bottomNav.navigateTo('home');
        const homeAtEnd = await homePage.isScreenDisplayed();
        expect(homeAtEnd).to.be.true;
    });

    it('@e2e deve suportar navegação rápida entre abas sem perda de estabilidade', async () => {
        const tabs = ['login', 'forms', 'swipe', 'drag', 'home'];

        for (let round = 0; round < 2; round++) {
            for (const tab of tabs) {
                await bottomNav.navigateTo(tab);
                // Aguarda brevemente a tela carregar
                await driver.waitUntil(async () => {
                    return (await $('~Home').isDisplayed().catch(() => false));
                }, { timeout: 5000, interval: 300 }).catch(() => {});
            }
        }

        // Após 2 rodadas completas, verifica que a Home está visível
        await bottomNav.navigateTo('home');
        const homeDisplayed = await homePage.isScreenDisplayed();
        expect(homeDisplayed).to.be.true;
    });
});
