import { expect, test } from '@playwright/test';

test('loads the public MekaOps landing page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'MekaOps.' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Open workspace' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Open workspace' }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(
    page.getByRole('heading', { name: 'Create your shop account.' }),
  ).toBeVisible();
});

test('loads the operations overview', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(
    page.getByRole('heading', { name: 'Good evening, Harley' }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Service board' }),
  ).toBeVisible();
});

test('filters service requests by status', async ({ page }) => {
  await page.goto('/dashboard/service-requests');

  await expect(
    page.getByRole('heading', { name: 'Service requests', exact: true }),
  ).toBeVisible();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Completed' }).click();

  await expect(page.getByRole('link', { name: 'SR-1045' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'SR-1048' })).not.toBeVisible();
});
