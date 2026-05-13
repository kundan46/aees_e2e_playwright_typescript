import { test } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';

// Test Data for Hybrid Model
const registrationData = [
    {
        emailPrefix: 'testuser',
        password: 'Abcd@1234',
        mobilePrefix: '972164',
        description: 'New User Registration with Dynamic Suffix'
    }
];

for (const data of registrationData) {
    test(`Hybrid POM: ${data.description}`, async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        
        // Data Preparation
        const timestamp = Date.now();
        const uniqueSuffix = timestamp.toString().slice(-4);
        const testUser = {
            email: `${data.emailPrefix}_${uniqueSuffix}@gmail.com`,
            password: data.password,
            mobile: `${data.mobilePrefix}${timestamp.toString().slice(-4)}`
        };

        console.log(`>>> Starting test: ${data.description}`);
        console.log(`>>> Using credentials: ${testUser.email} / ${testUser.mobile}`);

        // Step 1: Navigate
        await test.step('Navigate to Registration Page', async () => {
            await registrationPage.navigate();
        });

        // Step 2: Fill Form
        await test.step('Fill Registration Details', async () => {
            await registrationPage.fillRegistrationForm(testUser);
        });

        // Step 3: Submit
        await test.step('Submit Registration', async () => {
            await registrationPage.clickRegister();
        });

        // Step 4: Handle Result (Includes Scroll-to-top and Screenshot)
        await test.step('Validate Registration Result', async () => {
            await registrationPage.handleResult();
        });
    });
}