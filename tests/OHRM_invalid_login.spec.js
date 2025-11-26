const {test,expect} = require('@playwright/test')
const randomUser = Math.random().toString(36).substring(2, 10)
const randomPass = Math.random().toString(36).substring(2, 12)

test ('OrangeHRM Wrong credentials', async({page}) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await expect (page).toHaveTitle ('OrangeHRM')
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill(randomUser);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(randomPass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect (page).toHaveURL (/login/)
    await expect (page.getByText('Invalid credentials')).toBeVisible()
})
