import { useState } from 'react';
import { REGIONS } from '@/data/site';

const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

/** Schematic region diagram (not a surveyed map). */
export default function SomalilandMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <svg className="map-svg" viewBox="0 0 680 360" fill="none" role="group" aria-label="Schematic diagram of Somaliland regions of interest. Not to scale.">
      <text x="340" y="30" textAnchor="middle" className="map-title">SOMALILAND · REGIONS OF INTEREST</text>
      {REGIONS.map((r) => (
        <g
          key={r.name}
          className="map-region"
          onMouseEnter={() => setHovered(r.name)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(r.name)}
          onBlur={() => setHovered(null)}
          onClick={goContact}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              goContact();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`${r.name}: enquire about this region`}
        >
          <rect className="region-shape" x={r.x} y={r.y} width={r.w} height={r.h} rx="10" fillOpacity={hovered === r.name ? 0.3 : 0.15} />
          <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r="4" fill="var(--gold)" />
          <text className="region-label" x={r.x + r.w / 2} y={r.y + r.h / 2 + 20} textAnchor="middle">{r.name}</text>
        </g>
      ))}
    </svg>
  );
}
