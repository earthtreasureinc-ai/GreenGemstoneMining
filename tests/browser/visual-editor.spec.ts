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
 await expect.poll(() => page.locator('#ggmc-visual-editor .ve-layer-item').count()).toBeGreaterThan(0);
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
 await page.getByRole('button', { name: 'Undo', exact: true }).click();
 await expect(headline).toHaveText('White text that should be editable');
 await page.getByRole('button', { name: 'Redo', exact: true }).click();
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
 await page.getByRole('button', { name: 'Undo', exact: true }).click();
 const afterUndo = await nested.evaluate(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent));
 expect(afterUndo).toEqual(['Section label ', '.']);
 await expect(nested.locator('a')).toHaveAttribute('href', '#contact');
 await expect(nested.locator('button')).toHaveText('Nested action');
});

test('Add content creates every supported block type', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 await page.locator('#ggmc-visual-editor select[aria-label="Block type"]').selectOption('text');
 await page.getByRole('button', { name: 'Add content', exact: true }).click();
 await page.getByRole('button', { name: 'Cancel', exact: true }).click();
 await expect(page.locator('#root [data-ve-block-id]')).toHaveCount(0);
 const kinds = ['section', 'text', 'card', 'image', 'link', 'divider'];
 for (const kind of kinds) {
  await page.locator('#ggmc-visual-editor select[aria-label="Block type"]').selectOption(kind);
  await page.getByRole('button', { name: 'Add content', exact: true }).click();
  await page.getByPlaceholder('Heading or title').fill('Test ' + kind);
  if (['section', 'text', 'card'].includes(kind)) await page.getByPlaceholder('Description or text').fill('Test block content');
  if (kind === 'image') await page.getByPlaceholder('Image URL').fill('/sample.png');
  await page.getByRole('button', { name: 'Add block', exact: true }).click();
  await expect(page.locator('#root [data-ve-block-id]')).toHaveCount(kinds.indexOf(kind) + 1);
 }
 await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ggmc-preview-editor-v2') || '{}').blocks.map((block: { kind: string }) => block.kind))).toEqual(kinds);
});

test('layer search finds elements beyond the initial layer list', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const search = page.getByLabel('Find anything on this page');
 await page.getByRole('button', { name: 'Show more results', exact: true }).click();
 await expect(page.locator('#ggmc-visual-editor')).toContainText('Showing 101–114 of 114 items.');
 await search.fill('Extra layer 104');
 const result = page.locator('#ggmc-visual-editor button').filter({ hasText: 'Extra layer 104' }).first();
 await expect(result).toBeVisible();
 await expect(page.locator('#ggmc-visual-editor')).toContainText(/matches/);
 await result.click();
 await expect(page.locator('#ggmc-visual-editor')).toContainText('Selected:');
});

test('selected element controls style, hide/show, move, duplicate, and remove', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 await page.getByRole('button', { name: 'Select element', exact: true }).click();
 const contact = page.locator('#contact');
 await contact.click();
 const baseColor = await contact.evaluate(el => getComputedStyle(el).color);
 await page.locator('#ggmc-visual-editor input[type="color"]').first().fill('#123456');
 await expect(contact).toHaveCSS('color', 'rgb(18, 52, 86)');
 await page.getByRole('button', { name: 'Reset styles', exact: true }).click();
 await expect(contact).toHaveCSS('color', baseColor);
 await page.locator('#ggmc-visual-editor input[type="color"]').first().fill('#123456');
 await page.getByRole('button', { name: 'Hide', exact: true }).click();
 await expect(contact).toHaveCSS('display', 'none');
 await page.getByRole('button', { name: 'Show', exact: true }).click();
 await expect(contact).not.toHaveCSS('display', 'none');
 const before = await contact.evaluate(el => [...el.parentElement!.children].indexOf(el));
 await page.getByRole('button', { name: 'Move up', exact: true }).click();
 const moved = await contact.evaluate(el => [...el.parentElement!.children].indexOf(el));
 expect(moved).toBe(before - 1);
 await page.getByRole('button', { name: 'Move down', exact: true }).click();
 await expect.poll(() => contact.evaluate(el => [...el.parentElement!.children].indexOf(el))).toBe(before);
 await expect(page.locator('#ggmc-visual-editor')).toContainText('Moved in this preview');
 await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
 const duplicate = page.locator('#root [data-ve-block-id]');
 await expect(duplicate).toHaveCount(1);
 page.on('dialog', dialog => dialog.accept());
 await duplicate.click();
 await page.getByRole('button', { name: 'Remove block', exact: true }).click();
 await expect(duplicate).toHaveCount(0);
});

test('text conversion and existing-button dropdown actions work', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const headline = page.locator('#headline');
 const box = await headline.boundingBox();
 if (!box) throw new Error('Headline is not visible for selection.');
 await page.mouse.move(box.x + 2, box.y + box.height / 2);
 await page.mouse.down();
 await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2);
 await page.mouse.up();
 await page.getByRole('button', { name: 'Selected text → button/link', exact: true }).click();
 await page.locator('#ggmc-visual-editor .ve-add-form select').selectOption('button');
 await page.locator('#ggmc-visual-editor textarea[placeholder^="Optional dropdown items"]').fill('Learn more | #contact');
 await page.getByRole('button', { name: 'Apply', exact: true }).click();
 const converted = headline.locator('[data-ve-inline-action]');
 await expect(converted).toHaveText('White text that should be editable');
 await converted.click();
 await expect(page.locator('#root .ve-dropdown-menu')).toBeVisible();
 await expect(page.locator('#root .ve-dropdown-menu a')).toHaveAttribute('href', '#contact');

 await page.getByRole('button', { name: 'Select element', exact: true }).click();
 await page.locator('.nested button').click();
 await page.getByRole('button', { name: 'Add dropdown to selected button', exact: true }).click();
 await page.locator('#ggmc-visual-editor textarea[placeholder^="Optional dropdown items"]').fill('Contact | #contact');
 await page.getByRole('button', { name: 'Apply', exact: true }).click();
 await page.getByRole('button', { name: 'Edit text', exact: true }).click();
 const nestedButton = page.locator('.nested button');
 await nestedButton.click();
 await expect(page.locator('.nested .ve-dropdown-menu')).toBeVisible();
 await expect(page.locator('.nested .ve-dropdown-menu a')).toHaveAttribute('href', '#contact');
});

test('server controls fail clearly without a preview server API', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 for (const name of ['Sign in', 'Refresh', 'Load draft', 'Save server draft']) {
  await page.getByRole('button', { name, exact: true }).click();
  await expect(page.locator('#ggmc-visual-editor .ve-status')).toContainText('Server drafts are not connected on this preview.');
 }
 await page.getByRole('button', { name: 'Publish snapshot', exact: true }).click();
 await expect(page.locator('#ggmc-visual-editor .ve-status')).toContainText('Save a new draft before publishing.');
 await page.getByRole('button', { name: 'Load versions', exact: true }).click();
 await expect(page.locator('#ggmc-visual-editor .ve-status')).toContainText('Load or save a server draft first.');
 await page.getByRole('button', { name: 'Restore locally', exact: true }).click();
 await expect(page.locator('#ggmc-visual-editor .ve-status')).toContainText('Select a version first.');
 await page.getByRole('button', { name: 'Restore to server draft', exact: true }).click();
 await expect(page.locator('#ggmc-visual-editor .ve-status')).toContainText('Load a server draft and select a version first.');
});

test('panel buttons dock, collapse, expand, preview widths, export, and reset', async ({ page }) => {
 await page.goto(fixture + '?edit=1');
 const panel = page.locator('#ggmc-visual-editor');
 await page.getByRole('button', { name: 'Dock left', exact: true }).click();
 await expect(panel).toHaveClass(/ve-left/);
 await page.getByRole('button', { name: 'Dock right', exact: true }).click();
 await expect(panel).not.toHaveClass(/ve-left/);
 await page.getByRole('button', { name: 'Collapse', exact: true }).click();
 await expect(panel).toHaveClass(/ve-collapsed/);
 await page.getByRole('button', { name: 'Expand', exact: true }).click();
 await expect(panel).not.toHaveClass(/ve-collapsed/);
 for (const size of ['Tablet', 'Mobile', 'Desktop']) {
  await page.getByRole('button', { name: size, exact: true }).click();
  await expect(page.locator('#root')).toHaveAttribute('data-ve-viewport', size);
 }
 await page.locator('#headline').fill('Reset me');
 await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
 await page.getByRole('button', { name: 'Export JSON', exact: true }).click();
 await expect(page.locator('#ggmc-visual-editor .ve-status')).toContainText('Editor change package copied');
 const exported = await page.evaluate(() => navigator.clipboard.readText());
 expect(JSON.parse(exported)).toMatchObject({ targetBranch: 'preview/resource-navigation-gallery', draftOnly: true });
 await page.on('dialog', dialog => dialog.accept());
 await page.getByRole('button', { name: 'Reset draft', exact: true }).click();
 await expect(panel).toBeVisible();
 await expect(page.locator('#headline')).toHaveText('White text that should be editable');
 await expect(panel).toContainText('0 text edits');
});
