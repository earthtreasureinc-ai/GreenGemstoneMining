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

export const DEPOSITS = [
  { name: 'Gemstone Deposits', desc: 'Emeralds and high-value stones with a disciplined path from discovery to development.', img: `${IMG}/Gemstone_Deposits.webp`, tag: 'Precious' },
  { name: 'Rare Earth Deposits', desc: 'Strategic minerals positioned for the industries shaping a more connected future.', img: `${IMG}/Rare_Earth_Metal_Deposits.webp`, tag: 'Strategic' },
  { name: 'Industrial Metal Deposits', desc: 'Copper, gold, lithium, tantalum, chromite and lead, diversified across Somaliland.', img: `${IMG}/Industrial_Metal_Deposits.webp`, tag: 'Industrial' },
  { name: 'Non-Metal Deposits', desc: 'Practical resources supporting construction, manufacturing, and regional growth.', img: `${IMG}/Non-Metal_Deposits.webp`, tag: 'Industrial' },
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

export const GALLERY_GROUPS: GalleryGroup[] = ['Company', 'Deposits', 'Ore gallery', 'Gemstones', 'Field gallery', 'Contact', 'My uploads'];

const g = (file: string, label: string, group: GalleryGroup): GalleryItem => ({
  src: `${IMG}/${file}.webp`,
  label,
  group,
  type: 'image',
  width: 1366,
  height: 768,
});

export const GALLERY: GalleryItem[] = [
  g('1', 'Company overview', 'Company'),
  g('2', 'Navigation', 'Company'),
  g('Our_Awesome_History', 'Our history', 'Company'),
  g('Gemstone_Deposits', 'Gemstone deposits', 'Deposits'),
  g('Rare_Earth_Metal_Deposits', 'Rare earth deposits', 'Deposits'),
  g('Industrial_Metal_Deposits', 'Industrial metal deposits', 'Deposits'),
  g('Non-Metal_Deposits', 'Non-metal deposits', 'Deposits'),
  g('Beryllium_Ore_Gallery', 'Beryllium ore', 'Ore gallery'),
  g('Chromite_Ore_Gallery', 'Chromite ore', 'Ore gallery'),
  g('Copper_Ore_Gallery', 'Copper ore', 'Ore gallery'),
  g('Gold_Gallery', 'Gold', 'Ore gallery'),
  g('Lead_Ore_Gallery', 'Lead ore', 'Ore gallery'),
  g('Lithium_Ore_Gallery', 'Lithium ore', 'Ore gallery'),
  g('Mica_Muscovite_Gallery', 'Mica muscovite', 'Ore gallery'),
  g('Tantalum_Ore_Gallery', 'Tantalum ore', 'Ore gallery'),
  g('Gemstone_Gallery_1', 'Gemstone gallery 1', 'Gemstones'),
  g('Gemstone_Gallery_2', 'Gemstone gallery 2', 'Gemstones'),
  g('Gemstone_Gallery_3', 'Gemstone gallery 3', 'Gemstones'),
  g('Our_Gallery_5', 'Field gallery', 'Field gallery'),
  g('Contact_Us', 'Contact us', 'Contact'),
  g('Thank_You', 'Thank you', 'Contact'),
];

export const IMAGES = {
  company: `${IMG}/company-field.webp`,
  split: `${IMG}/Industrial_Metal_Deposits.webp`,
  contact: `${IMG}/Contact_Us.webp`,
};
