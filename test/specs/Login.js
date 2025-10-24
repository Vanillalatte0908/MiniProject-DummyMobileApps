describe('Login Apps', () => {
    it('should open the app and verify the login screen', async () => {
        const loginScreenElement = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]'); 
        await loginScreenElement.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await loginScreenElement.isDisplayed();
        expect(isDisplayed).toBe(true);
    });

    it('should allow the user to log in with valid credentials', async () => {
        // Open menu
        const menuButton = await $('//android.view.ViewGroup[@content-desc="open menu"]');
        await menuButton.click();

        // Select Login
        const loginMenu = await $('//android.view.ViewGroup[@content-desc="menu item log in"]');
        await loginMenu.click();

        // Fill username
        const usernameField = await $('//android.widget.EditText[@content-desc="Username input field"]');
        await usernameField.setValue('bob@example.com');

        // Fill password
        const passwordField = await $('//android.widget.EditText[@content-desc="Password input field"]');
        await passwordField.setValue('10203040');

        // Tap login
        const loginButton = await $('//android.view.ViewGroup[@content-desc="Login button"]');
        await loginButton.click();

        // Verify home screen
        const homeScreen = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]');
        await homeScreen.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await homeScreen.isDisplayed();
        expect(isDisplayed).toBe(true);
    });
});
