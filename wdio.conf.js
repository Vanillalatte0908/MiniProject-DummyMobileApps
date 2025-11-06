import { join } from 'path';
import { execSync } from 'node:child_process';

export const config = {
    runner: 'local',
    hostname: 'localhost',
    port: 4723,
    path: '/',

    specs: ['./test/specs/**/*.js'],
    maxInstances: 1,

    capabilities: [{
        platformName: "Android",
        'appium:platformVersion': "11.0",
        'appium:deviceName': "adb-YHQOWWQKQWP7R45H-CmoAKB._adb-tls-connect._tcp",
        'appium:automationName': "UiAutomator2",
        'appium:appPackage': "com.saucelabs.mydemoapp.rn",
        'appium:appActivity': "com.saucelabs.mydemoapp.rn.MainActivity", // ✅ fixed
        'appium:noReset': true
    }],

    logLevel: 'info',
    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    // ✅ Capture screenshot + attach to Allure
    afterTest: async function (test, context, { error, passed }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const filepath = `./screenshots/${test.title}-${timestamp}.png`;

            await browser.saveScreenshot(filepath);

            // Dynamic import of allure reporter
            const allure = await import('@wdio/allure-reporter').then(m => m.default);
            allure.addAttachment('Screenshot', await browser.takeScreenshot(), 'image/png');
        }
    },

    // Optional: only keep this if you run WDIO directly (not via Express)
    onComplete: function (exitCode, config, capabilities, results) {
        try {
            execSync('npx allure generate ./allure-results --clean -o ./allure-report', { stdio: 'inherit' });
            console.log('✅ Allure report successfully generated!');
        } catch (err) {
            console.error('❌ Error generating Allure report', err);
        }
    }
};
