import { test, expect } from '@playwright/test';

test('main appointment flow', async ({ page }) => {
  // Navigate to appointments page
  await page.goto('/mental-health/appointments');

  // Wait for initial load
  await expect(page.getByText('MindCare Admin')).toBeVisible();
  await expect(page.getByText('All Call Center Appointments')).toBeVisible();

  // Check header metrics are loaded
  await expect(page.getByText('5-Star Rating')).toBeVisible();
  await expect(page.getByText('Lost Patients')).toBeVisible();

  // Switch to CRITICAL tab by clicking SLA Breaches metric
  await page.getByText('SLA Breaches').click();
  await expect(page.getByText('CRITICAL')).toHaveClass(/text-red-600/);

  // Select 3 appointments
  const checkboxes = page.locator('input[type="checkbox"]').filter({ hasText: '' });
  await checkboxes.nth(1).click();
  await checkboxes.nth(2).click();
  await checkboxes.nth(3).click();

  // Verify bulk action bar appears
  await expect(page.getByText('3 appointments selected')).toBeVisible();

  // Click Remind All
  await page.getByText('Remind All').click();

  // Verify success state (selection cleared)
  await expect(page.getByText('3 appointments selected')).not.toBeVisible();

  // Click a violation to filter
  await page.getByText('Harmony Call Pending').click();
  await expect(page.getByText('PENDING')).toHaveClass(/text-yellow-600/);

  // Open details drawer
  await page.getByRole('button', { name: 'More' }).first().click();
  await expect(page.getByText('Appointment Details')).toBeVisible();

  // Close details drawer
  await page.getByRole('button', { name: 'Close details' }).click();
  await expect(page.getByText('Appointment Details')).not.toBeVisible();
}); 