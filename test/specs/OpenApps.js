describe('Open Apps', () => {
    it('should open the app and verify the home screen', async () => {
        // Replace with actual accessibility ID, resource ID, or XPath
        const homeScreenElement = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]'); 
        await homeScreenElement.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await homeScreenElement.isDisplayed();
        expect(isDisplayed).toBe(true);
    });
});
