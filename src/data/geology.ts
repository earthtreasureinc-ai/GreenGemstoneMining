/**
 * Recorded mineral occurrences and the public sources behind them.
 * Positions are indicative (town or district level), not surveyed coordinates.
 * Research notes: docs/somaliland-minerals-research.md
 */
export type OccurrenceKind = 'gem' | 'metal' | 'industrial' | 'energy';

export interface Occurrence {
  id: string;
  region: string;
  kind: OccurrenceKind;
  lon: number;
  lat: number;
}

export const OCCURRENCES: Occurrence[] = [
  { id: 'borama', region: 'awdal', kind: 'gem', lon: 43.18, lat: 9.94 },
  { id: 'abdiqadir', region: 'awdal', kind: 'metal', lon: 43.1, lat: 10.25 },
  { id: 'dhagaxKuure', region: 'maroodiJeex', kind: 'metal', lon: 43.55, lat: 10.0 },
  { id: 'hargeisaWest', region: 'maroodiJeex', kind: 'gem', lon: 43.85, lat: 9.57 },
  { id: 'berbera', region: 'sahil', kind: 'industrial', lon: 45.0, lat: 10.4 },
  { id: 'daban', region: 'sahil', kind: 'energy', lon: 45.3, lat: 10.15 },
  { id: 'togdheerJade', region: 'togdheer', kind: 'gem', lon: 45.45, lat: 9.62 },
  { id: 'laasaSurad', region: 'sanaag', kind: 'metal', lon: 46.95, lat: 10.55 },
  { id: 'dalan', region: 'sanaag', kind: 'metal', lon: 48.1, lat: 10.8 },
  { id: 'nugaal', region: 'sool', kind: 'energy', lon: 48.3, lat: 8.9 },
];

/** How much public data exists for each region. */
export const EVIDENCE: Record<string, 'strong' | 'partial' | 'limited'> = {
  awdal: 'strong',
  maroodiJeex: 'strong',
  sahil: 'strong',
  togdheer: 'partial',
  sanaag: 'partial',
  sool: 'limited',
};

export const SOURCES: { label: string; url: string }[] = [
  { label: 'Untapped Mineral Potential of Somaliland: A review (IJISRT, 2024)', url: 'https://ijisrt.com/assets/upload/files/IJISRT24OCT050.pdf' },
  { label: 'Somaliland Ministry of Energy and Minerals: exploration and mining', url: 'https://moem-sl.com/mining/' },
  { label: 'Republic of Somaliland Representative Office, Taiwan: investment', url: 'https://somaliland.tw/investment/' },
  { label: 'Gem-A Journal (1999): gemstones of Somaliland', url: 'https://gem-a.com/wp-content/uploads/2023/10/GJ1999_8_4.pdf' },
  { label: 'USGS Minerals Yearbook 2017-18: Somalia', url: 'https://pubs.usgs.gov/myb/vol3/2017-18/myb3-2017-18-somalia.pdf' },
  { label: 'Geology and coal potential of Somaliland', url: 'https://somalilandeconomic.com/geology-and-coal-potential-of-somaliland/' },
  { label: 'African Mining Online (2023): Somaliland overview', url: 'https://www.africanmining.co.za/2023/05/01/the-mysterious-horn-of-africa-somalia-somaliland-and-puntland/' },
  { label: 'Mindat: Borama locality', url: 'https://zh.mindat.org/loc-109651.html' },
  { label: 'Wikipedia: Geology of Somaliland', url: 'https://en.wikipedia.org/wiki/Geology_of_Somaliland' },
];
