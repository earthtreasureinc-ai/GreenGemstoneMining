// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { applyPublishedVisualEditorPayload } from './visualEditorBridge';

describe('published visual editor payload safety', () => {
 afterEach(() => { document.body.innerHTML = ''; });
 it('updates text without deleting nested links and buttons', () => {
  document.body.innerHTML = '<div id="root"><section class="hero">Old heading <a href="/contact">Contact</a><button>Explore</button></section></div>';
  const root = document.getElementById('root')!;
  applyPublishedVisualEditorPayload({ text: { '.hero': { after: 'New heading' } } }, root);
  expect(root.querySelector('.hero')?.textContent).toContain('New heading');
  expect(root.querySelector('.hero a')?.textContent).toBe('Contact');
  expect(root.querySelector('.hero button')?.textContent).toBe('Explore');
 });
 it('updates leaf text normally', () => {
  document.body.innerHTML = '<div id="root"><h1 class="title">Old</h1></div>';
  applyPublishedVisualEditorPayload({ text: { '.title': { after: 'New title' } } }, document.getElementById('root')!);
  expect(document.querySelector('.title')?.textContent).toBe('New title');
 });
 it('ignores selectors targeting the root and editor chrome', () => {
  document.body.innerHTML = '<div id="root"><p>Keep me</p></div>';
  const root = document.getElementById('root')!;
  applyPublishedVisualEditorPayload({ text: { '#root': { after: 'Destroyed' }, 'body': { after: 'Destroyed' } } }, root);
  expect(root.querySelector('p')?.textContent).toBe('Keep me');
 });
 it('rejects CSS values containing URL and script-like constructs', () => {
  document.body.innerHTML = '<div id="root"><p class="target">Keep me</p></div>';
  const target = document.querySelector('.target') as HTMLElement;
  applyPublishedVisualEditorPayload({ styles: { '.target': { color: 'red', 'font-family': 'url(javascript:alert(1))' } } }, document.getElementById('root')!);
  expect(target.style.color).toBe('red');
  expect(target.style.fontFamily).toBe('');
 });
});
