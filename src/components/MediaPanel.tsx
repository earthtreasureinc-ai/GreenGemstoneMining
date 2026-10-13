import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, MediaUpload, MediaCategory } from '@/lib/supabase';
import { X, Upload, Trash2, Image as ImageIcon, Video, Loader2, Check, Gem } from 'lucide-react';

interface MediaPanelProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: 'hero', label: 'Hero / Banner' },
  { value: 'company', label: 'Company' },
  { value: 'deposits', label: 'Deposits' },
  { value: 'projects', label: 'Projects' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'contact', label: 'Contact' },
  { value: 'general', label: 'General' },
];

export default function MediaPanel({ open, onClose, onUploaded }: MediaPanelProps) {
  const [allMedia, setAllMedia] = useState<MediaUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [folderCreating, setFolderCreating] = useState(false);
  const [folderStatus, setFolderStatus] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('gallery');
  const [uploadSubfolder, setUploadSubfolder] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media_uploads')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAllMedia(data as MediaUpload[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  const handleCreateFolder = useCallback(async () => {
    const rawSub = (uploadSubfolder || '').trim().replace(/^\/+|\/+$/g, '');
    const safeSub = rawSub ? rawSub.replace(/[^a-zA-Z0-9\-_.\/]/g, '').replace(/\/+/g, '/') : '';

    if (!safeSub) {
      setFolderStatus('Enter a folder name first');
      return;
    }

    setFolderCreating(true);
    setFolderStatus(null);

    try {
      const folderPath = `${uploadCategory}/${safeSub}`;
      const placeholder = new File([''], '.keep', { type: 'text/plain' });
      const { error } = await supabase.storage
        .from('media')
        .upload(`${folderPath}/.keep`, placeholder, { cacheControl: '3600', upsert: true });

      if (error) {
        setFolderStatus(`Could not create folder: ${error.message}`);
      } else {
        setFolderStatus(`Created folder: ${safeSub}`);
      }
    } finally {
      setFolderCreating(false);
      onUploaded();
      fetchAll();
    }
  }, [fetchAll, onUploaded, uploadCategory, uploadSubfolder]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v', 'ogg', 'ogv', 'wmv', 'flv'];
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const isVideo = file.type.startsWith('video/') || videoExtensions.includes(ext);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      const rawSub = (uploadSubfolder || '').trim().replace(/^\/+|\/+$/g, '');
      const safeSub = rawSub ? rawSub.replace(/[^a-zA-Z0-9\-_.\/]/g, '').replace(/\/+/g, '/') : '';
      const filePath = safeSub ? `${uploadCategory}/${safeSub}/${fileName}` : `${uploadCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);

      await supabase.from('media_uploads').insert({
        title: uploadTitle || file.name.replace(/\.[^/.]+$/, ''),
        description: uploadDesc || null,
        media_type: isVideo ? 'video' : 'image',
        storage_path: filePath,
        public_url: urlData.publicUrl,
        category: uploadCategory,
        sort_order: 0,
        is_active: true,
      });
    }

    setUploadTitle('');
    setUploadDesc('');
    setUploadSubfolder('');
    setUploading(false);
    fetchAll();
    onUploaded();
  };

  const handleDelete = async (item: MediaUpload) => {
    await supabase.storage.from('media').remove([item.storage_path]);
    await supabase.from('media_uploads').delete().eq('id', item.id);
    fetchAll();
    onUploaded();
  };

  const handleToggleActive = async (item: MediaUpload) => {
    await supabase
      .from('media_uploads')
      .update({ is_active: !item.is_active })
      .eq('id', item.id);
    fetchAll();
    onUploaded();
  };

  const mediaByCategory = (cat: MediaCategory) => allMedia.filter((m) => m.category === cat);

  if (!open) return null;

  return (
    <div className="media-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="media-modal">
        <div className="media-modal-header">
          <div>
            <h2><Gem size={20} /> Manage Media</h2>
            <p className="media-modal-sub">Upload your own photos and videos. They appear in the gallery alongside the Canva design pages.</p>
          </div>
          <button onClick={onClose} className="media-close" aria-label="Close"><X size={22} /></button>
        </div>

        <div className="media-modal-body">
          <div className="media-upload-section">
            <div className="media-upload-fields">
              <div>
                <label className="media-label">Title (optional)</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Emerald excavation site"
                  className="media-input"
                />
              </div>
              <div>
                <label className="media-label">Description (optional)</label>
                <input
                  type="text"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="e.g. Field work in Sanaag region"
                  className="media-input"
                />
              </div>
              <div>
                <label className="media-label">Where should it appear?</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as MediaCategory)}
                  className="media-input media-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="media-label">Subfolder (optional)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={uploadSubfolder}
                    onChange={(e) => setUploadSubfolder(e.target.value)}
                    placeholder="e.g. photos or videos/2026"
                    className="media-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateFolder}
                    className="media-thumb-btn"
                    title="Create folder"
                    disabled={folderCreating}
                    style={{ minWidth: '110px' }}
                  >
                    {folderCreating ? 'Creating...' : 'Create folder'}
                  </button>
                </div>
                {folderStatus && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: '#d7c38a' }}>{folderStatus}</p>
                )}
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className="media-dropzone"
            >
              {uploading ? (
                <div className="media-dropzone-loading">
                  <Loader2 size={32} className="media-spin" />
                  <p>Uploading...</p>
                </div>
              ) : (
                <div className="media-dropzone-idle">
                  <Upload size={32} />
                  <p>Drag &amp; drop or <span>click to browse</span></p>
                  <p className="media-dropzone-hint">Supports photos and videos</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="media-file-hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </div>
          </div>

          {loading ? (
            <div className="media-loading"><Loader2 size={24} className="media-spin" /></div>
          ) : (
            <div className="media-list">
              {CATEGORIES.map((cat) => {
                const items = mediaByCategory(cat.value);
                if (items.length === 0) return null;
                return (
                  <div key={cat.value} className="media-cat-group">
                    <h3 className="media-cat-title">{cat.label} <span>({items.length})</span></h3>
                    <div className="media-cat-grid">
                      {items.map((item) => (
                        <div key={item.id} className="media-thumb">
                          <div className="media-thumb-media">
                            {item.media_type === 'video' ? (
                              <video src={item.public_url} muted className="media-thumb-video" />
                            ) : (
                              <img src={item.public_url} alt={item.title} className="media-thumb-img" />
                            )}
                            {item.media_type === 'video' && (
                              <div className="media-video-badge"><Video size={14} /></div>
                            )}
                          </div>
                          <div className="media-thumb-hidden-badge">{!item.is_active && <span>Hidden</span>}</div>
                          <div className="media-thumb-overlay">
                            <div className="media-thumb-actions">
                              <button
                                onClick={() => handleToggleActive(item)}
                                className="media-thumb-btn"
                                title={item.is_active ? 'Hide' : 'Show'}
                              >
                                {item.is_active ? <Check size={14} /> : <ImageIcon size={14} />}
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="media-thumb-btn media-thumb-delete"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="media-thumb-name">{item.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {allMedia.length === 0 && (
                <div className="media-empty">
                  <ImageIcon size={48} />
                  <p>No uploads yet. Use the area above to add your photos and videos.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
