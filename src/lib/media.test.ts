import { describe, expect, it } from 'vitest';
import {
  formatBytes,
  getUploadFolderName,
  isAllowedMime,
  isVideoName,
  matchesGalleryFilter,
  normalizeFolderSlug,
  type GalleryItem,
} from './media';

describe('normalizeFolderSlug', () => {
  it('keeps simple names', () => {
    expect(normalizeFolderSlug('Emerald Site 1')).toBe('Emerald-Site-1');
  });
  it('converts backslashes and collapses repeated slashes', () => {
    expect(normalizeFolderSlug('a\\\\b//c')).toBe('a/b/c');
  });
  it('strips leading dots and parent references', () => {
    expect(normalizeFolderSlug('../secret')).toBe('secret');
    expect(normalizeFolderSlug('.hidden/ok')).toBe('hidden/ok');
    expect(normalizeFolderSlug('a/../b')).toBe('a/b');
  });
  it('limits length and returns empty for junk', () => {
    expect(normalizeFolderSlug('x'.repeat(100))).toHaveLength(64);
    expect(normalizeFolderSlug('   ')).toBe('');
    expect(normalizeFolderSlug('...')).toBe('');
  });
});

describe('getUploadFolderName', () => {
  it('returns General for files directly under a category', () => {
    expect(getUploadFolderName('gallery/file.jpg')).toBe('General');
    expect(getUploadFolderName(null)).toBe('General');
  });
  it('returns nested folder path', () => {
    expect(getUploadFolderName('gallery/site-a/2026/file.jpg')).toBe('site-a/2026');
  });
});

describe('file helpers', () => {
  it('detects videos by mime or extension', () => {
    expect(isVideoName('clip.MP4')).toBe(true);
    expect(isVideoName('x', 'video/webm')).toBe(true);
    expect(isVideoName('photo.jpg', 'image/jpeg')).toBe(false);
  });
  it('rejects svg and unknown types', () => {
    expect(isAllowedMime('image/svg+xml')).toBe(false);
    expect(isAllowedMime('application/pdf')).toBe(false);
    expect(isAllowedMime('image/webp')).toBe(true);
  });
  it('formats bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(10 * 1024 * 1024)).toBe('10 MB');
  });
});

describe('matchesGalleryFilter', () => {
  const item: GalleryItem = {
    src: '/a.webp',
    label: 'A',
    group: 'Deposits',
    type: 'image',
    width: 1,
    height: 1,
  };
  it('All matches everything', () => expect(matchesGalleryFilter(item, 'All')).toBe(true));
  it('matches its own group only', () => {
    expect(matchesGalleryFilter(item, 'Deposits')).toBe(true);
    expect(matchesGalleryFilter(item, 'Company')).toBe(false);
  });
});
