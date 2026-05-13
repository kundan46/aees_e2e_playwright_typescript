import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
    readonly emailInput: Locator;
    readonly confirmEmailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly mobileInput: Locator;
    readonly confirmMobileInput: Locator;
    readonly registerButton: Locator;
    readonly errorLocator: Locator;
    readonly successLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('input.form-control.ng-untouched.ng-pristine.ng-invalid').first().or(page.locator('[name="email"]'));
        this.confirmEmailInput = page.locator('[name="confirmEmail"]');
        this.passwordInput = page.locator("//div[4]//div[1]//input[1]");
        this.confirmPasswordInput = page.locator("//div[4]//div[2]//input[1]");
        this.mobileInput = page.getByRole('textbox', { name: 'Mobile Number*' });
        this.confirmMobileInput = page.locator("//div[7]//div[2]//input[1]");
        this.registerButton = page.locator('button:has-text("Register")');
        
        // Validation Locators
        this.errorLocator = page.locator('.text-danger, .alert-danger, .error-message, .invalid-feedback, .toast-error, [style*="color: red"], [style*="color:red"]')
            .or(page.locator('p, span, div').filter({ hasText: /already|registered|invalid|error|required/i }));
        
        this.successLocator = page.locator('.alert-success, .text-success, .success-message, .toast-success, .alert-info, button:has-text("Start New Application")');
    }

    async navigate() {
        await this.page.goto('https://csirso.onlineregistrationforms.com/#/home');
        await this.page.locator('button:has-text("New Candidate Registration")').click();
    }

    async fillRegistrationForm(data: { email: string; password: string; mobile: string }) {
        await this.emailInput.fill(data.email);
        await this.confirmEmailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.confirmPasswordInput.fill(data.password);
        await this.mobileInput.fill(data.mobile);
        await this.confirmMobileInput.fill(data.mobile);
    }

    async clickRegister() {
        console.log("Submitting registration form...");
        await this.registerButton.click();
    }

    async handleResult() {
        console.log("Waiting for registration result...");

        const result = await Promise.race([
            this.errorLocator.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => 'error'),
            this.successLocator.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => 'success'),
            this.page.waitForURL(/.*dashboard|.*activity|.*otp|.*candidate/, { timeout: 15000 }).then(() => 'redirect')
        ]).catch(() => 'timeout');

        if (result === 'error') {
            console.log(">>> Error detected. Scrolling to top to capture validation message...");
            await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
            await this.page.waitForTimeout(1000);

            const errorTexts = await this.errorLocator.allTextContents();
            const combinedError = [...new Set(errorTexts.map(t => t.trim()).filter(t => t))].join(" | ");
            
            console.error(">>> REGISTRATION FAILED: " + combinedError);
            const screenshotPath = `registration_validation_error_${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            
            throw new Error(`Registration failed with validation error: ${combinedError}`);
        }

        if (result === 'success' || result === 'redirect') {
            const currentUrl = this.page.url();
            console.log(">>> REGISTRATION SUCCESSFUL: Redirected to " + currentUrl);
            await this.page.screenshot({ path: `registration_success_${Date.now()}.png`, fullPage: true });
            return true;
        } else {
            console.error(">>> UNKNOWN STATUS: No clear feedback found.");
            await this.page.screenshot({ path: `registration_unknown_${Date.now()}.png`, fullPage: true });
            throw new Error("Registration status unknown or timed out.");
        }
    }
}
