const {test,expect} = require('@playwright/test');

test ('OrangeHRM Create new employee', async({page}) => {
    /*Automation of admin log in, creation of new user with randomized characters (letters only), exception for invalid employee ID, 
    and assertion of names and ID. Scope is to test user creation functionally and not by its performance, hence why the test is designed to be
    run with 1 worker*/

    //Admin log in and navigation to user creation page
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
    console.log (Firstname, "First name succesfully created")
    console.log (Lastname, "Last name succesfully created")
    await page.getByRole('textbox', { name: 'First Name' }).fill(Firstname);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(Lastname);

    /*Because of the high traffic nature of the environment, and because the PIM auto assigns one, an employee ID bucle serves the function of 
    verifying the availability of the ID. It will change ID+1 once so an available ID is found. This script tries to keep the sequential generation
    of valid ID's like a real user would instead of generating a random 4 digit number that will most likely be not already taken and readily accepted*/
    const employeeID = await page.getByRole('textbox').nth(4).inputValue()
    let numericID = parseInt(employeeID, 10)
    console.log (numericID, "is the generated EmployeeID")
    await page.getByRole('button', { name: 'Save' }).click();
    //Duplication check and retrying logic
    const duplicateMsg = page.getByText ('Employee Id already exists');
    let duplicateFound = false;
    try {
        await duplicateMsg.waitFor({timeout:3000});
        duplicateFound = true;}
    catch {duplicateFound = false;}
    if (duplicateFound) {
        console.log(employeeID, "employeeID already taken. Retrying...");
        const newID = (numericID+1).toString()
        await page.getByRole('textbox').nth(4).fill(newID);
        await page.getByRole('button', { name: 'Save' }).click();
    }else {await expect (page).toHaveURL (/viewPersonalDetails/)}
    await page.getByRole('link', { name: 'PIM' }).click();
    
    //At times, UI will have search box collapsed depending on browser configuration. This conditional opens the element in case it's closed
    if (!page.getByRole('textbox', { name: 'Type for hints...' }).first().isVisible()){await page.getByRole('button').nth(3).click(),
    console.log ("Search box collapsed. Opening...")
    }
    //Searches for newly created employee by name
    await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill(`${Firstname} ${Lastname}`);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('table')).toContainText(`${Firstname}`);
    await expect(page.getByRole('table')).toContainText(`${Lastname}`);  
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    await expect (page).toHaveURL (/viewPersonalDetails/)
    await expect(page.getByRole('heading', { name: new RegExp(Firstname, 'i')})).toBeVisible();
    //Asserts name and ID
    const heading = page.locator('h6.oxd-text.oxd-text--h6.--strong');
    await expect (page.getByRole('textbox').nth(4)).toHaveValue(employeeID)
    await expect(heading).toContainText(`${Firstname} ${Lastname}`);
    
    console.log ("New employee found within PIM's database")
})