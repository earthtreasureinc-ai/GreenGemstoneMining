import { test, expect } from '@playwright/test';

const fixture = '/tests/fixtures/visual-editor.html';

test('actual application renders with and without ?edit=1', async ({ page }) => {
 const pageErrors: string[] = [];
 page.on('pageerror', error => pageErrors.push(error.message));
 await page.goto('/');
 await expect.poll(() => page.locator('#root').evaluate(el => el.childElementCount)).toBeGreaterThan(0);
 await expect(page.locator('#ggmc-visual-editor')).toHaveCount(0);
 await page.goto('/?edit=1');
 await expect(page.locator('#ggmc-visual-editor')).toBeVisible();
 await expect.poll(() => page.locator('#root').evaluate(el => el.childElementCount)).toBeGreaterThan(0);
 await expect(page.locator('#root')).toBeVisible();
 expect(pageErrors).toEqual([]);
});

test('normal page render does not mount editor without edit=1', async ({ page }) => {
 await page.goto(fixture);
 await expect(page.locator('#root')).toBeVisible();
 await expect(page.locator('#ggmc-visual-editor')).toHaveCount(0);
 await expect(page.locator('body')).not.toHaveClass(/ggmc-ve-on/);
});

test('edit=1 mounts editor, saves white text locally, survives reload and reopen', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 await expect(page.locator('#ggmc-visual-editor')).toBeVisible();
 const headline = page.locator('#headline');
 await expect(headline).toHaveAttribute('contenteditable', 'true');
 await headline.fill('Updated white headline');
 await expect.poll(() => page.evaluate(() => {
  const saved = JSON.parse(localStorage.getItem('ggmc-preview-editor-v2') || '{}');
  const text = saved.text as Record<string, { after?: unknown }> | undefined;
  return Object.values(text || {}).some(entry => entry.after === 'Updated white headline');
 })).toBe(true);
 await page.reload();
 await expect(page.locator('#ggmc-visual-editor')).toBeVisible();
 await expect(page.locator('#headline')).toHaveText('Updated white headline');
 await page.goto(fixture + '?edit=1');
 await expect(page.locator('#headline')).toHaveText('Updated white headline');
});

test('undo and redo restore the edited canvas text', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const headline = page.locator('#headline');
 await headline.fill('Temporary undo test');
 await expect(headline).toHaveText('Temporary undo test');
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Undo' }).click();
 await expect(headline).toHaveText('White text that should be editable');
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Redo' }).click();
 await expect(headline).toHaveText('Temporary undo test');
});

test('Close restores canvas styles and stops editor keyboard interception', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const root = page.locator('#root');
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Mobile' }).click();
 await expect(root).toHaveAttribute('data-ve-viewport', 'Mobile');
 page.on('dialog', dialog => dialog.accept());
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Close' }).click();
 await expect(page.locator('#ggmc-visual-editor')).toHaveCount(0);
 await expect(page.locator('body')).not.toHaveClass(/ggmc-ve-on|ggmc-ve-text|ggmc-ve-select/);
 await expect(page.locator('#root')).toHaveAttribute('style', /max-width:\s*900px/i);
 await expect(root).toHaveAttribute('data-ve-viewport', 'before');
 await expect(page.locator('#headline')).not.toHaveAttribute('contenteditable', 'true');
 await expect(page.locator('#headline')).not.toHaveAttribute('data-ve-key');
 expect(new URL(page.url()).searchParams.has('edit')).toBe(false);
 const prevented = await page.evaluate(() => {
  const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, cancelable: true, bubbles: true });
  document.dispatchEvent(event);
  return event.defaultPrevented;
 });
 expect(prevented).toBe(false);
});

test('editor interactions preserve nested links and buttons', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const nested = page.locator('.nested');
 await expect(nested.locator('a')).toHaveText('Nested contact link');
 await expect(nested.locator('button')).toHaveText('Nested action');
 await expect(nested).toContainText('Section label');
});

test('nested text inspector edits without removing nested links or buttons', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const nested = page.locator('.nested');
 await nested.click();
 const directText = page.locator('#ggmc-visual-editor textarea[aria-label="Text content without changing nested links or formatting"]');
 await expect(directText).toHaveValue('Section label ');
 await directText.fill('Updated section label ');
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Mobile' }).click();
 await expect(nested).toContainText('Updated section label');
 await expect(nested.locator('a')).toHaveText('Nested contact link');
 await expect(nested.locator('a')).toHaveAttribute('href', '#contact');
 await expect(nested.locator('button')).toHaveText('Nested action');
});

test('undo restores the original text-node positions around nested markup', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const nested = page.locator('.nested-punctuation');
 await nested.click();
 const directText = page.locator('#ggmc-visual-editor textarea[aria-label="Text content without changing nested links or formatting"]');
 await directText.fill('Updated section label .');
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Mobile' }).click();
 const afterEdit = await nested.evaluate(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent));
 expect(afterEdit).toEqual(['Updated section label ', '.']);
 await page.locator('#ggmc-visual-editor button').filter({ hasText: 'Undo' }).click();
 const afterUndo = await nested.evaluate(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent));
 expect(afterUndo).toEqual(['Section label ', '.']);
 await expect(nested.locator('a')).toHaveAttribute('href', '#contact');
 await expect(nested.locator('button')).toHaveText('Nested action');
});
