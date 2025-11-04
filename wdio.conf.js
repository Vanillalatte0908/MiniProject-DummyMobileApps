    import { join } from 'path';
    import allure from '@wdio/allure-reporter';
    import { execSync } from 'node:child_process';

    export const config = {
        runner: 'local',
        // Make sure these are correct
        hostname: 'localhost',   // or the IP of the machine running Appium
        port: 4723,              // default Appium port
        path: '/',

        specs: [
            './test/specs/**/*.js'
        ],
        maxInstances: 1,
        capabilities: [{
        platformName: "Android",
        'appium:platformVersion': "11.0",
        'appium:deviceName': "adb-YHQOWWQKQWP7R45H-CmoAKB._adb-tls-connect._tcp",
        'appium:automationName': "UiAutomator2",
        'appium:appPackage': "com.saucelabs.mydemoapp.rn",
        'appium:appActivity': "com.saucelabs.mydemoapp.rn/.MainActivity",
        'appium:noReset': true
    }], 
        logLevel: 'info',
        framework: 'mocha',
        reporters: ['spec'],
        mochaOpts: {
            ui: 'bdd',
            timeout: 60000
        },

        reporters: [
            ['allure', {
                outputDir: './allure-results',
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
            }]
        ],

        onComplete: function(exitCode, config, capabilities, results) {
            try {
                execSync('allure generate ./allure-results --clean -o ./allure-report', { stdio: 'inherit' });
                console.log('Allure report successfully generated!');
            } catch (err) {
                console.error('Error generating Allure report', err);
            }
        },
        
        afterTest: async function(test, context, { error, passed }) {
            if (!passed) {
                // Capture screenshot on failure
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const filepath = `./screenshots/${test.title}-${timestamp}.png`;
                await browser.saveScreenshot(filepath);
                
                // Attach screenshot to Allure report
                allure.addAttachment('Screenshot', await browser.takeScreenshot(), 'image/png');
            }
        }
    }
