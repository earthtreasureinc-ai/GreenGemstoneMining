export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Mirrors the bucket's allowed_mime_types in the security migration. SVG is intentionally excluded. */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const;

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'm4v'];

export const getExtension = (name: string): string => {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
};

export const isVideoName = (name: string, mime = ''): boolean =>
  mime.startsWith('video/') || VIDEO_EXTENSIONS.includes(getExtension(name));

export const isAllowedMime = (mime: string): boolean =>
  (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
};

/**
 * Turns user input into a safe storage folder path:
 * letters, digits, dot, dash, underscore and single slashes only; no leading dots; max 64 chars.
 */
export const normalizeFolderSlug = (value: string): string => {
  const cleaned = value
    .trim()
    .replace(/\\+/g, '/')
    .replace(/[^a-zA-Z0-9._/-]/g, '-')
    .replace(/\/{2,}/g, '/');

  return cleaned
    .split('/')
    .map((part) => part.replace(/^\.+/, ''))
    .filter((part) => part.length > 0 && part !== '..')
    .join('/')
    .slice(0, 64);
};

/** Folder shown to visitors for an upload at `category/folder/file.ext`. */
export const getUploadFolderName = (storagePath?: string | null): string => {
  if (!storagePath) return 'General';
  const parts = storagePath.split('/').filter(Boolean);
  if (parts.length <= 2) return 'General';
  return parts.slice(1, -1).join('/') || 'General';
};

export type GalleryGroup =
  | 'Company'
  | 'Deposits'
  | 'Ore gallery'
  | 'Gemstones'
  | 'Field gallery'
  | 'Contact'
  | 'My uploads';

export type GalleryFilter = 'All' | GalleryGroup;

export interface GalleryItem {
  src: string;
  label: string;
  group: GalleryGroup;
  type: 'image' | 'video';
  width: number;
  height: number;
  folder?: string;
}

export const matchesGalleryFilter = (item: GalleryItem, filter: GalleryFilter): boolean =>
  filter === 'All' || item.group === filter;
