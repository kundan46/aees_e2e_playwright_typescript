import { test, expect, Locator } from '@playwright/test';
import { syncIndexes } from 'mongoose';

//Textbox input box: text, attribute, value
//Textarea input box: text, attribute, value
test('Text Input Action', async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    const textbox: Locator = page.locator('#name');
    await expect(textbox).toBeVisible();
    await expect(textbox).toBeEnabled();
    //await textbox.fill('Kundan');

    const maxlength: string | null = await textbox.getAttribute('maxlength'); //returns value of maxlength attribute

    expect(maxlength).toBe('15');

    await textbox.fill('Kundan');

    //console.log("Text Content of First Name:", await textbox.textContent()); //returns empty
    const inputvalue: string = await textbox.inputValue();
    console.log("Input Value Of First Name:", await textbox.inputValue());

    expect(inputvalue).toBe('Kundan');
    await page.waitForTimeout(5000);


});


test('Radio button Action', async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/');

    const maleRadioBtn: Locator = page.locator('#male');

    await expect(maleRadioBtn).toBeVisible();
    await expect(maleRadioBtn).toBeEnabled();
    expect(await maleRadioBtn.isChecked()).toBe(false); //boolean value returns false
    await maleRadioBtn.check(); //select the radio button
    expect(await maleRadioBtn.isChecked()).toBe(true); //boolean value returns true
    await expect(maleRadioBtn).toBeChecked(); //preferable method to check the radio button
    await page.waitForTimeout(5000);

});

test.only('CheckBox Action', async ({ page }) => {
    await page.goto('https://testautomationpractice.blogspot.com/')

    /*//Select Specific Check Box (Sunday) using getByLabel
    const sundayCheckBox: Locator = page.getByLabel('Sunday');
    await sundayCheckBox.check();
    await expect(sundayCheckBox).toBeChecked();
    await page.waitForTimeout(5000);
*/
    //Select All CHeckBox and assert each is checked
    const days: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const checkboxes: Locator[] = days.map(index => page.getByLabel(index));
    expect(checkboxes.length).toBe(7);

    for (const checkbox of checkboxes) {
        await checkbox.check();
        expect(checkbox).toBeChecked();
    }


    //Deselct All Checkboxes
    for (const checkbox of checkboxes) {
        await checkbox.uncheck();
        expect(checkbox).not.toBeChecked();

    }

    //Select First 3 Checkboxes
    for (let i = 0; i < 3; i++) {
        await checkboxes[i].check();
        expect(checkboxes[i]).toBeChecked();

    }

    //Select Last 3 Checkboxes
    for (let i = checkboxes.length - 3; i < checkboxes.length; i++) {
        await checkboxes[i].check();
        expect(checkboxes[i]).toBeChecked();

    }











});