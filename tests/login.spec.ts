import { test, expect } from '@playwright/test';

test('AEES Login Only', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Navigate to home
    await page.goto('https://aees.onlineregistrationforms.com/#/home');

    // 2. Click Login button
    await page.getByRole('button', { name: ' Login' }).click();

    // 3. Fill credentials
    await page.getByRole('textbox', { name: 'Email/Phone Number/' }).fill('bug83@gmail.com');
    await page.getByRole('textbox', { name: 'Password*' }).fill('Abcd@1234');

    // 4. Submit login
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // 5. Verify successful login by checking for dashboard elements
    await expect(page).toHaveURL(/.*dashboard|.*activity/);
    console.log('Login successful');
});
