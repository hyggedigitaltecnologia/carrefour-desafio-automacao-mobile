const BasePage = require('./BasePage');

class HomePage extends BasePage {
    constructor() {
        super('~Home-screen');
    }

    get logo() { return $('~Home-screen'); }

    async isLogoDisplayed() {
        return this.isVisible('~Home-screen');
    }
}

module.exports = new HomePage();
