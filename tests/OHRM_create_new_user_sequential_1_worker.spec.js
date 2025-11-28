const {test,expect} = require('@playwright/test');

test ('OrangeHRM Create new employee', async({page}) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await expect (page).toHaveTitle ('OrangeHRM')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect (page).toHaveURL (/dashboard/)
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect (page).toHaveURL (/pim/)
    await page.getByRole('button', { name: ' Add' }).click();

    //Generates a random combination of first and last name
    const Firstname = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
    const Lastname = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
    
    await page.getByRole('textbox', { name: 'First Name' }).fill(Firstname);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(Lastname);

    //Takes the employee ID assigned
    const employeeID = await page.getByRole('textbox').nth(4).inputValue()
    
    await page.getByRole('button', { name: 'Save' }).click();
    await expect (page).toHaveURL (/viewPersonalDetails/)

    const heading = page.locator('h6.oxd-text.oxd-text--h6.--strong');
    
    await expect (page.getByRole('textbox').nth(4)).toHaveValue(employeeID)
    await expect(heading).toContainText(`${Firstname} ${Lastname}`);
        
})
