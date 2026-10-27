import { getSupabase } from '@/lib/supabase';

export interface VisualEditorServerDraft {
 id:string; name:string; payload:Record<string,unknown>; version:number;
 status:'draft'|'published'|'archived'; updated_at:string; published_at:string|null;
}
export interface VisualEditorServerVersion {
 id:number; draft_id:string; version:number; payload:Record<string,unknown>;
 status:'draft'|'published'|'restored'; created_at:string; note:string;
}
export interface VisualEditorBridge {
 getSession():Promise<{email:string|null;isAdmin:boolean}>;
 signIn(email:string,password:string):Promise<void>;
 signOut():Promise<void>;
 listDrafts():Promise<VisualEditorServerDraft[]>;
 saveDraft(input:{id:string|null;expectedVersion:number;name:string;payload:Record<string,unknown>}):Promise<VisualEditorServerDraft>;
 publishDraft(id:string,expectedVersion:number):Promise<VisualEditorServerDraft>;
 listVersions(id:string):Promise<VisualEditorServerVersion[]>;
 restoreVersion(id:string,version:number):Promise<VisualEditorServerDraft>;
 getPublishedPayload():Promise<Record<string,unknown>|null>;
}
declare global { interface Window { __GGMC_EDITOR_API__?:VisualEditorBridge } }
async function adminClient(){
 const sb=await getSupabase(); if(!sb)throw new Error('Preview Supabase is not configured for this deployment.');
 const {data:{session}}=await sb.auth.getSession(); if(!session)throw new Error('Sign in with your owner account first.');
 const {data,error}=await sb.rpc('is_admin'); if(error||data!==true)throw new Error('This account is not authorised to manage the website.');
 return sb;
}
export function installVisualEditorBridge(){
 window.__GGMC_EDITOR_API__={
  async getSession(){const sb=await getSupabase();if(!sb)return {email:null,isAdmin:false};const {data:{session}}=await sb.auth.getSession();if(!session)return {email:null,isAdmin:false};const {data}=await sb.rpc('is_admin');return {email:session.user.email??null,isAdmin:data===true};},
  async signIn(email,password){const sb=await getSupabase();if(!sb)throw new Error('Preview Supabase is not configured for this deployment.');const {error}=await sb.auth.signInWithPassword({email,password});if(error)throw new Error('Sign-in failed. Check your credentials.');const {data}=await sb.rpc('is_admin');if(data!==true){await sb.auth.signOut();throw new Error('This account is not authorised to manage the website.');}},
  async signOut(){const sb=await getSupabase();await sb?.auth.signOut();},
  async listDrafts(){const sb=await adminClient();const {data,error}=await sb.rpc('list_visual_editor_drafts');if(error)throw error;return (data??[]) as VisualEditorServerDraft[];},
  async saveDraft(input){const sb=await adminClient();const {data,error}=await sb.rpc('save_visual_editor_draft',{p_draft_id:input.id,p_expected_version:input.expectedVersion,p_name:input.name,p_payload:input.payload});if(error)throw error;return data as VisualEditorServerDraft;},
  async publishDraft(id,expectedVersion){const sb=await adminClient();const {data,error}=await sb.rpc('publish_visual_editor_draft',{p_draft_id:id,p_expected_version:expectedVersion});if(error)throw error;return data as VisualEditorServerDraft;},
  async listVersions(id){const sb=await adminClient();const {data,error}=await sb.rpc('list_visual_editor_versions',{p_draft_id:id});if(error)throw error;return (data??[]) as VisualEditorServerVersion[];},
  async restoreVersion(id,version){const sb=await adminClient();const {data,error}=await sb.rpc('restore_visual_editor_version',{p_draft_id:id,p_version:version});if(error)throw error;return data as VisualEditorServerDraft;},
  async getPublishedPayload(){const sb=await getSupabase();if(!sb)return null;const {data,error}=await sb.rpc('get_published_visual_editor_payload');if(error)throw error;return (data??null) as Record<string,unknown>|null;}
 };
}

/** Apply a published snapshot. Inserted content is rendered with textContent and safe URL checks. */
export function applyPublishedVisualEditorPayload(payload: Record<string, unknown> | null, root: HTMLElement | null = document.getElementById('root')) {
 if (!payload || !root || typeof payload !== 'object') return;
 const text = payload.text && typeof payload.text === 'object' ? payload.text as Record<string, {after?:unknown}> : {};
 for (const [selector, change] of Object.entries(text)) {
  if (!change || typeof change.after !== 'string') continue;
  try { root.querySelectorAll(selector).forEach((el) => { if (!el.closest('#ggmc-visual-editor')) el.textContent = change.after as string; }); } catch { /* stale selector */ }
 }
 const styles = payload.styles && typeof payload.styles === 'object' ? payload.styles as Record<string, Record<string, unknown>> : {};
 for (const [selector, props] of Object.entries(styles)) {
  try { root.querySelectorAll(selector).forEach((el) => Object.entries(props || {}).forEach(([key,value]) => {
   if (/^(color|background-color|font-size|padding|margin|border-radius|text-align)$/.test(key) && typeof value === 'string' && value.length < 100) (el as HTMLElement).style.setProperty(key,value);
  })); } catch { /* stale selector */ }
 }
 const hidden = payload.hidden && typeof payload.hidden === 'object' ? payload.hidden as Record<string,unknown> : {};
 for (const [selector, hide] of Object.entries(hidden)) {
  try { root.querySelectorAll(selector).forEach((el) => { if (hide === true) (el as HTMLElement).style.display='none'; }); } catch { /* stale selector */ }
 }
 const blocks = Array.isArray(payload.blocks) ? payload.blocks as Array<Record<string,unknown>> : [];
 const main = root.querySelector('main') || root;
 for (const block of blocks) {
  const id = typeof block.id === 'string' ? block.id : '';
  if (!id || [...root.querySelectorAll('[data-ve-block-id]')].some(el => (el as HTMLElement).dataset.veBlockId === id)) continue;
  const kind = typeof block.kind === 'string' ? block.kind : 'card';
  const el = document.createElement(kind === 'section' ? 'section' : 'article');
  el.dataset.veBlockId = id;
  el.style.cssText = 'padding:24px;margin:16px 0;border:1px solid #8d7747;border-radius:10px;color:inherit;background:rgba(16,27,21,.96)';
  if (typeof block.title === 'string' && block.title) { const h = document.createElement(kind==='section'?'h2':'h3'); h.textContent=block.title; el.append(h); }
  if (kind === 'image' && typeof block.src === 'string' && (/^https:\/\//i.test(block.src)||block.src.startsWith('/'))) {
   const img=document.createElement('img');img.src=block.src;img.alt=typeof block.alt==='string'?block.alt:'';img.loading='lazy';img.style.cssText='max-width:100%;height:auto';el.append(img);
  }
  if (kind === 'link' && typeof block.href === 'string') {
   let href='#';try{const u=new URL(block.href,location.origin);if(['https:','http:','mailto:'].includes(u.protocol)||block.href.startsWith('#'))href=block.href;}catch{}
   const a=document.createElement('a');a.href=href;a.textContent=typeof block.title==='string'&&block.title?block.title:'Learn more';el.append(a);
  }
  if (typeof block.text === 'string' && block.text) { const p=document.createElement('p');p.textContent=block.text;p.style.whiteSpace='pre-wrap';el.append(p); }
  const after = typeof block.after === 'string' ? block.after : '';
  let target: Element|null=null;try{target=after?root.querySelector(after):null;}catch{}
  if (target?.parentElement) target.insertAdjacentElement('afterend',el); else main.append(el);
 }
}
