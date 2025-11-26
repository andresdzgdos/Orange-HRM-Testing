const {test,expect} = require('@playwright/test');
const Firstname = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
const Lastname = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);


test ('OrangeHRM Create new employee', async({page}) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await expect (page).toHaveTitle ('OrangeHRM')
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect (page).toHaveURL (/dashboard/)
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect (page).toHaveURL (/pim/)
    await page.getByRole('button', { name: ' Add' }).click();

    const employeeID = await page.getByRole('textbox').nth(4).inputValue()
   
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill(Firstname);
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).fill(Lastname);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill(employeeID);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    await expect (page.getByRole('textbox').nth(4)).toHaveValue(employeeID)

})
