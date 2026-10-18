// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SomalilandMap from '@/components/SomalilandMap';
import { REGIONS } from '@/data/site';
import { MAP_REGIONS } from '@/data/mapData';
import { OCCURRENCES } from '@/data/geology';
import { project } from '@/data/geoProject';
import { LOCALITIES, MINERAL_GROUP, mineralsInRegion, recordsFor } from '@/data/minerals';
import { FINDER, KNOWN_MINERALS, mineralName } from '@/data/mineralText';
import en from '@/i18n/en';
import so from '@/i18n/so';
import ar from '@/i18n/ar';
import zh from '@/i18n/zh';

afterEach(cleanup);

describe('SomalilandMap', () => {
  it('has map data and text for every region in every language', () => {
    for (const r of REGIONS) {
      expect(MAP_REGIONS[r.key]?.d.length).toBeGreaterThan(50);
      for (const dict of [en, so, ar, zh]) {
        const region = dict.projects.regions[r.id];
        expect(region.name).toBeTruthy();
        expect(region.role).toBeTruthy();
        expect(region.geology).toBeTruthy();
      }
    }
    for (const dict of [so, ar, zh]) {
      expect(Object.keys(dict.projects.zones)).toEqual(Object.keys(en.projects.zones));
    }
  });

  it('shows details for the selected region and lets the visitor change it', () => {
    render(<SomalilandMap />);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Awdal');
    fireEvent.click(screen.getAllByRole('button', { name: 'Sanaag' })[0]);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Sanaag');
    expect(screen.getAllByRole('button', { name: 'Sanaag' }).every((b) => b.getAttribute('aria-pressed') === 'true')).toBe(true);
  });

  it('has text for every occurrence marker in every language and keeps them inside their region data', () => {
    for (const o of OCCURRENCES) {
      expect(REGIONS.some((r) => r.id === o.region)).toBe(true);
      for (const dict of [en, so, ar, zh]) {
        expect(dict.projects.occurrences[o.id].name).toBeTruthy();
        expect(dict.projects.occurrences[o.id].text).toBeTruthy();
      }
    }
  });

  it('places every marker inside the polygon of the region it belongs to', () => {
    const rings = (d: string) => d.split('M').slice(1).map((sub) => sub.split('L').map((q) => q.replace('Z', '').trim().split(' ').map(Number) as [number, number]));
    const inside = (pt: [number, number], ring: [number, number][]) => {
      let c = false;
      for (let i = 0; i < ring.length; i++) {
        const [x1, y1] = ring[i];
        const [x2, y2] = ring[(i + 1) % ring.length];
        if (y1 > pt[1] !== y2 > pt[1] && pt[0] < ((x2 - x1) * (pt[1] - y1)) / (y2 - y1) + x1) c = !c;
      }
      return c;
    };
    for (const o of OCCURRENCES) {
      const key = REGIONS.find((r) => r.id === o.region)!.key;
      const pt = project(o.lon, o.lat);
      expect(rings(MAP_REGIONS[key].d).some((ring) => inside(pt, ring)), `${o.id} should be inside ${key}`).toBe(true);
    }
  });

  it('shows the recorded occurrences of the selected region and lets a marker select its region', () => {
    render(<SomalilandMap />);
    fireEvent.click(document.querySelector('g[aria-label^="Dalan and Assilih tin"]') as SVGGElement);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Sanaag');
    expect(screen.getAllByText(/Cassiterite and tin-tantalum/).length).toBeGreaterThan(0);
  });

  it('switches between the regions and geology layers', () => {
    render(<SomalilandMap />);
    const geology = screen.getByRole('button', { name: 'Geology' });
    expect(geology.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(geology);
    expect(geology.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Crystalline basement')).toBeTruthy();
  });

  it('is keyboard accessible', () => {
    render(<SomalilandMap />);
    const sool = document.querySelector('g[aria-label="Sool"]') as SVGGElement;
    fireEvent.keyDown(sool, { key: 'Enter' });
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Sool');
  });

  it('names every recorded mineral in every language and gives each record a source', () => {
    const used = new Set(LOCALITIES.flatMap((l) => l.minerals));
    for (const m of used) {
      expect(MINERAL_GROUP[m], m).toBeTruthy();
      expect(KNOWN_MINERALS).toContain(m);
      for (const lang of ['en', 'so', 'ar', 'zh'] as const) expect(mineralName(m, lang)).toBeTruthy();
    }
    for (const l of LOCALITIES) {
      expect(l.source).toBeTruthy();
      if (l.precision === 'point') expect(l.lon && l.lat).toBeTruthy();
    }
    for (const lang of ['so', 'ar', 'zh'] as const) expect(Object.keys(FINDER[lang].basis)).toEqual(Object.keys(FINDER.en.basis));
  });

  it('puts every mapped USGS site that belongs to a region inside that region', () => {
    const rings = (d: string) => d.split('M').slice(1).map((sub) => sub.split('L').map((q) => q.replace('Z', '').trim().split(' ').map(Number) as [number, number]));
    const inside = (pt: [number, number], ring: [number, number][]) => {
      let c = false;
      for (let i = 0; i < ring.length; i++) {
        const [x1, y1] = ring[i];
        const [x2, y2] = ring[(i + 1) % ring.length];
        if (y1 > pt[1] !== y2 > pt[1] && pt[0] < ((x2 - x1) * (pt[1] - y1)) / (y2 - y1) + x1) c = !c;
      }
      return c;
    };
    let near = 0;
    for (const l of LOCALITIES.filter((x) => x.precision === 'point' && x.region && !x.outside && !x.company)) {
      const key = REGIONS.find((r) => r.id === l.region)!.key;
      const pt = project(l.lon!, l.lat!);
      if (!rings(MAP_REGIONS[key].d).some((ring) => inside(pt, ring))) near++; // coast islands and polygon slivers are assigned to the nearest region
    }
    expect(near).toBeLessThan(25);
    // company sites follow the Master File's region; the generalised map puts four of them just across the Awdal/Sahil line, so they only need to sit inside the country
    for (const l of LOCALITIES.filter((x) => x.company)) {
      const pt = project(l.lon!, l.lat!);
      expect(Object.values(MAP_REGIONS).some((r) => rings(r.d).some((ring) => inside(pt, ring))), `${l.name} should be inside Somaliland`).toBe(true);
    }
  });

  it('lists every place tantalum is recorded and highlights it when the visitor picks it', () => {
    expect(recordsFor('tantalum').length).toBeGreaterThanOrEqual(5);
    expect(mineralsInRegion('sahil').metals).toContain('tantalum');
    render(<SomalilandMap />);
    fireEvent.click(screen.getAllByRole('button', { name: /^Tantalum/ })[0]);
    expect(screen.getByText(/Tantalum · \d+ records/)).toBeTruthy();
    expect(screen.getAllByText(/Manja Vihin Magiaian/).length).toBeGreaterThan(0);
  });

  it('shows company project areas on demand and labels company records with their evidence', () => {
    render(<SomalilandMap />);
    expect(document.querySelector('.gm-projects')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Company project areas' }));
    expect(document.querySelectorAll('.gm-projects .proj-mark').length).toBe(14);
    fireEvent.click(screen.getAllByRole('button', { name: /^Copper/ })[0]);
    expect(screen.getAllByText('Observed in the field').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Company field record/).length).toBeGreaterThan(0);
  });
});
