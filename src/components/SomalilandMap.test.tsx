// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import SomalilandMap from '@/components/SomalilandMap';
import { REGIONS } from '@/data/site';
import { MAP_REGIONS } from '@/data/mapData';
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
        expect(region.minerals.length).toBeGreaterThan(0);
      }
    }
    for (const dict of [so, ar, zh]) {
      expect(Object.keys(dict.projects.zones)).toEqual(Object.keys(en.projects.zones));
    }
  });

  it('shows details for the selected region and lets the visitor change it', () => {
    render(<SomalilandMap />);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Maroodi Jeex');
    fireEvent.click(screen.getAllByRole('button', { name: 'Sanaag' })[0]);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Sanaag');
    expect(screen.getAllByRole('button', { name: 'Sanaag' }).every((b) => b.getAttribute('aria-pressed') === 'true')).toBe(true);
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
});
