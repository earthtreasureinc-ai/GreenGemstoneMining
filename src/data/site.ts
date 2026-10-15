import type { GalleryItem, GalleryGroup } from '@/lib/media';

const IMG = '/assets/images';

export const SITE = {
  name: 'Green Gemstone Mining Company',
  email: 'greengemstonemining@gmail.com',
  address: 'Omar Hashi Building, 4th Floor, Hargeisa, Somaliland',
  linkedin: '' as string, // TODO(owner): add the real LinkedIn company URL; the link is hidden while empty.
};

export const NAV = [
  { label: 'Overview', href: '#top' },
  { label: 'Company', href: '#company' },
  { label: 'Portfolio', href: '#resources' },
  { label: 'Projects', href: '#projects' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export const DEPOSITS: { name: string; desc: string; tone: string; icon: 'gem' | 'atom' | 'hammer' | 'mountain'; tag: string }[] = [
  { name: 'Gemstone Deposits', desc: 'Emeralds and high-value stones with a disciplined path from discovery to development.', tone: 'emerald', icon: 'gem', tag: 'Precious' },
  { name: 'Rare Earth Deposits', desc: 'Strategic minerals positioned for the industries shaping a more connected future.', tone: 'violet', icon: 'atom', tag: 'Strategic' },
  { name: 'Industrial Metal Deposits', desc: 'Copper, gold, lithium, tantalum, chromite and lead, diversified across Somaliland.', tone: 'copper', icon: 'hammer', tag: 'Industrial' },
  { name: 'Non-Metal Deposits', desc: 'Practical resources supporting construction, manufacturing, and regional growth.', tone: 'slate', icon: 'mountain', tag: 'Industrial' },
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

export const HERO_METRICS = [
  { value: '6', label: 'Regions of interest' },
  { value: '12', label: 'Mineral verticals' },
  { value: '2018', label: 'Founded' },
  { value: 'Global', label: 'Partnership focus' },
];

export const TIMELINE = [
  { year: '2018', title: 'Founded', desc: 'Initial investment and first geological survey in Somaliland.' },
  { year: '2020', title: 'First project', desc: 'First mining project launched.' },
  { year: '2022', title: 'Emerald deposit', desc: 'Reached an emerald deposit and expanded exploration.' },
  { year: '2025', title: 'Gold processing', desc: 'Gold processing plant received.' },
];

export const MARQUEE = ['Responsible', 'Locally rooted', 'Globally ambitious', 'Resource focused', 'Partnership driven', 'Built to last'];

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
