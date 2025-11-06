import allure from '@wdio/allure-reporter';

describe('Add Chart', () => {
it('should add chart successfully', async () => {   
    allure.startStep('Verify home screen is displayed');
    const homeScreenElement = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]'); 
    await homeScreenElement.waitForDisplayed({ timeout: 5000 });
    const isDisplayed = await homeScreenElement.isDisplayed();
    expect(isDisplayed).toBe(true);
    await browser.saveScreenshot('./screenshots/homeScreen.png');
    allure.endStep();
    expect(isDisplayed).toBe(true);
    });

    it('should click backpack chart', async () => {
        allure.startStep('click add to chart button');
        const item = await $('//android.widget.TextView[@content-desc="store item text" and @text="Sauce Labs Backpack"]');
        await item.click();
        allure.endStep();

        allure.startStep('click add to chart button');
        const addToChartButton = await $('//android.view.ViewGroup[@content-desc="Add To Cart button"]');
        await addToChartButton.click();
        await browser.saveScreenshot('./screenshots/addtochart.png');
        allure.endStep();  

        allure.startStep('verify click badge chart');
        const badgeChart = await $('//android.view.ViewGroup[@content-desc="cart badge"]');
        await badgeChart.click();
        await browser.saveScreenshot('./screenshots/badgechart.png');
        allure.endStep();   
         
    });
});
