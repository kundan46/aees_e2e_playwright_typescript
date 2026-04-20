import { test, expect } from '@playwright/test';

test('DOB Filling Approaches', async ({ page }) => {
    await page.goto('https://aees.onlineregistrationforms.com/#/home');
    
    // Login first
    await page.getByRole('button', { name: ' Login' }).click();
    await page.getByRole('textbox', { name: 'Email/Phone Number/' }).fill('bug83@gmail.com');
    await page.getByRole('textbox', { name: 'Password*' }).fill('Abcd@1234');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    
    await page.getByRole('button', { name: 'View Application' }).first().click();
    
    // Navigate to Step 4 (Personal Details)
    // Assuming Step 3 is already done or can be skipped/saved
    if (await page.getByRole('button', { name: 'Save & Continue' }).isVisible()) {
        await page.getByRole('button', { name: 'Save & Continue' }).click();
    }

    const dobInput = page.getByPlaceholder('date of birth');

    // --- APPROACH 1: Direct JS Evaluation (Robust) ---
    console.log('Testing Approach 1: JS Evaluation');
    await dobInput.evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '01-01-2000';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(2000);

    // --- APPROACH 2: Sequential Pressing (Human-like) ---
    console.log('Testing Approach 2: Sequential Pressing');
    await dobInput.evaluate((el: HTMLInputElement) => el.value = ''); // Clear
    await dobInput.evaluate((el: HTMLInputElement) => el.removeAttribute('readonly'));
    await dobInput.focus();
    await dobInput.pressSequentially('02-02-2001', { delay: 100 });
    await page.waitForTimeout(2000);

    // --- APPROACH 3: Calendar Interaction (Visual) ---
    console.log('Testing Approach 3: Calendar Interaction');
    await page.locator('.input-group-append').filter({ has: page.locator('.fa-calendar') }).click();
    // Select a date (example: today or a specific day in the open picker)
    await page.locator('.owl-dt-calendar-cell-content').filter({ hasText: '15' }).first().click();
    
    console.log('Finished testing approaches');
});
