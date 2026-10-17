/**
 * Recorded mineral occurrences and the public sources behind them.
 * Positions are indicative (town or district level), not surveyed coordinates.
 * Research notes: docs/somaliland-minerals-research.md. Marker regions are checked against the map polygons in a unit test.
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
  { id: 'zeilaSalt', region: 'awdal', kind: 'industrial', lon: 43.45, lat: 11.15 },
  { id: 'dhagaxKuure', region: 'maroodiJeex', kind: 'metal', lon: 43.5, lat: 9.78 },
  { id: 'darkainle', region: 'awdal', kind: 'metal', lon: 43.28, lat: 10.4 },
  { id: 'hargeisaWest', region: 'maroodiJeex', kind: 'gem', lon: 43.85, lat: 9.57 },
  { id: 'berbera', region: 'sahil', kind: 'industrial', lon: 45.0, lat: 10.4 },
  { id: 'daban', region: 'sahil', kind: 'energy', lon: 45.2, lat: 10.3 },
  { id: 'lafaruug', region: 'sahil', kind: 'gem', lon: 44.6, lat: 10.02 },
  { id: 'togdheerJade', region: 'togdheer', kind: 'gem', lon: 45.45, lat: 9.62 },
  { id: 'laasaSurad', region: 'sanaag', kind: 'metal', lon: 46.95, lat: 10.55 },
  { id: 'dalan', region: 'sanaag', kind: 'metal', lon: 48.82, lat: 11.08 },
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
  { label: 'British Geological Survey: Somaliland Protectorate colonial surveys 1947-1956', url: 'https://earthwise.bgs.ac.uk/index.php/Somaliland_Protectorate_%E2%80%94_Colonial_Geological_Surveys_1947%E2%80%931956' },
  { label: 'Minerals of Somalia: from exploration to artisanal production to export (Hussein, 2013)', url: 'https://www.academia.edu/15289231/Minerals_of_Somalia_From_exploration_to_artisanal_production_to_export' },
  { label: 'Somaliland Chronicle: Kilomass lithium exploration deal (2024)', url: 'https://somalilandchronicle.com/2024/06/11/saudi-mining-company-kilomass-secures-lithium-exploration-deal-in-somaliland/' },
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
