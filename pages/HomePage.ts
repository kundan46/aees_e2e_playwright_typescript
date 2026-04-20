import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly loginButton: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        super(page);
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.registerButton = page.getByRole('button', { name: 'New Candidate Registration' });
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async clickRegister() {
        await this.registerButton.click();
    }
}
