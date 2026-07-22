import { expect, test } from '@playwright/test'

test('loads the operations overview', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Good evening, Harley' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
  await expect(page.getByText('Active service requests')).toBeVisible()
})

test('filters service requests by status', async ({ page }) => {
  await page.goto('/service-requests')

  await expect(page.getByRole('heading', { name: 'Service requests', exact: true })).toBeVisible()
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Completed' }).click()

  await expect(page.getByRole('link', { name: 'SR-1045' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'SR-1048' })).not.toBeVisible()
})
