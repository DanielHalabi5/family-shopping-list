import { test, expect } from '@playwright/test';

test('full app flow: login, create/join family, and add items', async ({ page }) => {
  // Login as first user (admin)
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.getByRole('button', { name: 'Login' }).click();

  // Create item
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Milk');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('2 Liters');
  await page.getByRole('button', { name: 'Add to List' }).click();

  // Copy family code
  page.once('dialog', dialog => {
    console.log('Dialog message:', dialog.message());
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Copy Family Code' }).click();

  // Logout
  await page.getByRole('button', { name: 'test Logout' }).click();

  // Login as second user
  await page.getByRole('textbox', { name: 'Email' }).fill('test2@test2.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test2pass');
  await page.getByRole('button', { name: 'Login' }).click();

  // Join family using code (replace with your code if needed)
  await page.getByRole('button', { name: 'Join Family' }).click();
  await page.getByRole('textbox', { name: 'Family Code' }).fill('cmhbylaoo0002venkxd3g75ui');
  await page.getByRole('button', { name: 'Request to Join' }).click();

  // Logout again
  await page.getByRole('button', { name: 'test2 Logout' }).click();

  // Login back as admin to approve
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('testpass');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Join Requests' }).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('button', { name: 'test Logout' }).click();

  // Login as second user again to verify access
  await page.getByRole('textbox', { name: 'Email' }).fill('test2@test2.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test2pass');
  await page.getByRole('button', { name: 'Login' }).click();

  // Check or add new item
  await page.getByRole('textbox', { name: 'Item Name' }).fill('Salt');
  await page.getByRole('textbox', { name: 'Quantity' }).fill('2kg');
  await page.getByRole('button', { name: 'Add to List' }).click();

  await page.getByRole('button', { name: 'test2 Logout' }).click();
});

