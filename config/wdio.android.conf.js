const { join } = require('path');
const { config } = require('./wdio.shared.conf');

// Corrige ANDROID_HOME apenas se não estiver definido corretamente (ex: Windows local)
// No CI (Linux), ANDROID_HOME e ANDROID_SDK_ROOT já vêm corretos do runner
if (!process.env.ANDROID_HOME || !require('fs').existsSync(process.env.ANDROID_HOME)) {
    const candidates = [
        process.env.ANDROID_SDK_ROOT,
        process.env.ANDROID_HOME,
        'C:\\Android',
        `${process.env.HOME}/Android/Sdk`,
        '/usr/local/lib/android/sdk',
    ].filter(Boolean);
    for (const candidate of candidates) {
        if (require('fs').existsSync(candidate)) {
            process.env.ANDROID_HOME = candidate;
            break;
        }
    }
}

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
