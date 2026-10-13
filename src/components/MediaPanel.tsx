import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, MediaUpload, MediaCategory } from '@/lib/supabase';
import {
  X, Upload, Trash2, Image as ImageIcon, Video, Loader2, Check, Gem, Folder, Plus,
} from 'lucide-react';

interface MediaPanelProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: 'hero', label: 'Hero / Banner' },
  { value: 'company', label: 'Company' },
  { value: 'deposits', label: 'Deposits' },
  { value: 'projects', label: 'Projects' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'contact', label: 'Contact' },
  { value: 'general', label: 'General' },
];

const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v', 'ogg', 'ogv', 'wmv', 'flv'];

const isVideoFile = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return file.type.startsWith('video/') || videoExtensions.includes(ext);
};

const normalizeFolderSlug = (value: string) => {
  const cleaned = value
    .trim()
    .replace(/\\/+/g, '/')
    .replace(/^\.+/, '')
    .replace(/[^a-zA-Z0-9._/-]/g, '-')
    .replace(/\/+/g, '/')
    .replace(/\/{2,}/g, '/');

  return cleaned.split('/').filter(Boolean).join('/').slice(0, 64) || '';
};

const deriveFolders = (rows: MediaUpload[], category: MediaCategory) => {
  const map = new Map<string, { path: string; count: number }>();

  rows
    .filter((row) => row.category === category)
    .forEach((row) => {
      const relative = row.storage_path.replace(`${category}/`, '');
      const idx = relative.lastIndexOf('/');
      const folderPath = idx >= 0 ? relative.slice(0, idx) : '';
      if (!folderPath) return;

      const existing = map.get(folderPath);
      map.set(folderPath, {
        path: `${category}/${folderPath}`,
        count: existing ? existing.count + 1 : 1,
      });
    });

  return Array.from(map.values()).sort((a, b) => a.path.localeCompare(b.path));
};

export default function MediaPanel({ open, onClose, onUploaded }: MediaPanelProps) {
  const [allMedia, setAllMedia] = useState<MediaUpload[]>([]);
  const [folders, setFolders] = useState<{ path: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('gallery');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [folderDraft, setFolderDraft] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media_uploads')
      .select('*')
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      setStatus({ type: 'error', msg: `Could not load media: ${error.message}` });
      return;
    }

    const rows = (data ?? []) as MediaUpload[];
    setAllMedia(rows);
    setFolders(deriveFolders(rows, uploadCategory));
  }, [uploadCategory]);

  useEffect(() => {
    if (!open) return;
    fetchAll();
  }, [open, fetchAll]);

  useEffect(() => {
    setFolders(deriveFolders(allMedia, uploadCategory));
    if (selectedFolder && !allMedia.some((row) => row.storage_path.startsWith(`${uploadCategory}/${selectedFolder}/`))) {
      setSelectedFolder('');
    }
  }, [allMedia, uploadCategory, selectedFolder]);

  const visibleMedia = allMedia.filter((item) => {
    if (item.category !== uploadCategory) return false;
    if (!selectedFolder) return true;
    return item.storage_path.startsWith(`${uploadCategory}/${selectedFolder}/`);
  });

  const handleCreateFolder = async () => {
    const cleaned = normalizeFolderSlug(folderDraft);
    if (!cleaned) {
      setStatus({ type: 'error', msg: 'Please enter a valid folder name.' });
      return;
    }

    const folderPath = `${uploadCategory}/${cleaned}/.keep`;

    setUploading(true);
    setStatus({ type: 'info', msg: `Creating folder "${cleaned}"…` });

    const { error } = await supabase.storage
      .from('media')
      .upload(folderPath, new Blob(['folder marker'], { type: 'text/plain' }), {
        cacheControl: '3600',
        upsert: true,
        contentType: 'text/plain',
      });

    setUploading(false);

    if (error) {
      setStatus({ type: 'error', msg: `Folder creation failed: ${error.message}` });
      return;
    }

    setFolderDraft('');
    setSelectedFolder(cleaned);
    setStatus({ type: 'success', msg: `Folder "${cleaned}" created successfully.` });
    await fetchAll();
    onUploaded();
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextFiles = Array.from(files);

    for (const file of nextFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setStatus({
          type: 'error',
          msg: `${file.name} is too large. Maximum size is 10MB.`,
        });
        continue;
      }

      const isVideo = isVideoFile(file);
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext ? `.${ext}` : ''}`;
      const folderPrefix = selectedFolder ? `${selectedFolder}/` : '';
      const filePath = `${uploadCategory}/${folderPrefix}${safeName}`;

      setUploading(true);
      setStatus({ type: 'info', msg: `Uploading ${file.name}…` });

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        setUploading(false);
        setStatus({
          type: 'error',
          msg: `Upload failed for ${file.name}: ${uploadError.message}. Check your storage bucket permissions and file conflicts.`,
        });
        continue;
      }

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('media_uploads').insert({
        title: uploadTitle || file.name.replace(/\.[^/.]+$/, ''),
        description: uploadDesc || null,
        media_type: isVideo ? 'video' : 'image',
        storage_path: filePath,
        public_url: urlData.publicUrl,
        category: uploadCategory,
        sort_order: 0,
        is_active: true,
      });

      setUploading(false);

      if (insertError) {
        setStatus({ type: 'error', msg: `Database insert failed: ${insertError.message}` });
        continue;
      }

      setStatus({ type: 'success', msg: `${file.name} uploaded successfully.` });
    }

    setUploadTitle('');
    setUploadDesc('');
    setFolderDraft('');
    await fetchAll();
    onUploaded();
  };

  const handleDelete = async (item: MediaUpload) => {
    const { error } = await supabase.storage.from('media').remove([item.storage_path]);
    if (error) {
      setStatus({ type: 'error', msg: `Delete failed: ${error.message}` });
      return;
    }

    const { error: dbError } = await supabase.from('media_uploads').delete().eq('id', item.id);
    if (dbError) {
      setStatus({ type: 'error', msg: `Database cleanup failed: ${dbError.message}` });
      return;
    }

    setStatus({ type: 'success', msg: 'Media deleted.' });
    await fetchAll();
    onUploaded();
  };

  const handleToggleActive = async (item: MediaUpload) => {
    const { error } = await supabase.from('media_uploads').update({ is_active: !item.is_active }).eq('id', item.id);

    if (error) {
      setStatus({ type: 'error', msg: `Visibility update failed: ${error.message}` });
      return;
    }

    setStatus({ type: 'success', msg: 'Visibility updated.' });
    await fetchAll();
    onUploaded();
  };

  if (!open) return null;

  return (
    <div
      className="media-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="media-modal">
        <div className="media-modal-header">
          <div>
            <h2>
              <Gem size={20} />
              Manage Media
            </h2>
            <p className="media-modal-sub">
              Upload your own photos and videos. They appear in the gallery alongside the Canva design pages.
            </p>
          </div>
          <button onClick={onClose} className="media-close" aria-label="Close media panel">
            <X size={22} />
          </button>
        </div>

        {status && (
          <div className={`media-status media-status-${status.type}`} role="status">
            {status.msg}
          </div>
        )}

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
                  onChange={(e) => {
                    const next = e.target.value as MediaCategory;
                    setUploadCategory(next);
                    setSelectedFolder('');
                  }}
                  className="media-input media-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="media-folder-box">
              <div className="media-folder-header">
                <span className="media-label">
                  <Folder size={14} />
                  Folder
                </span>
              </div>

              <div className="media-folder-toolbar">
                <div className="media-folder-list">
                  <button
                    className={`media-folder-button ${!selectedFolder ? 'active' : ''}`}
                    type="button"
                    onClick={() => setSelectedFolder('')}
                  >
                    Root
                  </button>

                  {folders.map((folder) => (
                    <button
                      key={folder.path}
                      type="button"
                      className={`media-folder-button ${selectedFolder === folder.path.replace(`${uploadCategory}/`, '') ? 'active' : ''}`}
                      onClick={() => setSelectedFolder(folder.path.replace(`${uploadCategory}/`, ''))}
                    >
                      {folder.path.replace(`${uploadCategory}/`, '')}
                      <span>({folder.count})</span>
                    </button>
                  ))}
                </div>

                <div className="media-folder-create">
                  <input
                    type="text"
                    value={folderDraft}
                    onChange={(e) => setFolderDraft(e.target.value)}
                    placeholder="New folder name"
                    className="media-input"
                  />
                  <button type="button" className="media-primary-btn" onClick={handleCreateFolder} disabled={uploading}>
                    <Plus size={14} />
                    Create folder
                  </button>
                </div>
              </div>

              <div className="media-folder-target">
                Upload target:
                <strong>{selectedFolder ? `${uploadCategory}/${selectedFolder}` : `${uploadCategory}/root`}</strong>
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="media-dropzone"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {uploading ? (
                <div className="media-dropzone-loading">
                  <Loader2 size={32} className="media-spin" />
                  <p>Uploading...</p>
                </div>
              ) : (
                <div className="media-dropzone-idle">
                  <Upload size={32} />
                  <p>
                    Drag &amp; drop or <span>click to browse</span>
                  </p>
                  <p className="media-dropzone-hint">Supports photos and videos up to 10MB each</p>
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
            <div className="media-loading">
              <Loader2 size={24} className="media-spin" />
            </div>
          ) : (
            <div className="media-list">
              {visibleMedia.length === 0 ? (
                <div className="media-empty">
                  <ImageIcon size={48} />
                  <p>
                    No uploads yet in this folder. Use the upload area above to add your photos and videos.
                  </p>
                </div>
              ) : (
                CATEGORIES.map((cat) => {
                  const items = visibleMedia.filter((m) => m.category === cat.value);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat.value} className="media-cat-group">
                      <h3 className="media-cat-title">
                        {cat.label} <span>({items.length})</span>
                      </h3>
                      <div className="media-cat-grid">
                        {items.map((item) => (
                          <div key={item.id} className="media-thumb">
                            <div className="media-thumb-media">
                              {item.media_type === 'video' ? (
                                <video src={item.public_url} muted className="media-thumb-video" />
                              ) : (
                                <img src={item.public_url} alt={item.title || 'Uploaded media'} className="media-thumb-img" />
                              )}
                              {item.media_type === 'video' && (
                                <div className="media-video-badge">
                                  <Video size={14} />
                                </div>
                              )}
                            </div>

                            <div className="media-thumb-hidden-badge">{!item.is_active && <span>Hidden</span>}</div>

                            <div className="media-thumb-overlay">
                              <div className="media-thumb-actions">
                                <button
                                  onClick={() => handleToggleActive(item)}
                                  className="media-thumb-btn"
                                  title={item.is_active ? 'Hide' : 'Show'}
                                  aria-label={item.is_active ? 'Hide media item' : 'Show media item'}
                                >
                                  {item.is_active ? <Check size={14} /> : <ImageIcon size={14} />}
                                </button>
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="media-thumb-btn media-thumb-delete"
                                  title="Delete"
                                  aria-label="Delete media item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <p className="media-thumb-name">{item.title || 'Untitled'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
