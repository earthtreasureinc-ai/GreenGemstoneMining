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
 getPublishedPayload():Promise<Record<string,unknown>|null>;
}
declare global { interface Window { __GGMC_EDITOR_API__?:VisualEditorBridge } }
async function adminClient(){
 const sb=await getSupabase(); if(!sb)throw new Error('Supabase is not configured for this preview deployment.');
 const {data:{session}}=await sb.auth.getSession(); if(!session)throw new Error('Sign in with your owner account first.');
 const {data,error}=await sb.rpc('is_admin'); if(error||data!==true)throw new Error('This account is not authorised to manage the website.');
 return sb;
}
export function installVisualEditorBridge(){
 window.__GGMC_EDITOR_API__={
  async getSession(){const sb=await getSupabase();if(!sb)return {email:null,isAdmin:false};const {data:{session}}=await sb.auth.getSession();if(!session)return {email:null,isAdmin:false};const {data}=await sb.rpc('is_admin');return {email:session.user.email??null,isAdmin:data===true};},
  async signIn(email,password){const sb=await getSupabase();if(!sb)throw new Error('Supabase is not configured for this preview deployment.');const {error}=await sb.auth.signInWithPassword({email,password});if(error)throw new Error('Sign-in failed. Check your credentials.');const {data}=await sb.rpc('is_admin');if(data!==true){await sb.auth.signOut();throw new Error('This account is not authorised to manage the website.');}},
  async signOut(){const sb=await getSupabase();await sb?.auth.signOut();},
  async listDrafts(){const sb=await adminClient();const {data,error}=await sb.rpc('list_visual_editor_drafts');if(error)throw error;return (data??[]) as VisualEditorServerDraft[];},
  async saveDraft(input){const sb=await adminClient();const {data,error}=await sb.rpc('save_visual_editor_draft',{p_draft_id:input.id,p_expected_version:input.expectedVersion,p_name:input.name,p_payload:input.payload});if(error)throw error;return data as VisualEditorServerDraft;},
  async publishDraft(id,expectedVersion){const sb=await adminClient();const {data,error}=await sb.rpc('publish_visual_editor_draft',{p_draft_id:id,p_expected_version:expectedVersion});if(error)throw error;return data as VisualEditorServerDraft;},
  async listVersions(id){const sb=await adminClient();const {data,error}=await sb.rpc('list_visual_editor_versions',{p_draft_id:id});if(error)throw error;return (data??[]) as VisualEditorServerVersion[];},
  async getPublishedPayload(){const sb=await getSupabase();if(!sb)return null;const {data,error}=await sb.rpc('get_published_visual_editor_payload');if(error)throw error;return (data??null) as Record<string,unknown>|null;}
 };
}
