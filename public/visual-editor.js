(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('edit') !== '1') return;
  const KEY = 'ggmc-preview-editor-v2';
  const ID = 'ggmc-visual-editor';
  const root = document.getElementById('root');
  if (!root) return;

  const blank = () => ({ text: {}, styles: {}, hidden: {}, blocks: [] });
  const copy = (v) => JSON.parse(JSON.stringify(v));
  let draft = blank(), undo = [], redo = [], mode = 'text', selected = null, applying = false;
  let panel, inspector, status, counter;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') draft = { ...blank(), ...saved };
    else {
      const old = JSON.parse(localStorage.getItem('ggmc-preview-editor-v1') || '{}');
      Object.entries(old).forEach(([key, value]) => { if (value && typeof value.after === 'string') draft.text[key] = value; });
    }
  } catch {}

  const style = document.createElement('style');
  style.textContent = [
    'body.ggmc-ve-on #root,body.ggmc-ve-on #root *{visibility:visible!important;animation:none!important;animation-delay:0s!important;transition-delay:0s!important}',
    'body.ggmc-ve-on #root .reveal,body.ggmc-ve-on #root .reveal.in{opacity:1!important;transform:none!important}',
    'body.ggmc-ve-text [data-ve-key][contenteditable="true"]{outline:1px dashed #c4a252!important;outline-offset:3px;cursor:text!important}',
    'body.ggmc-ve-text [data-ve-key][contenteditable="true"]:focus{outline:2px solid #e4c87c!important;background:rgba(196,162,82,.08)}',
    'body.ggmc-ve-select #root *{cursor:crosshair!important}',
    'body.ggmc-ve-select [data-ve-selected="true"]{outline:3px solid #e4c87c!important;outline-offset:3px!important}',
    '.ve-added-section{padding:64px 24px;background:#101b15;color:#f2eee4}.ve-added-inner{max-width:1120px;margin:auto}.ve-added-section h2,.ve-added-card h3{font:500 clamp(28px,4vw,48px)/1.15 Georgia,serif;margin:0 0 18px;color:inherit}.ve-added-section p,.ve-added-card p{font:400 16px/1.7 system-ui,sans-serif;white-space:pre-wrap}.ve-added-card{padding:24px;margin:14px 0;border:1px solid #705d35;border-radius:12px;background:#16231b;color:inherit}.ve-added-image{display:block;max-width:100%;height:auto;border-radius:10px;margin:16px 0}.ve-added-link{display:inline-block;padding:12px 18px;background:#c4a252;color:#07100b;border-radius:30px;text-decoration:none;font-weight:700;margin:12px 0}',
    '#'+ID+'{position:fixed;z-index:2147483647;top:12px;right:12px;bottom:12px;width:min(390px,calc(100vw - 24px));overflow:auto;padding:16px;background:#0d1310;color:#f2eee4;border:1px solid #7a5f2c;border-radius:14px;box-shadow:0 16px 50px #0008;font:13px/1.45 system-ui,sans-serif;box-sizing:border-box}',
    '#'+ID+' *{box-sizing:border-box}#'+ID+' .ve-title{margin:0;color:#e4c87c;font-size:19px;font-weight:800}#'+ID+' .ve-note{font-size:11px;color:#b5b0a0;margin:5px 0 12px}#'+ID+' .ve-row{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}#'+ID+' button,#'+ID+' select{max-width:100%;border:1px solid #67542e;border-radius:7px;padding:8px 9px;color:#f2eee4;background:#182320;font:600 11px system-ui,sans-serif;cursor:pointer}#'+ID+' button.primary{background:#c4a252;color:#07100b}#'+ID+' button.danger{border-color:#8d4a43;color:#ffc9c2}#'+ID+' button.active{outline:2px solid #e4c87c}#'+ID+' .ve-label{font-weight:800;color:#e4c87c;margin:14px 0 6px}#'+ID+' .ve-field{display:grid;grid-template-columns:100px minmax(0,1fr);align-items:center;gap:8px;margin:8px 0}#'+ID+' label{font-size:11px;color:#c9c2b1}#'+ID+' input,#'+ID+' textarea{width:100%;min-width:0;border:1px solid #46564c;border-radius:6px;background:#101a15;color:#f2eee4;padding:8px;font:12px system-ui,sans-serif}#'+ID+' input[type=color]{height:34px;padding:3px}#'+ID+' textarea{min-height:64px}#'+ID+' .ve-status{font-size:11px;color:#d7cfb7;margin:10px 0;overflow-wrap:anywhere}#'+ID+' .ve-count{font-size:10px;color:#a6a08f}@media(max-width:700px){#'+ID+'{top:auto;max-height:56vh;left:8px;right:8px;bottom:8px;width:auto;padding:12px}#'+ID+' .ve-field{grid-template-columns:84px minmax(0,1fr)}}'
  ].join('\n');
  document.head.appendChild(style);
  document.body.classList.add('ggmc-ve-on');

  const path = (el) => {
    if (!el) return '';
    if (el.dataset.veBlockId) return '[data-ve-block-id="'+el.dataset.veBlockId+'"]';
    if (el.id) return '#'+el.id.replace(/([^\w-])/g,'\\$1');
    const parts = []; let node = el;
    while (node && node.nodeType === 1 && node !== root && node !== document.body) {
      let n=1, sib=node; while ((sib=sib.previousElementSibling)) if (sib.tagName===node.tagName) n++;
      parts.unshift(node.tagName.toLowerCase()+':nth-of-type('+n+')'); node=node.parentElement;
      if (node && node.id) { parts.unshift('#'+node.id.replace(/([^\w-])/g,'\\$1')); break; }
    }
    return parts.join(' > ');
  };
  const all = (selector) => { try { return [...document.querySelectorAll(selector)]; } catch { return []; } };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch { say('Browser storage is unavailable. Export the draft before leaving.'); } updateCount(); };
  const say = (text) => { if (status) status.textContent = text; };
  const updateCount = () => { if (counter) counter.textContent = Object.keys(draft.text).length+' text edits · '+Object.keys(draft.styles).length+' styled elements · '+draft.blocks.length+' added blocks · local draft'; };
  const saveHistory = () => { undo.push(copy(draft)); if (undo.length>60) undo.shift(); redo=[]; };
  const applyChange = (message) => { persist(); refresh(); if(selected) inspect(selected); say(message||'Saved locally. This is not published.'); };
  const safeUrl = (value) => { try { const u=new URL(value,location.origin); return ['https:','http:','mailto:'].includes(u.protocol)||String(value).startsWith('#')?value:'#'; } catch { return String(value).startsWith('#')?value:'#'; } };
  const makeBlock = (item) => {
    const el=document.createElement(item.kind==='section'?'section':'article');
    el.dataset.veBlockId=item.id;
    if(item.kind==='section'){
      el.className='ve-added-section'; const inner=document.createElement('div'); inner.className='ve-added-inner'; el.append(inner);
      if(item.title){const h=document.createElement('h2');h.textContent=item.title;inner.append(h);}
      if(item.text){const p=document.createElement('p');p.textContent=item.text;inner.append(p);}
    } else if(item.kind==='image'){
      const img=document.createElement('img');img.className='ve-added-image';img.src=item.src;img.alt=item.alt||item.title||'Added image';el.append(img);
      if(item.title){const cap=document.createElement('p');cap.textContent=item.title;el.append(cap);}
    } else if(item.kind==='link'){
      const a=document.createElement('a');a.className='ve-added-link';a.textContent=item.title||'Learn more';a.href=safeUrl(item.href||'#contact');el.append(a);
    } else if(item.kind==='divider'){
      const hr=document.createElement('hr');hr.style.cssText='border:0;border-top:1px solid #c4a252;margin:24px 0';el.append(hr);
    } else {
      el.className='ve-added-card';
      if(item.title){const h=document.createElement('h3');h.textContent=item.title;el.append(h);}
      if(item.text){const p=document.createElement('p');p.textContent=item.text;el.append(p);}
    }
    return el;
  };
  function refresh() {
    if(applying)return; applying=true;
    try {
      draft.blocks.forEach((block) => {
        if(!root.querySelector('[data-ve-block-id="'+block.id+'"]')) {
          const el=makeBlock(block); const target=block.after?all(block.after)[0]:null;
          if(target&&target.parentElement)target.insertAdjacentElement('afterend',el);else (root.querySelector('main')||root).append(el);
        }
      });
      const textNodes=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
        const p=n.parentElement;if(!(n.textContent||'').trim()||!p||p.closest('#'+ID+',script,style,svg,input,textarea,select,[aria-hidden="true"],[data-ve-wrap="1"],[data-ve-block-id]'))return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }});
      const nodes=[];while(textNodes.nextNode())nodes.push(textNodes.currentNode);
      nodes.forEach(n=>{if(!n.parentNode)return;const s=document.createElement('span');s.dataset.veWrap='1';n.parentNode.replaceChild(s,n);s.append(n);});
      [...root.querySelectorAll('*')].forEach(el=>{
        if(['SCRIPT','STYLE','SVG','PATH','INPUT','TEXTAREA','SELECT','BUTTON','OPTION'].includes(el.tagName)||el.closest('#'+ID+',svg,[aria-hidden="true"]'))return;
        const key=path(el); if(!key||!(el.textContent||'').trim())return;
        el.dataset.veKey=key;if(!('veOriginal' in el.dataset))el.dataset.veOriginal=el.textContent||'';
        const text=draft.text[key];if(text&&typeof text.after==='string'&&el!==document.activeElement&&el.textContent!==text.after)el.textContent=text.after;
        el.contentEditable=mode==='text'?'true':'false';el.spellcheck=mode==='text';
      });
      Object.entries(draft.styles).forEach(([selector,props])=>all(selector).forEach(el=>Object.entries(props).forEach(([prop,val])=>el.style.setProperty(prop,val))));
      Object.entries(draft.hidden).forEach(([selector,hide])=>all(selector).forEach(el=>el.style.display=hide?'none':''));
      if(selected&&!document.contains(selected))selected=null;
      if(selected)selected.dataset.veSelected='true';
      updateCount();
    } finally { applying=false; }
  }
  const field = (label, control) => {const wrap=document.createElement('div');wrap.className='ve-field';const l=document.createElement('label');l.textContent=label;wrap.append(l,control);return wrap;};
  const input = (type,value,placeholder) => {const i=document.createElement('input');i.type=type;i.value=value||'';if(placeholder)i.placeholder=placeholder;return i;};
  const toHex = (value) => {if(/^#[0-9a-f]{6}$/i.test(value))return value;const m=(value||'').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);return m?'#'+m.slice(1,4).map(v=>Number(v).toString(16).padStart(2,'0')).join(''):'#ffffff';};
  const cssLength = (v) => /^(auto|0|[0-9.]+(px|rem|em|%|vw|vh))$/i.test(v.trim())?v.trim():'initial';
  function selectElement(el){if(selected)delete selected.dataset.veSelected;selected=el;if(selected)selected.dataset.veSelected='true';inspect(selected);}
  function changeStyle(prop,value){
    if(!selected)return;saveHistory();const key=path(selected);draft.styles[key]={...(draft.styles[key]||{}),[prop]:value};applyChange('Updated '+prop+'.');inspect(selected);
  }
  function inspect(el){
    if(!inspector)return;inspector.replaceChildren();
    if(!el){inspector.textContent='Choose Select element, then click a page element to inspect it.';return;}
    const title=document.createElement('div');title.className='ve-label';title.textContent='Selected: '+el.tagName.toLowerCase()+(el.id?' #'+el.id:'');inspector.append(title);
    const key=path(el),props=draft.styles[key]||{};
    const current=(p)=>props[p]||el.style.getPropertyValue(p)||getComputedStyle(el).getPropertyValue(p);
    const color=input('color',toHex(current('color')));color.addEventListener('change',()=>changeStyle('color',color.value));inspector.append(field('Text color',color));
    const bg=input('color',toHex(current('background-color')));bg.addEventListener('change',()=>changeStyle('background-color',bg.value));inspector.append(field('Background',bg));
    const size=input('text',current('font-size'),'e.g. 24px');size.addEventListener('change',()=>changeStyle('font-size',cssLength(size.value)));inspector.append(field('Font size',size));
    const padding=input('text',current('padding'),'e.g. 20px');padding.addEventListener('change',()=>changeStyle('padding',cssLength(padding.value)));inspector.append(field('Padding',padding));
    const margin=input('text',current('margin'),'e.g. 16px 0');margin.addEventListener('change',()=>changeStyle('margin',margin.value.split(/\s+/).every(x=>/^(auto|0|[0-9.]+(px|rem|em|%|vw|vh))$/i.test(x))?margin.value:'initial'));inspector.append(field('Margin',margin));
    const radius=input('text',current('border-radius'),'e.g. 12px');radius.addEventListener('change',()=>changeStyle('border-radius',cssLength(radius.value)));inspector.append(field('Corner radius',radius));
    const align=document.createElement('select');['left','center','right','justify'].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;align.append(o);});align.value=current('text-align')||'left';align.addEventListener('change',()=>changeStyle('text-align',align.value));inspector.append(field('Text align',align));
    const actions=document.createElement('div');actions.className='ve-row';
    const hide=document.createElement('button');hide.textContent=draft.hidden[key]?'Show':'Hide';hide.addEventListener('click',()=>{saveHistory();draft.hidden[key]=!draft.hidden[key];applyChange('Visibility updated.');inspect(el);});
    const up=document.createElement('button');up.textContent='Move up';up.addEventListener('click',()=>move(el,-1));
    const down=document.createElement('button');down.textContent='Move down';down.addEventListener('click',()=>move(el,1));
    const duplicate=document.createElement('button');duplicate.textContent='Duplicate';duplicate.addEventListener('click',()=>duplicateBlock(el));
    const reset=document.createElement('button');reset.textContent='Reset styles';reset.addEventListener('click',()=>{saveHistory();delete draft.styles[key];delete draft.hidden[key];applyChange('Styles reset.');inspect(el);});
    actions.append(hide,up,down,duplicate,reset);inspector.append(actions);
  }
  function move(el,direction){const sib=el.parentElement&&[...el.parentElement.children].filter(x=>x!==panel&&!x.dataset.veWrap);const i=sib?sib.indexOf(el):-1;const target=sib&&sib[i+direction];if(!target)return say('Cannot move further in that direction.');saveHistory();if(direction<0)el.parentElement.insertBefore(el,target);else el.parentElement.insertBefore(target,el);say('Moved in this preview. For permanent ordering, export the draft for review.');}
  function duplicateBlock(el){
    if(!el||!el.parentElement)return;
    const title=(el.textContent||'').trim().slice(0,90)||'Duplicated block';
    const item={id:'ve-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),kind:'card',title,text:(el.textContent||'').trim(),after:path(el)};
    saveHistory();draft.blocks.push(item);applyChange('Created a duplicate content card below the selected element.');
  }
  function addBlock(kind,title,text,src,href,alt){
    if(kind==='image'&&!/^(https:\/\/|\/)/i.test(src))return say('Use an HTTPS image URL or a site-relative path.');
    const item={id:'ve-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),kind,title,text,src,href,alt,after:selected?path(selected.closest('section,article')||selected):null};
    saveHistory();draft.blocks.push(item);applyChange('Added a new '+kind+' block to the local preview.');
  }
  function showAddForm(kind){
    const form=document.createElement('div');form.className='ve-add-form';
    const title=input('text','','Heading or title'),text=document.createElement('textarea');text.placeholder='Description or text';
    const src=input('url','','Image URL'),href=input('url','#contact','Link URL'),alt=input('text','','Image alt text');
    form.append(field('Title',title));
    if(['section','text','card'].includes(kind))form.append(field('Text',text));
    if(kind==='image')form.append(field('Image URL',src),field('Alt text',alt));
    if(kind==='link')form.append(field('Link URL',href));
    const actions=document.createElement('div');actions.className='ve-row';
    const create=document.createElement('button');create.className='primary';create.textContent='Add block';create.addEventListener('click',()=>{addBlock(kind,title.value.trim(),text.value,src.value,href.value,alt.value);form.remove();});
    const cancel=document.createElement('button');cancel.textContent='Cancel';cancel.addEventListener('click',()=>form.remove());actions.append(create,cancel);form.append(actions);
    inspector.before(form);
  }
  function exportDraft(){
    const payload=JSON.stringify({project:'Green Gemstone Mining Company',targetBranch:'preview/resource-navigation-gallery',draftOnly:true,note:'This browser-only editor export is not published. Review and apply changes to the preview branch before release.',changes:draft},null,2);
    const fallback=()=>{const a=document.createElement('textarea');a.value=payload;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();const ok=document.execCommand('copy');a.remove();say(ok?'Editor change package copied. Paste it into this chat for review.':'Clipboard blocked. Try again and allow clipboard access.');};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(payload).then(()=>say('Editor change package copied. Paste it into this chat for review.')).catch(fallback);else fallback();
  }
  function resetDraft(){if(!confirm('Clear all editor drafts in this browser? This does not change the website.'))return;saveHistory();draft=blank();persist();location.reload();}
  function buildPanel(){
    panel=document.createElement('aside');panel.id=ID;panel.setAttribute('aria-label','Preview editor studio');
    const h=document.createElement('h2');h.className='ve-title';h.textContent='Preview editor studio';
    const note=document.createElement('p');note.className='ve-note';note.textContent='Edit text (including white text), style elements, add content, and preview device widths. Drafts remain in this browser until reviewed and applied to the preview branch.';
    panel.append(h,note);
    const modes=document.createElement('div');modes.className='ve-row';
    [['text','Edit text'],['select','Select element']].forEach(([value,label])=>{const b=document.createElement('button');b.textContent=label;b.dataset.mode=value;b.addEventListener('click',()=>setMode(value));modes.append(b);});
    const undoB=document.createElement('button');undoB.textContent='Undo';undoB.addEventListener('click',doUndo);
    const redoB=document.createElement('button');redoB.textContent='Redo';redoB.addEventListener('click',doRedo);modes.append(undoB,redoB);panel.append(modes);
    const addRow=document.createElement('div');addRow.className='ve-row';
    const types=document.createElement('select');types.setAttribute('aria-label','Block type');
    [['section','New section'],['text','Text card'],['card','Content card'],['image','Image'],['link','Button/link'],['divider','Divider']].forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;types.append(o);});
    const add=document.createElement('button');add.className='primary';add.textContent='Add content';add.addEventListener('click',()=>showAddForm(types.value));addRow.append(types,add);panel.append(addRow);
    const tools=document.createElement('div');tools.className='ve-row';
    const exp=document.createElement('button');exp.className='primary';exp.textContent='Export JSON';exp.addEventListener('click',exportDraft);
    const reset=document.createElement('button');reset.className='danger';reset.textContent='Reset draft';reset.addEventListener('click',resetDraft);
    const close=document.createElement('button');close.textContent='Close';close.addEventListener('click',()=>{if(!confirm('Close the editor? Your local draft remains saved.'))return;document.body.classList.remove('ggmc-ve-on','ggmc-ve-text','ggmc-ve-select');panel.remove();style.remove();const u=new URL(location.href);u.searchParams.delete('edit');history.replaceState({},'',u);});
    tools.append(exp,reset,close);panel.append(tools);
    const label=document.createElement('div');label.className='ve-label';label.textContent='Inspector';panel.append(label);
    inspector=document.createElement('div');panel.append(inspector);
    const responsive=document.createElement('div');responsive.className='ve-label';responsive.textContent='Responsive preview';panel.append(responsive);
    const devices=document.createElement('div');devices.className='ve-row';
    [['Desktop','100%'],['Tablet','768px'],['Mobile','390px']].forEach(([label,width])=>{const b=document.createElement('button');b.textContent=label;b.addEventListener('click',()=>{root.style.maxWidth=width==='100%'?'':width;root.style.marginInline=width==='100%'?'':'auto';root.style.boxShadow=width==='100%'?'':'0 0 0 2px #c4a252';say('Local preview width: '+label+'.');});devices.append(b);});panel.append(devices);
    status=document.createElement('div');status.className='ve-status';status.setAttribute('aria-live','polite');panel.append(status);
    counter=document.createElement('div');counter.className='ve-count';panel.append(counter);
    document.body.append(panel);updateCount();inspect(null);
  }
  function setMode(next){mode=next;document.body.classList.toggle('ggmc-ve-text',mode==='text');document.body.classList.toggle('ggmc-ve-select',mode==='select');panel.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));refresh();say(mode==='text'?'Click outlined text and type. Your edits save locally.':'Click an element on the page to change its styling, visibility, or position.');}
  function doUndo(){if(!undo.length)return say('Nothing to undo.');redo.push(copy(draft));draft=undo.pop();persist();refresh();if(selected)inspect(selected);say('Undid the previous change.');}
  function doRedo(){if(!redo.length)return say('Nothing to redo.');undo.push(copy(draft));draft=redo.pop();persist();refresh();if(selected)inspect(selected);say('Restored the next change.');}
  document.addEventListener('input',e=>{const el=e.target;if(!(el instanceof HTMLElement)||!el.isContentEditable||!el.dataset.veKey)return;const key=el.dataset.veKey;const prev=draft.text[key];draft.text[key]={before:prev?prev.before:(el.dataset.veOriginal||''),after:el.textContent||''};persist();say('Text draft saved in this browser.');});
  document.addEventListener('click',e=>{if(!panel||panel.contains(e.target))return;if(mode==='select'){const el=e.target instanceof Element?e.target.closest('#root *'):null;if(el&&!el.closest('#'+ID)){e.preventDefault();e.stopPropagation();selectElement(el);}}else if(mode==='text'){const el=e.target instanceof Element?e.target.closest('[data-ve-key][contenteditable="true"]'):null;if(el&&el.closest('a'))e.preventDefault();}},true);
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?doRedo():doUndo();}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='y'){e.preventDefault();doRedo();}if(e.key==='Escape'&&mode==='select')setMode('text');});
  buildPanel();refresh();setMode('text');
  const observer=new MutationObserver(()=>refresh());observer.observe(root,{childList:true,subtree:true});
  say('Draft only. No website or production changes are published from this panel.');
})();