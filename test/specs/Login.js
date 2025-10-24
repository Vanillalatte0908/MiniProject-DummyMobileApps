import allure from '@wdio/allure-reporter';

describe('Login Apps', () => {

    it('should open the app and show login screen', async () => {
        allure.startStep('Verify login screen is displayed');
        const loginScreenElement = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]');
        await loginScreenElement.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await loginScreenElement.isDisplayed();
        allure.endStep();
        expect(isDisplayed).toBe(true);
    });

    it('should login with valid credentials', async () => {
        allure.startStep('Open menu');
        const menuButton = await $('//android.view.ViewGroup[@content-desc="open menu"]');
        await menuButton.click();
        allure.endStep();

        allure.startStep('Select login menu item');
        const loginMenu = await $('//android.view.ViewGroup[@content-desc="menu item log in"]');
        await loginMenu.click();
        allure.endStep();

        allure.startStep('Enter username');
        const usernameField = await $('//android.widget.EditText[@content-desc="Username input field"]');
        await usernameField.setValue('bob@example.com');
        allure.endStep();

        allure.startStep('Enter password');
        const passwordField = await $('//android.widget.EditText[@content-desc="Password input field"]');
        await passwordField.setValue('10203040');
        allure.endStep();

        allure.startStep('Click login button');
        const loginButton = await $('//android.view.ViewGroup[@content-desc="Login button"]');
        await loginButton.click();
        allure.endStep();

        allure.startStep('Verify home screen after login');
        const homeScreen = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]');
        await homeScreen.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await homeScreen.isDisplayed();
        allure.endStep();
    });
});
