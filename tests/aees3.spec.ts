import { test, expect } from '@playwright/test';
import path from 'path';

test('AEES Full E2E Application Submission', async ({ page }) => {
    test.setTimeout(120000); // ✅ increase timeout to 2 minutes

    await page.goto('https://aees.onlineregistrationforms.com/#/home');

    await page.getByRole('button', { name: ' Login' }).click();

    await page.getByRole('textbox', { name: 'Email/Phone Number/' }).fill('bug85@gmail.com');
    await page.getByRole('textbox', { name: 'Password*' }).fill('Abcd@1234');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    // 1. Go to dashboard
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    await expect(dashboardLink).toBeVisible();
    await dashboardLink.click();
    // 2. Click on the exam link from the table
    const examLink = page.getByRole('link', { name: 'Apply Online' }).first();
    await expect(examLink).toBeVisible();
    await examLink.click();
    const viewAppBtn = page.getByRole('button', { name: 'View Application' }).first();
    await expect(viewAppBtn).toBeVisible();
    await viewAppBtn.click();

    // 3. Eligibility
    console.log('Navigating to Step 3: Eligibility');
    const radioButtons = page.locator('input[type="radio"]');

    if (await radioButtons.first().isVisible().catch(() => false)) {
        await radioButtons.nth(0).check();
        await radioButtons.nth(2).check();
        await radioButtons.nth(4).check();
        await page.getByRole('button', { name: 'Save & Continue' }).click();
    }

    // 4. Personal Details
    console.log('Processing Step 4: Personal Details');

    await expect(page.getByText('Candidate Details')).toBeVisible(); // ✅ replace timeout

    const isStep4 = await page.getByText('Candidate Details').isVisible();
    if (isStep4) {

        await page.locator('select.custom-select').nth(0).selectOption('MR');
        await page.locator("//div[@class='row p-2 text-justify']//div[2]//input[1]").fill('Test');
        await page.locator("//div[@class='col-md-3']//input[@placeholder='Middle Name']").fill('Senior');
        await page.locator("//div[@class='col-md-3']//input[@placeholder='Last Name']").fill('Engineer');
        await page.locator('[name="name_Change"]').selectOption('NO');

        const dobInput = page.getByPlaceholder('date of birth');
        await dobInput.evaluate((el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '01-01-2006';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('blur', { bubbles: true }));
        });

        await page.locator('select.custom-select').nth(2).selectOption('MALE');
        await page.locator('select.custom-select').nth(3).selectOption('UNMARRIED');
        //await page.locator('input[placeholder="aadhar number"]').fill('523456789012');

        await page.locator('select.custom-select').nth(4).selectOption('SCHEDULED CASTE (SC)');
        await page.locator('select.custom-select').nth(5).selectOption('NOT APPLICABLE');
        await page.locator('input[name="nationality_declaration"]').click();
        await page.locator('select.custom-select').nth(6).selectOption('NO');

        await page.locator('select[name="title2"]').selectOption('MR');
        await page.locator("div[class='card'] div[class='card'] div[class='card-body'] input[placeholder='First Name']").fill('rudra');
        await page.locator("div[class='card-body'] div[class='col-md-2'] input[placeholder='Last Name']").fill('prasad');
        await page.locator("input[placeholder='Occupation'][name='lname']").fill('Engineer');

        await page.locator('[name="titleguardian2"]').selectOption('MRS');
        await page.locator('input[name="firstname2"]').fill('Sita');
        await page.locator('input[name="lastname2"]').fill('Devi');
        await page.locator('input[name="motherOccupation"]').fill('Engineer');

        await page.locator("app-address[header='Permanent Address'] input[placeholder='address line 1']").fill('123 Test Street');

        const permanentAddress = page.locator("app-address[header='Permanent Address']");
        const stateDropdown = permanentAddress.locator('select[name="state"]');

        // wait for dropdown itself
        await expect(stateDropdown).toBeEnabled();

        // directly select (no visibility check on option)
        await stateDropdown.selectOption({ label: 'BIHAR' });

        // wait for dependent district dropdown to populate
        const districtDropdown = permanentAddress.locator('select[name="district"]');
        await expect(districtDropdown).toBeEnabled();

        await districtDropdown.selectOption({ label: 'PATNA' });
        // wait for dependent city dropdown to populate
        await page.locator("//app-address[@header='Permanent Address']//div[@class='col-md-6 text-justify']//input").fill('Test City');
        //await permanentAddress.locator("input[placeholder='City / Village']").fill('Test City');
        //await page.locator("//app-address[@header='Permanent Address']//div[@class='col-md-6 text-justify']//input").fill('Test City');
        await permanentAddress.locator("input[placeholder='PIN code']").fill('800001');
        await page.locator('#sameaddress').click();
        await page.locator('input[name="privacy_declaration"]').click();

        await page.getByRole('button', { name: 'Save & Continue' }).click();
        await page.waitForTimeout(15000);
    }

    // 5. Education
    console.log('Processing Step 5: Education Details');

    if (await page.getByText('Academic details').isVisible().catch(() => false)) {

        await page.locator('input[formcontrolname="board"]').first().fill('Test Board');
        await page.locator('input[formcontrolname="subject"]').first().fill('Test Subject');
        await page.locator('input[formcontrolname="percentage"]').first().fill('85');
        await page.locator('input[formcontrolname="yearOfPassing"]').first().fill('2020');

        await page.getByRole('button', { name: 'Save & Continue' }).click();
    }

    // 6. Occupational
    if (await page.getByText('Occupational Details').isVisible().catch(() => false)) {
        await page.getByRole('button', { name: 'Save & Continue' }).click();
    }

    // 7. Upload
    if (await page.locator('input[type="file"]').first().isVisible().catch(() => false)) {

        const dummyFile = path.resolve('test-file.pdf');
        const fileInputs = page.locator('input[type="file"]');
        const count = await fileInputs.count();

        for (let i = 0; i < count; i++) {
            if (await fileInputs.nth(i).isVisible()) {
                await fileInputs.nth(i).setInputFiles(dummyFile);
            }
        }

        await page.getByRole('button', { name: 'Save & Continue' }).click();
    }

    // 8. Test Center
    if (await page.getByText('Test Center Preference').isVisible().catch(() => false)) {

        await page.locator('select[formcontrolname="testCenterPreference1"]').selectOption({ index: 1 });
        await page.locator('select[formcontrolname="testCenterPreference2"]').selectOption({ index: 2 });
        await page.locator('select[formcontrolname="testCenterPreference3"]').selectOption({ index: 3 });

        await page.getByRole('button', { name: 'Save & Continue' }).click();
    }

    // 9. Preview
    await expect(page.locator('input[type="checkbox"]').last()).toBeVisible();
    await page.locator('input[type="checkbox"]').last().check();

    const submitBtn = page.getByRole('button', { name: 'Submit' });

    if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.getByRole('button', { name: 'Yes, I Confirm' }).click();
    }

    // 10. Download
    await page.waitForURL(/.*dashboard|.*activity/);

    if (!page.url().includes('dashboard')) {
        await page.goto('https://aees.onlineregistrationforms.com/#/dashboard');
    }

    await page.getByRole('button', { name: 'View Application' }).first().click();

    const downloadPromise = page.waitForEvent('download');

    if (await page.getByText('Preview').isVisible().catch(() => false)) {
        await page.getByText('Preview').click();
    }

    const printBtn = page.getByRole('button', { name: /Print|Download/i });

    if (await printBtn.isVisible()) {
        await printBtn.click();
        const download = await downloadPromise;
        const downloadPath = path.join(__dirname, 'submitted_form_bug83.pdf');
        await download.saveAs(downloadPath);
    }
});