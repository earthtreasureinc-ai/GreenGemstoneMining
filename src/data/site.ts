import type { GalleryItem, GalleryGroup } from '@/lib/media';

const IMG = '/assets/images';

export const SITE = {
  name: 'Green Gemstone Mining Company',
  email: 'greengemstonemining@gmail.com',
  linkedin: '' as string, // TODO(owner): add the real LinkedIn company URL; the link is hidden while empty.
};

/** Visual identity per deposit card; the words live in src/i18n/*.ts (same order). */
export const DEPOSITS: { tone: string; icon: 'gem' | 'atom' | 'hammer' | 'mountain' }[] = [
  { tone: 'emerald', icon: 'gem' },
  { tone: 'violet', icon: 'atom' },
  { tone: 'copper', icon: 'hammer' },
  { tone: 'slate', icon: 'mountain' },
];

export const MINERALS = [
  { name: 'Emerald', cat: 'Gemstone' },
  { name: 'Beryllium', cat: 'Metal' },
  { name: 'Chromite', cat: 'Metal' },
  { name: 'Copper', cat: 'Metal' },
  { name: 'Gold', cat: 'Precious' },
  { name: 'Lead', cat: 'Metal' },
  { name: 'Lithium', cat: 'Metal' },
  { name: 'Mica muscovite', cat: 'Non-metal' },
  { name: 'Tantalum', cat: 'Metal' },
  { name: 'Tin', cat: 'Metal' },
  { name: 'Tungsten', cat: 'Metal' },
  { name: 'Uranium', cat: 'Metal' },
];

/** Schematic only: positions are illustrative, not geographic boundaries. */
export const REGIONS = [
  { name: 'Awdal', x: 80, y: 120, w: 140, h: 90 },
  { name: 'Maroodi Jeex', x: 230, y: 140, w: 110, h: 70 },
  { name: 'Saaxil', x: 200, y: 220, w: 140, h: 80 },
  { name: 'Togdheer', x: 340, y: 100, w: 130, h: 90 },
  { name: 'Sanaag', x: 480, y: 90, w: 160, h: 110 },
  { name: 'Sool', x: 440, y: 210, w: 140, h: 80 },
];

/** Years only; titles and descriptions live in src/i18n/*.ts (same order). */
export const TIMELINE = [{ year: '2018' }, { year: '2020' }, { year: '2022' }, { year: '2025' }];

export const GALLERY_GROUPS: GalleryGroup[] = ['Company', 'Ore gallery', 'Gemstones', 'Field gallery', 'My uploads'];

const g = (file: string, label: string, group: GalleryGroup): GalleryItem => ({
  src: `${IMG}/${file}.webp`,
  label,
  group,
  type: 'image',
  width: 1366,
  height: 768,
});

/** Only real sample collages and the company history. Presentation text slides are not shown as photos. */
export const GALLERY: GalleryItem[] = [
  g('Our_Awesome_History', 'Our history', 'Company'),
  g('Gold_Gallery', 'Gold samples', 'Ore gallery'),
  g('Copper_Ore_Gallery', 'Copper ore samples', 'Ore gallery'),
  g('Lithium_Ore_Gallery', 'Lithium ore samples', 'Ore gallery'),
  g('Tantalum_Ore_Gallery', 'Tantalum ore samples', 'Ore gallery'),
  g('Chromite_Ore_Gallery', 'Chromite ore samples', 'Ore gallery'),
  g('Beryllium_Ore_Gallery', 'Beryllium ore samples', 'Ore gallery'),
  g('Lead_Ore_Gallery', 'Lead ore samples', 'Ore gallery'),
  g('Mica_Muscovite_Gallery', 'Mica muscovite samples', 'Ore gallery'),
  g('Gemstone_Gallery_1', 'Gemstone samples 1', 'Gemstones'),
  g('Gemstone_Gallery_2', 'Gemstone samples 2', 'Gemstones'),
  g('Gemstone_Gallery_3', 'Gemstone samples 3', 'Gemstones'),
  g('Our_Gallery_5', 'Sample records and testing', 'Field gallery'),
];

export const IMAGES = {
  company: `${IMG}/company-field.webp`,
};
