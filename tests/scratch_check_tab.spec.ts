import { test, expect } from '@playwright/test';

test('Check tab behavior', async ({ page }) => {
    await page.goto('https://aees.onlineregistrationforms.com/#/home');
    await page.getByRole('button', { name: ' Login' }).click();
    await page.getByRole('textbox', { name: 'Email/Phone Number/' }).fill('bug83@gmail.com');
    await page.getByRole('textbox', { name: 'Password*' }).fill('Abcd@1234');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    
    await expect(page.getByRole('button', { name: 'View Application' }).first()).toBeVisible();
    
    const pageCountBefore = page.context().pages().length;
    await page.getByRole('button', { name: 'View Application' }).first().click();
    await page.waitForTimeout(5000);
    const pageCountAfter = page.context().pages().length;
    
    console.log(`Pages before: ${pageCountBefore}, Pages after: ${pageCountAfter}`);
});
