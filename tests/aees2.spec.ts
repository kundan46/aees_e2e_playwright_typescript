import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('CSIRSO Online Registration Form Tests', () => {
    let homePage: HomePage;
    let registrationPage: RegistrationPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        registrationPage = new RegistrationPage(page);
        await homePage.navigateTo('https://csirso.onlineregistrationforms.com/#/home');
    });

    test('Test Case: Registration Workflow', async ({ page }) => {
        await HomePage.clickRegister();

        const testData = {
            email: `bug85@gmail.com`,
            password: 'Abcd@1234',
            mobile: '7479886350'
        };

        await RegistrationPage.register(testData);
        // Additional assertions based on successful submission
    });
});