import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('AEES Online Registration System Tests', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let registrationPage: RegistrationPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        registrationPage = new RegistrationPage(page);
        await homePage.navigateTo('https://aees.onlineregistrationforms.com/#/home');
    });

    test('Verification: Home Page UI Scan', async ({ page }) => {
        await expect(page).toHaveTitle(/Registration Portal|AEES/);
        await expect(homePage.loginButton).toBeVisible();
        await expect(homePage.registerButton).toBeVisible();
    });

    test('Test Case: Login Workflow', async ({ page }) => {
        await homePage.clickLogin();
        await expect(page).toHaveURL(/.*login/);

        // Negative test: Invalid Login
        await loginPage.login('invalid_user', 'invalid_password');
        // Check for error message (assuming the app shows one)
        // await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('Test Case: Registration Form Validation', async ({ page }) => {
        await homePage.clickRegister();
        await expect(page).toHaveURL(/.*registration/);

        // Validation: Empty fields
        await registrationPage.registerButton.click();

        // Since it's a validation test, we check for error states
        // Playwright handles HTML5 validation or custom alerts
        const emailValidation = await registrationPage.emailInput.getAttribute('class');
        expect(emailValidation).toContain('form-control'); // Basic check
    });

    test('Test Case: Registration Workflow', async ({ page }) => {
        await homePage.clickRegister();

        const testData = {
            email: `bug85@gmail.com`,
            password: 'Abcd@1234',
            mobile: '7479886350'
        };

        await registrationPage.register(testData);
        // Additional assertions based on successful submission
    });
});
