import { test, expect } from '@playwright/test';
import path from 'path';

test('AEES Full E2E Application Submission', async ({ page }) => {
    test.setTimeout(120000);
    // 1. Initial Navigation & Header Login
    await page.goto('https://csirso.onlineregistrationforms.com/#/home');
    
    // Generate unique email and mobile to avoid "already taken" errors
    const timestamp = Date.now();
    const uniqueSuffix = timestamp.toString().slice(-4);
    var Email = `testuser_${timestamp}@gmail.com`;
    var Password = "Abcd@1234";
    var mobile = `859297${uniqueSuffix}`; // Generates a unique 10-digit-like number

    console.log(`>>> Using dynamic Email: ${Email}`);
    console.log(`>>> Using dynamic Mobile: ${mobile}`);

    // 2. Navigate to Registration page
    await page.locator('button:has-text("New Candidate Registration")').click();
    await page.locator('input.form-control.ng-untouched.ng-pristine.ng-invalid').fill(Email);
    await page.locator('[name="confirmEmail"]').fill(Email);
    await page.locator("//div[4]//div[1]//input[1]").fill(Password);
    await page.locator("//div[4]//div[2]//input[1]").fill(Password);
    await page.getByRole('textbox', { name: 'Mobile Number*' }).fill(mobile);
    await page.locator("//div[7]//div[2]//input[1]").fill(mobile);

    await test.step('Submit Registration Form', async () => {
        console.log("Submitting registration form...");
        await page.locator('button:has-text("Register")').click();
    });

    await test.step('Handle Registration Result', async () => {
        // Broaden locators: 
        // 1. Standard error classes
        // 2. Elements with red color
        // 3. Any paragraph/span containing keywords like "already", "registered", "invalid", "error"
        const errorLocator = page.locator('.text-danger, .alert-danger, .error-message, .invalid-feedback, .toast-error, [style*="color: red"], [style*="color:red"]')
            .or(page.locator('p, span, div').filter({ hasText: /already|registered|invalid|error/i }));

        const successLocator = page.locator('.alert-success, .text-success, .success-message, .toast-success, .alert-info, button:has-text("Start New Application")');

        // Wait for results
        console.log("Waiting for registration result...");
        
        const result = await Promise.race([
            errorLocator.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => 'error'),
            successLocator.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => 'success'),
            page.waitForURL(/.*dashboard|.*activity|.*otp|.*candidate/, { timeout: 15000 }).then(() => 'redirect')
        ]).catch(() => 'timeout');

        if (result === 'error') {
            const errorTexts = await errorLocator.allTextContents();
            const combinedError = errorTexts.map(t => t.trim()).filter(t => t).join(" | ");
            console.error(">>> REGISTRATION FAILED (Captured Message): " + combinedError);
            await page.screenshot({ path: `registration_failed_${Date.now()}.png`, fullPage: true });
            throw new Error(`Registration failed with error: ${combinedError}`);
        } 

        if (result === 'success' || result === 'redirect') {
            const currentUrl = page.url();
            let successDetail = `Successful (URL: ${currentUrl})`;
            
            if (await successLocator.first().isVisible()) {
                successDetail = await successLocator.first().innerText();
            }
            
            console.log(">>> REGISTRATION SUCCESSFUL: " + successDetail);
            await page.screenshot({ path: `registration_success_${Date.now()}.png` });
            
            // Final assertion to pass the test
            expect(result).not.toBe('timeout');
        } else {
            // Timeout or unknown state
            const currentUrl = page.url();
            console.error(`>>> UNKNOWN STATUS: No clear feedback at URL ${currentUrl}`);
            await page.screenshot({ path: `registration_unknown_${Date.now()}.png`, fullPage: true });
            throw new Error(`Registration status unknown or timed out at URL: ${currentUrl}`);
        }
    });
});