import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string) {
        await this.page.goto(url);

    }

    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }

    async click(locator: Locator) {
        await locator.click();
    }

    async type(locator: Locator, text: string) {
        await locator.fill(text);
    }

    async getScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
}
