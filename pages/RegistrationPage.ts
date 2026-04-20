import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
    readonly emailInput: Locator;
    readonly confirmEmailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly mobileInput: Locator;
    readonly confirmMobileInput: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        super(page);
        // Based on UI Scan: form-control classes are used for most inputs
        this.emailInput = page.locator('.form-control').nth(0);
        this.confirmEmailInput = page.locator('.form-control').nth(1);
        this.passwordInput = page.locator('.form-control').nth(2);
        this.confirmPasswordInput = page.locator('.form-control').nth(3);
        this.mobileInput = page.locator('#mobile');
        this.confirmMobileInput = page.locator('.form-control').nth(5);
        this.registerButton = page.getByRole('button', { name: 'Register' });
    }

    async register(data: any) {
        await this.emailInput.fill(data.email);
        await this.confirmEmailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.confirmPasswordInput.fill(data.password);
        await this.mobileInput.fill(data.mobile);
        await this.confirmMobileInput.fill(data.mobile);
        await this.registerButton.click();
    }
}
