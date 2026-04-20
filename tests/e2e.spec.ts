import { test, expect } from '@playwright/test';
import path from 'path';

test('AEES Full E2E Application Submission', async ({ page }) => {
    test.setTimeout(120000);
    // 1. Initial Navigation & Header Login
    await page.goto('https://aees.onlineregistrationforms.com/#/home');
    await page.getByRole('button', { name: ' Login' }).click();

    // 2. Login Logic with Error Handling
    await page.getByRole('textbox', { name: 'Email/Phone Number/' }).fill('bug83@gmail.com');
    await page.getByRole('textbox', { name: 'Password*' }).fill('Abcd@1234');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    // Ensure login was successful
    await expect(page.getByRole('button', { name: 'View Application' }).first()).toBeVisible({ timeout: 12000 });
    await page.getByRole('button', { name: 'View Application' }).first().click();

    // 3. Step 3: Eligibility Information
    console.log('Navigating to Step 3: Eligibility');
    try {
        await page.waitForSelector('input[type="radio"]', { state: 'visible', timeout: 10000 });
        const radioButtons = page.locator('input[type="radio"]');
        if (await radioButtons.count() > 0) {
            await radioButtons.nth(0).check(); // Yes for CTET
            await radioButtons.nth(2).check(); // Yes for English/Hindi
            await radioButtons.nth(4).check(); // Yes for Computer
            await page.getByRole('button', { name: 'Save & Continue' }).click();
        }
    } catch (e) {
        console.log('Eligibility step might be already completed or not present');
    }

    // 4. Step 4: Personal Details
    console.log('Processing Step 4: Personal Details');
    await page.waitForTimeout(10000);

    // Check if we are on Personal Details page (Candidate Details)
    const isStep4 = await page.getByText('Candidate Details').isVisible();
    if (isStep4) {
        // Basic Info
        await page.locator('select.custom-select').nth(0).selectOption('MR'); // Title
        await page.locator("//div[@class='row p-2 text-justify']//div[2]//input[1]").fill('Test');
        await page.locator("//div[@class='col-md-3']//input[@placeholder='Middle Name']").fill('Senior');
        await page.locator("//div[@class='col-md-3']//input[@placeholder='Last Name']").fill('Engineer');
        await page.locator('[name="name_Change"]').selectOption('NO'); // Gazette

        //const dobInput = page.getByPlaceholder('date of birth');
        //await dobInput.fill('01-01-2006');
        //await dobInput.press('Enter');

        const dobInput = page.getByPlaceholder('date of birth');

        await dobInput.evaluate((el) => {
            el.value = '01-01-2006';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });

        await page.locator('select.custom-select').nth(2).selectOption('MALE'); // Gender
        await page.locator('select.custom-select').nth(3).selectOption('UNMARRIED'); // Marital Status
        await page.locator('input[placeholder="aadhar number"]').fill('123456789012');

        await page.locator('select.custom-select').nth(4).selectOption('UNRESERVED (UR)'); // Category
        await page.locator('select.custom-select').nth(5).selectOption('NOT APPLICABLE'); // Other Category
        await page.locator('[name="nationality_declaration"]').check(); // Indian Citizen
        await page.locator('select.custom-select').nth(6).selectOption('NO'); // PwBD

        //await page.locator('select[formcontrolname="religion"]').selectOption('Hindu');
        //await page.locator('select[formcontrolname="domicileState"]').selectOption('Andhra Pradesh');
        await page.locator('select[name="title2"]').selectOption('MR');
        await page.locator("div[class='card'] div[class='card'] div[class='card-body'] input[placeholder='First Name']").fill('rudra');
        await page.locator("div[class='card-body'] div[class='col-md-2'] input[placeholder='Last Name']").fill('prasad')
        await page.locator("input[placeholder='Occupation'][name='lname']").fill('Engineer');
        await page.locator('[name="titleguardian2"]').selectOption('MRS');
        await page.locator('input[name="firstname2"]').fill('Sita');
        await page.locator('input[name="lastname2"]').fill('Devi');
        await page.locator('input[name="motherOccupation"]').fill('Engineer');

        await page.locator("app-address[header='Permanent Address'] input[placeholder='address line 1']").fill('123 Test Street');
        //await page.locator('input[formcontrolname="corresCity"]').fill('Test City');
        await page.locator("app-address[header='Permanent Address'] select[name='state']").selectOption('Andhra Pradesh');
        await page.locator('select').filter({ hasText: 'district' }).first().selectOption('Hyderabad');
        await page.locator("//app-address[@header='Permanent Address']//div[@class='col-md-6 text-justify']//input").fill('Telangana');
        await page.locator("//app-address[@header='Permanent Address']//input[@placeholder='PIN code']").fill('500001');


        try {
            await page.locator('xpath=//label[contains(text(), "District")]/following::select[1]').selectOption({ index: 1 });
        } catch (e) {
            console.log('District selection skipped/failed');
        }

        await page.locator('input[formcontrolname="corresPincode"]').fill('500001');
        await page.locator('.form-check-label >> text=Same as Correspondence Address').click();

        await page.getByRole('button', { name: 'Save & Continue' }).click();
        await page.waitForTimeout(3000);
    }

    // 5. Step 5: Education Details
    console.log('Processing Step 5: Education Details');
    const isStep5 = await page.getByText('Academic details').isVisible();
    if (isStep5) {
        await page.locator('input[formcontrolname="board"]').first().fill('Test Board');
        await page.locator('input[formcontrolname="subject"]').first().fill('Test Subject');
        await page.locator('input[formcontrolname="percentage"]').first().fill('85');
        await page.locator('input[formcontrolname="yearOfPassing"]').first().fill('2020');

        await page.getByRole('button', { name: 'Save & Continue' }).click();
        await page.waitForTimeout(3000);
    }

    // 6. Step 6: Occupational Details
    const isStep6 = await page.getByText('Occupational Details').isVisible();
    if (isStep6) {
        console.log('Processing Step 6: Occupational');
        await page.getByRole('button', { name: 'Save & Continue' }).click();
        await page.waitForTimeout(3000);
    }

    // 7. Step 7: Document Upload
    const isStep7 = await page.locator('input[type="file"]').first().isVisible();
    if (isStep7) {
        console.log('Processing Step 7: Document Upload');
        const dummyFile = path.resolve('test-file.pdf');
        const fileInputs = page.locator('input[type="file"]');
        const count = await fileInputs.count();
        for (let i = 0; i < count; i++) {
            if (await fileInputs.nth(i).isVisible()) {
                await fileInputs.nth(i).setInputFiles(dummyFile);
                await page.waitForTimeout(1000);
            }
        }
        await page.getByRole('button', { name: 'Save & Continue' }).click();
        await page.waitForTimeout(3000);
    }

    // 8. Step 8: Test Center Selection
    const isStep8 = await page.getByText('Test Center Preference').isVisible();
    if (isStep8) {
        console.log('Processing Step 8: Test Center');
        await page.locator('select[formcontrolname="testCenterPreference1"]').selectOption({ index: 1 });
        await page.locator('select[formcontrolname="testCenterPreference2"]').selectOption({ index: 2 });
        await page.locator('select[formcontrolname="testCenterPreference3"]').selectOption({ index: 3 });
        await page.getByRole('button', { name: 'Save & Continue' }).click();
        await page.waitForTimeout(3000);
    }

    // 9. Step 9: Preview & Submit
    console.log('Finalizing: Preview & Submit');
    // Wait for preview specific element
    await page.waitForTimeout(5000);
    await page.locator('input[type="checkbox"]').check();

    // Submit
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.getByRole('button', { name: 'Yes, I Confirm' }).click();
    }

    // 10. Download
    console.log('Downloading Form');
    await page.waitForURL(/.*dashboard|.*activity/, { timeout: 20000 });

    // If not at dashboard, go there
    if (!page.url().includes('dashboard')) {
        await page.goto('https://aees.onlineregistrationforms.com/#/dashboard');
    }

    await page.getByRole('button', { name: 'View Application' }).first().click();
    await page.waitForTimeout(3000);

    // Look for print or download button in Preview or elsewhere
    const downloadPromise = page.waitForEvent('download');

    // Check if we need to click Preview tab first
    const previewTab = page.getByText('Preview');
    if (await previewTab.isVisible()) {
        await previewTab.click();
    }

    const printBtn = page.getByRole('button', { name: /Print|Download/i });
    if (await printBtn.isVisible()) {
        await printBtn.click();
        const download = await downloadPromise;
        const downloadPath = path.join(__dirname, 'submitted_form_bug83.pdf');
        await download.saveAs(downloadPath);
        console.log(`Form downloaded successfully to ${downloadPath}`);
    } else {
        console.log('Download button not found even in preview.');
    }
});