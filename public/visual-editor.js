(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('edit') !== '1') return;

  const STORAGE_KEY = 'ggmc-preview-editor-v1';
  const TOOLBAR_ID = 'ggmc-visual-editor';
  const ignoredTags = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT', 'OPTION', 'META', 'LINK', 'TITLE']);
  let editing = false;
  let draft = {};
  let toolbar;
  let status;
  let count;
  let observer;

  try { draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { draft = {}; }

  document.body.classList.add('ggmc-ve-loaded');
  const style = document.createElement('style');
  style.textContent = `
    body.ggmc-ve-loaded #root, body.ggmc-ve-loaded #root * { visibility: visible !important; animation-delay: 0s !important; animation-duration: 0s !important; transition-delay: 0s !important; }
    body.ggmc-ve-loaded #root * { opacity: 1 !important; }
    body.ggmc-ve-loaded .reveal, body.ggmc-ve-loaded .reveal.in { opacity: 1 !important; transform: none !important; visibility: visible !important; }
    body.ggmc-ve-loaded .hero-kicker, body.ggmc-ve-loaded .hero-sub, body.ggmc-ve-loaded .hero-metrics, body.ggmc-ve-loaded .hero-foot, body.ggmc-ve-loaded .hero-cta { opacity: 1 !important; animation: none !important; transform: none !important; }
    body.ggmc-ve-active [data-ggmc-edit-key][contenteditable="true"] { outline: 1px dashed #c4a252 !important; outline-offset: 3px; cursor: text !important; border-radius: 2px; }
    body.ggmc-ve-active [data-ggmc-edit-key][contenteditable="true"]:focus { outline: 2px solid #e4c87c !important; background: rgba(196,162,82,.09); }
    #${TOOLBAR_ID} { position: fixed; z-index: 2147483647; right: 18px; bottom: 18px; width: min(360px, calc(100vw - 28px)); padding: 16px; box-sizing: border-box; color: #f2eee4; background: #0d1310; border: 1px solid #7a5f2c; border-radius: 12px; box-shadow: 0 14px 48px rgba(0,0,0,.42); font: 14px/1.4 'Space Grotesk', sans-serif; }
    #${TOOLBAR_ID} * { box-sizing: border-box; }
    #${TOOLBAR_ID} .ggmc-ve-title { font: 600 17px/1.25 'Space Grotesk', sans-serif; margin: 0 0 4px; color: #e4c87c; }
    #${TOOLBAR_ID} .ggmc-ve-note { margin: 0 0 12px; color: #b5b0a0; font-size: 12px; }
    #${TOOLBAR_ID} .ggmc-ve-actions { display: flex; flex-wrap: wrap; gap: 7px; }
    #${TOOLBAR_ID} button { appearance: none; border: 1px solid #7a5f2c; border-radius: 7px; padding: 8px 10px; color: #f2eee4; background: #182320; font: 500 12px/1.2 'Space Grotesk', sans-serif; cursor: pointer; }
    #${TOOLBAR_ID} button.primary { background: #c4a252; color: #070a08; border-color: #e4c87c; }
    #${TOOLBAR_ID} button:hover { filter: brightness(1.12); }
    #${TOOLBAR_ID} .ggmc-ve-status { margin-top: 10px; color: #b5b0a0; font-size: 12px; }
    @media (max-width: 540px) { #${TOOLBAR_ID} { right: 10px; bottom: 10px; } }
  `;
  document.head.appendChild(style);

  function readDraft() {
    try { draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { draft = {}; }
  }
  function writeDraft() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { setStatus('Browser storage is unavailable. Export your changes before closing this page.'); }
    updateCount();
  }
  function getPath(el) {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      const tag = node.tagName.toLowerCase();
      let n = 1;
      let sibling = node;
      while ((sibling = sibling.previousElementSibling)) if (sibling.tagName === node.tagName) n++;
      parts.unshift(`${tag}:nth-of-type(${n})`);
      node = node.parentElement;
      if (node && node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
    }
    return parts.join(' > ');
  }
  function wrapTextNodes() {
    const root = document.getElementById('root');
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!(node.textContent || '').trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest(`#${TOOLBAR_ID}, script, style, svg, path, input, textarea, select, [aria-hidden=\"true\"], [data-ggmc-text-wrap=\"true\"]`)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const span = document.createElement('span');
      span.dataset.ggmcTextWrap = 'true';
      node.parentNode.replaceChild(span, node);
      span.appendChild(node);
    }
  }
  function eligible(el) {
    if (el.childElementCount !== 0 || ignoredTags.has(el.tagName)) return false;
    if (el.closest(`#${TOOLBAR_ID}, script, style, svg, input, textarea, select, [aria-hidden=\"true\"]`)) return false;
    return Boolean((el.textContent || '').trim());
  }
  function refreshElements() {
    wrapTextNodes();
    const elements = Array.from(document.body.querySelectorAll('*')).filter(eligible);
    for (const el of elements) {
      const key = getPath(el);
      if (!key) continue;
      el.dataset.ggmcEditKey = key;
      if (!Object.prototype.hasOwnProperty.call(el.dataset, 'ggmcOriginal')) el.dataset.ggmcOriginal = el.textContent || '';
      const saved = draft[key];
      if (saved && typeof saved.after === 'string' && el !== document.activeElement && el.textContent !== saved.after) {
        el.textContent = saved.after;
      }
      el.contentEditable = editing ? 'true' : 'false';
      el.spellcheck = editing;
    }
    updateCount();
  }
  function updateCount() {
    if (count) count.textContent = `${Object.keys(draft).length} change${Object.keys(draft).length === 1 ? '' : 's'} saved in this browser`;
  }
  function setStatus(message) { if (status) status.textContent = message; }
  function setEditing(value) {
    editing = value;
    document.body.classList.toggle('ggmc-ve-active', editing);
    const button = toolbar && toolbar.querySelector('[data-action="toggle"]');
    if (button) button.textContent = editing ? 'Finish editing' : 'Edit text on page';
    refreshElements();
    setStatus(editing ? 'Click any outlined text (including white text) and type. Your draft saves in this browser.' : 'Draft only — nothing has been published or changed on the live website.');
  }
  function exportChanges() {
    const edits = Object.entries(draft).map(([selector, value]) => ({ selector, original: value.before, revised: value.after }));
    const payload = JSON.stringify({ project: 'Green Gemstone Mining Company', type: 'preview-only text edits', note: 'These are owner feedback changes for review; they have not been published.', edits }, null, 2);
    const copyFallback = () => {
      const area = document.createElement('textarea');
      area.value = payload;
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area); area.select();
      const ok = document.execCommand('copy'); area.remove();
      setStatus(ok ? 'Changes copied. Paste them into your ChatGPT conversation.' : 'Copy was blocked. Try Export again or select the text from your browser tools.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(() => setStatus('Changes copied. Paste them into your ChatGPT conversation.')).catch(copyFallback);
    } else copyFallback();
  }
  function buildToolbar() {
    toolbar = document.createElement('aside');
    toolbar.id = TOOLBAR_ID;
    toolbar.setAttribute('aria-label', 'Preview visual editor');
    toolbar.innerHTML = `<p class="ggmc-ve-title">Preview editor</p><p class="ggmc-ve-note">Edit visible text, including white text and text beside icons. Drafts stay in this browser until you copy them to ChatGPT for a branch update.</p><div class="ggmc-ve-actions"><button class="primary" data-action="toggle">Edit text on page</button><button data-action="export">Copy changes for ChatGPT</button><button data-action="reset">Reset draft</button><button data-action="close">Close editor</button></div><div class="ggmc-ve-status" data-role="status" aria-live="polite"></div><div class="ggmc-ve-status" data-role="count"></div>`;
    document.body.appendChild(toolbar);
    status = toolbar.querySelector('[data-role="status"]');
    count = toolbar.querySelector('[data-role="count"]');
    toolbar.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'toggle') setEditing(!editing);
      if (action === 'export') exportChanges();
      if (action === 'reset') {
        if (window.confirm('Clear your saved preview edits in this browser? This will not change the website.')) {
          localStorage.removeItem(STORAGE_KEY); draft = {}; window.location.reload();
        }
      }
      if (action === 'close') {
        setEditing(false);
        toolbar.remove(); style.remove();
        const url = new URL(window.location.href); url.searchParams.delete('edit');
        window.history.replaceState({}, '', url.toString());
      }
    });
    document.addEventListener('input', (event) => {
      const el = event.target;
      if (!(el instanceof HTMLElement) || !el.isContentEditable || !el.dataset.ggmcEditKey) return;
      const key = el.dataset.ggmcEditKey;
      const previous = draft[key];
      draft[key] = { before: previous ? previous.before : (el.dataset.ggmcOriginal || ''), after: el.textContent || '' };
      writeDraft();
      setStatus('Draft saved locally. Use “Copy changes for ChatGPT” when you want me to review them.');
    });
    document.addEventListener('click', (event) => {
      if (!editing) return;
      const el = event.target instanceof Element ? event.target.closest('[data-ggmc-edit-key][contenteditable="true"]') : null;
      if (el && el.closest('a')) event.preventDefault();
    }, true);
    updateCount();
    setStatus('Draft only — nothing has been published or changed on the live website.');
  }

  function start() {
    readDraft();
    buildToolbar();
    refreshElements();
    observer = new MutationObserver(() => refreshElements());
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
