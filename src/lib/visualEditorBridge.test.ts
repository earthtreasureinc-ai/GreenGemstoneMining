// @vitest-environment jsdom
import { beforeEach,describe,expect,it,vi } from 'vitest';
const mocks=vi.hoisted(()=>({getSession:vi.fn(),signInWithPassword:vi.fn(),signOut:vi.fn(),rpc:vi.fn()}));
vi.mock('@/lib/supabase',()=>({getSupabase:vi.fn(async()=>({auth:{getSession:mocks.getSession,signInWithPassword:mocks.signInWithPassword,signOut:mocks.signOut},rpc:mocks.rpc}))}));
import {installVisualEditorBridge} from './visualEditorBridge';
describe('visual editor server bridge',()=>{
 beforeEach(()=>{vi.clearAllMocks();installVisualEditorBridge();});
 it('exposes expected server operations without privileged keys',()=>{expect(window.__GGMC_EDITOR_API__).toBeDefined();expect(Object.keys(window.__GGMC_EDITOR_API__??{})).toEqual(expect.arrayContaining(['saveDraft','publishDraft','listDrafts','listVersions','restoreVersion']));expect(JSON.stringify(window.__GGMC_EDITOR_API__)).not.toMatch(/service.role|secret.key/i);});
 it('rejects unauthenticated access',async()=>{mocks.getSession.mockResolvedValueOnce({data:{session:null}});await expect(window.__GGMC_EDITOR_API__!.listDrafts()).rejects.toThrow('Sign in');});
 it('rejects non-admin sessions',async()=>{mocks.getSession.mockResolvedValueOnce({data:{session:{user:{email:'visitor@example.com'}}}});mocks.rpc.mockResolvedValueOnce({data:false,error:null});await expect(window.__GGMC_EDITOR_API__!.listDrafts()).rejects.toThrow('not authorised');});
 it('uses expected version for conflict-safe saves',async()=>{mocks.getSession.mockResolvedValueOnce({data:{session:{user:{email:'owner@example.com'}}}});mocks.rpc.mockResolvedValueOnce({data:true,error:null});mocks.rpc.mockResolvedValueOnce({data:{id:'draft-id',version:2,status:'draft'},error:null});const saved=await window.__GGMC_EDITOR_API__!.saveDraft({id:'draft-id',expectedVersion:1,name:'Website draft',payload:{text:{}}});expect(saved.version).toBe(2);expect(mocks.rpc).toHaveBeenLastCalledWith('save_visual_editor_draft',expect.objectContaining({p_expected_version:1}));});
 it('restores a selected server version into a new draft',async()=>{mocks.getSession.mockResolvedValueOnce({data:{session:{user:{email:'owner@example.com'}}}});mocks.rpc.mockResolvedValueOnce({data:true,error:null});mocks.rpc.mockResolvedValueOnce({data:{id:'restored-id',version:1,status:'draft',payload:{text:{}}},error:null});const restored=await window.__GGMC_EDITOR_API__!.restoreVersion('draft-id',3);expect(restored.id).toBe('restored-id');expect(mocks.rpc).toHaveBeenLastCalledWith('restore_visual_editor_version',{p_draft_id:'draft-id',p_version:3});});
});
