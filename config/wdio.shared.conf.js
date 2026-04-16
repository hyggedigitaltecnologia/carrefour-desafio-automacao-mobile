const { join } = require('path');
const allure = require('@wdio/allure-reporter').default;

module.exports.config = {
    runner: 'local',
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },

    specs: [join(process.cwd(), 'test', 'specs', '**', '*.spec.js')],

    maxInstances: 1,
    logLevel: 'warn',

    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 3,

    reporters: [
        'spec',
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: false,
            reportedEnvironmentVars: {
                Platform: 'Android',
                Framework: 'WebDriverIO v9',
                Runner: 'Appium UiAutomator2',
            },
        }],
    ],

    async afterTest(test, _context, { error, passed }) {
        if (!passed || error) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${test.title.replace(/\s+/g, '_')}_${timestamp}`;

            try {
                const screenshot = await driver.takeScreenshot();
                const filepath = join(process.cwd(), 'screenshots', `${filename}.png`);
                require('fs').writeFileSync(filepath, screenshot, 'base64');

                allure.addAttachment(
                    `Falha: ${test.title}`,
                    Buffer.from(screenshot, 'base64'),
                    'image/png'
                );
            } catch (screenshotErr) {
                console.error('Erro ao capturar screenshot:', screenshotErr.message);
            }
        }
    },

    onComplete() {
        console.log('\n========================================');
        console.log('  Execução dos testes finalizada!');
        console.log('  Execute: npm run report');
        console.log('========================================\n');
    },
};
