/** Map projection used by scripts/build-map-data.py (equirectangular, 150 px per degree of latitude). */
const K = 150;
const COS = 0.9854; // cos of the mid latitude
const MIN_LON = 42.647;
const MAX_LAT = 11.4987;
const PAD = 18;

export const project = (lon: number, lat: number): [number, number] => [(lon - MIN_LON) * COS * K + PAD, (MAX_LAT - lat) * K + PAD];
export const unproject = (x: number, y: number): { lon: number; lat: number } => ({
  lon: (x - PAD) / (COS * K) + MIN_LON,
  lat: MAX_LAT - (y - PAD) / K,
});
/** Pixels in the map for 100 km. */
export const KM100 = (K / 111.2) * 100;
