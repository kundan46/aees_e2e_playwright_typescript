import { test, expect } from '@playwright/test';

test('AEES Login Only', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Navigate to home
    await page.goto('https://aees.onlineregistrationforms.com/#/home');

    // 2. Click Login button
    await page.getByRole('button', { name: ' Login' }).click();

    // 3. Fill credentials
    const email = 'bug87@gmail.com';
    const password = 'Abcd@1234'; // Restored correct password
    
    await page.getByRole('textbox', { name: 'Email/Phone Number/' }).fill(email);
    await page.getByRole('textbox', { name: 'Password*' }).fill(password);

    // 4. Submit login
    console.log(`Attempting login with: ${email}`);
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // 5. Handle Login Result
    await test.step('Handle Login Result', async () => {
        // Define locators for error and success indicators
        const errorLocator = page.locator(".text-danger, .alert-danger, .error-message, .invalid-feedback").first();
        
        // Wait for either URL change (success) or error visibility (failure)
        const result = await Promise.race([
            page.waitForURL(/.*dashboard|.*activity/, { timeout: 15000 }).then(() => 'success'),
            errorLocator.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'error'),
        ]).catch(() => 'timeout');

        if (result === 'error') {
            console.log(">>> Login Failed detected. Scrolling to top to capture details...");
            
            // User requested: capture error through scroll on top of page
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
            await page.waitForTimeout(1500);

            // Capture all visible error messages from the entire page
            const errorTexts = await page.$$eval(".text-danger, .alert-danger, .error-message, .invalid-feedback", 
                elements => elements
                    .map(el => el.textContent?.trim())
                    .filter(text => text && text.length > 0)
            );
            
            const combinedError = [...new Set(errorTexts)].join(" | ");
            console.error(">>> Login Failed. Captured Errors: " + combinedError);
            
            const screenshotPath = `login_error_${Date.now()}.png`;
            await page.screenshot({ path: screenshotPath });
            console.log(`>>> Error screenshot (at top): ${screenshotPath}`);

            throw new Error(`Login failed with errors: ${combinedError}`);
        } else if (result === 'success') {
            console.log('>>> Login successful!');
            await page.screenshot({ path: `login_success_${Date.now()}.png` });
        } else {
            const currentUrl = page.url();
            console.warn(">>> Login timed out or in unknown state. URL: " + currentUrl);
            await page.screenshot({ path: `login_timeout_${Date.now()}.png` });
            throw new Error(`Login timed out at URL: ${currentUrl}`);
        }
    });
});
