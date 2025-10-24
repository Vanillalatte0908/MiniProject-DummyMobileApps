import { join } from 'path';

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
    'appium:deviceName': "adb-YHQOWWQKQWP7R45H-CmoAKB",
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
    }

    
};
