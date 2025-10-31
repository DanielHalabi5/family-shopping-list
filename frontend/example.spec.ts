import { test } from '@playwright/test';

test('test signup and create family and create item', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Milk');
  await page.getByRole('textbox', { name: 'Item Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('2 liters');
  await page.getByRole('button', { name: 'Add to List' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Copy Family Code' }).click();
  await page.getByRole('button', { name: 'Join Requests' }).click();
  await page.getByRole('button', { name: 'Previous Lists' }).click();
  await page.getByRole('button', { name: 'Shopping List' }).click();
  await page.getByRole('button', { name: 'test Logout' }).click();
});

test('test The Add and Delete Items', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).fill('eggs');
  await page.getByRole('textbox', { name: 'Quantity' }).click();
  await page.getByRole('textbox', { name: 'Quantity' }).fill('dozen');
  await page.getByRole('button', { name: 'Add to List' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  await page.getByRole('textbox', { name: 'Item Name' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Milk');
  await page.getByRole('textbox', { name: 'Item Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('2 Liters');
  await page.getByRole('button', { name: 'Add to List' }).click();
  await page.getByRole('button', { name: 'test Logout' }).click();
});

test('Test The Join Request', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Copy Family Code' }).click();
  await page.getByRole('button', { name: 'test Logout' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test2@test2.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('test2pass');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Join Family' }).click();
  await page.getByRole('textbox', { name: 'Family Code' }).click();
  await page.getByRole('textbox', { name: 'Family Code' }).fill('cmhbylaoo0002venkxd3g75ui');
  await page.getByRole('button', { name: 'Request to Join' }).click();
});

test('test the admin accpet the join request', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Join Requests' }).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('button', { name: 'Shopping List' }).click();
  await page.getByRole('button', { name: 'Shopping List' }).click();
  await page.getByRole('button', { name: 'Join Requests' }).click();
  await page.getByRole('button', { name: 'Shopping List' }).click();
  await page.getByRole('button', { name: 'test Logout' }).click();
});

test('test the accepted account with checking items of the list and adding more', async ({ page }) => {
   await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test2@test2.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('test2pass');
  await page.locator('form').getByRole('button', { name: 'Login' }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('textbox', { name: 'Item Name' }).click();
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Salt');
  await page.getByRole('textbox', { name: 'Item Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('2Kg');
  await page.getByRole('button', { name: 'Add to List' }).click();
  await page.getByRole('checkbox').nth(1).uncheck();
  await page.getByRole('button', { name: 'test2 Logout' }).click();
});