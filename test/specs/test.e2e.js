import fs from 'fs';
beforeEach(() => {
    driver.launchApp()

})

afterEach(async () => {

    driver.closeApp()
})
describe('test', () => {

    it('should open app', async () => {
        driver.pause(2000);
        const title = $('//android.widget.TextView[@text="OK"]');
        // take screenshot and save to file
        // take screenshot and save to file
        browser.pause(20000);
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('./screenshot.png', screenshot, 'base64');

        // add screenshot of app and save to file
        // const screenshot = await browser.takeScreenshot();

        expect(title).toHaveText('OK');
    });
});
