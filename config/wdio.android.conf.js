const { join } = require('path');
const { config } = require('./wdio.shared.conf');

// Corrige ANDROID_HOME ANTES de qualquer coisa — o Appium service herda env do processo pai
process.env.ANDROID_HOME = 'C:\\Android';

exports.config = {
    ...config,

    port: 4723,

    services: [
        ['appium', {
            command: 'appium',
            args: {
                relaxedSecurity: true,
                log: './appium.log',
            },
        }],
    ],

    capabilities: [{
        'appium:platformName': 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.DEVICE_NAME || 'Pixel_7_API_34',
        'appium:app': join(process.cwd(), 'apps', 'android.wdio.native.app.v2.2.0.apk'),
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 300,
        'appium:chromedriverAutodownload': true,
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:androidInstallTimeout': 120000,
    }],
};
