const { expect } = require('chai');
const bottomNav = require('../pages/components/BottomNav');
const homePage = require('../pages/HomePage');
const loginPage = require('../pages/LoginPage');
const formsPage = require('../pages/FormsPage');
const swipePage = require('../pages/SwipePage');
const dragPage = require('../pages/DragPage');

describe('Navegação - Tab Bar entre telas', () => {

    // CENÁRIO 7
    it('@smoke deve exibir a Home Screen ao iniciar o aplicativo', async () => {
        const isDisplayed = await homePage.isScreenDisplayed();
        expect(isDisplayed).to.be.true;
    });

    // CENÁRIO 8
    it('@smoke deve navegar entre todas as abas e verificar cada tela', async () => {
        const tabs = [
            { name: 'login', page: loginPage },
            { name: 'forms', page: formsPage },
            { name: 'swipe', page: swipePage },
            { name: 'drag',  page: dragPage },
            { name: 'home',  page: homePage },
        ];

        for (const tab of tabs) {
            await bottomNav.navigateTo(tab.name);
            const isVisible = await tab.page.isScreenDisplayed();
            expect(isVisible, `Tela ${tab.name} deveria estar visível`).to.be.true;
        }
    });

    it('@regression deve manter o estado da aba Login após navegar para Forms e voltar', async () => {
        await bottomNav.navigateTo('login');
        await loginPage.waitForScreenLoaded();

        await bottomNav.navigateTo('forms');
        await formsPage.waitForScreenLoaded();

        await bottomNav.navigateTo('login');
        const isDisplayed = await loginPage.isLoginButtonDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('@regression deve verificar que a tab bar está presente em todas as telas', async () => {
        const tabNames = ['login', 'forms', 'swipe', 'drag', 'home'];

        for (const tab of tabNames) {
            await bottomNav.navigateTo(tab);
            const homeTabVisible = await bottomNav.isTabVisible('Home');
            expect(homeTabVisible, `Tab bar ausente na tela ${tab}`).to.be.true;
        }
    });
});
