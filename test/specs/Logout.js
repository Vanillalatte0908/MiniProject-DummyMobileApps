import allure from '@wdio/allure-reporter';

describe('Login Apps', () => {
    it('should open the app and verify the login screen', async () => {
        allure.startStep('Verify login screen is displayed');
        const loginScreenElement = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]'); 
        await loginScreenElement.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await loginScreenElement.isDisplayed();
        expect(isDisplayed).toBe(true);
        await browser.saveScreenshot('./screenshots/loginScreen.png');
        allure.endStep();
        expect(isDisplayed).toBe(true);

        
    });

    it('should allow the user to log in with valid credentials', async () => {
        // Open menu
        allure.startStep('Open menu');
        const menuButton = await $('//android.view.ViewGroup[@content-desc="open menu"]');
        await menuButton.click();
        await browser.saveScreenshot('./screenshots/logut.png');
        allure.endStep();

        // Select Logout
        allure.startStep('Select Logout menu item');
        const Logout = await $('//android.view.ViewGroup[@content-desc="menu item log out"]');
        await Logout.click();
        await browser.saveScreenshot('./screenshots/logout2.png');

        const Logout2 = await $('//android.widget.Button[@resource-id="android:id/button1"]');
        await Logout2.click();

        const Ok = await $('//android.widget.Button[@resource-id="android:id/button1"]');
        await Ok.click();
        allure.endStep();
        });
});