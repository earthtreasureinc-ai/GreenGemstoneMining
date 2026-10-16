import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MAP_CORRIDOR, MAP_GEOLOGY, MAP_OUTLINE, MAP_PLACES, MAP_REGIONS, MAP_VIEWBOX } from '@/data/mapData';
import { REGIONS } from '@/data/site';
import { useI18n } from '@/i18n/core';

type Layer = 'regions' | 'geology';

const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

/** Region borders are approximate and the geology layer is generalised, so the map says so in its note. */
export default function SomalilandMap() {
  const { t } = useI18n();
  const p = t.projects;
  const [layer, setLayer] = useState<Layer>('regions');
  const [selected, setSelected] = useState<string>('maroodiJeex');
  const [hovered, setHovered] = useState<string | null>(null);
  const active = p.regions[selected];

  const select = (id: string) => setSelected(id);

  return (
    <div className="geomap">
      <div className="geomap-stage">
        <div className="geomap-toolbar">
          <span className="geomap-title">{p.mapTitle}</span>
          <div className="geomap-toggle" role="group" aria-label={p.layersLabel}>
            {(['regions', 'geology'] as Layer[]).map((l) => (
              <button key={l} type="button" aria-pressed={layer === l} onClick={() => setLayer(l)}>
                {l === 'regions' ? p.layerRegions : p.layerGeology}
              </button>
            ))}
          </div>
        </div>

        <svg className="geomap-svg" viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`} role="group" aria-label={p.mapLabel}>
          <defs>
            <clipPath id="gm-clip"><path d={MAP_OUTLINE} /></clipPath>
            <filter id="gm-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="gm-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,.14)" strokeWidth="1.4" />
            </pattern>
            <pattern id="gm-dots" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="rgba(255,255,255,.16)" />
            </pattern>
          </defs>

          <text className="geomap-sea" x="470" y="78" transform="rotate(-5 470 78)">{p.seaLabel}</text>

          {/* soft shadow under the country */}
          <path d={MAP_OUTLINE} className="geomap-shadow" />

          <g clipPath="url(#gm-clip)">
            {/* Regions layer: each region in its own tint */}
            <g className={`geomap-layer ${layer === 'regions' ? 'on' : ''}`}>
              {REGIONS.map((r) => (
                <path key={r.id} d={MAP_REGIONS[r.key].d} className={`gm-fill gm-${r.id}`} />
              ))}
            </g>
            {/* Geology layer: generalised belts */}
            <g className={`geomap-layer ${layer === 'geology' ? 'on' : ''}`}>
              <path d={MAP_OUTLINE} className="gz gz-haud" />
              {Object.entries(MAP_GEOLOGY).map(([zone, d]) => (
                <g key={zone}>
                  <path d={d} className={`gz gz-${zone}`} />
                  {zone === 'basement' && <path d={d} fill="url(#gm-hatch)" />}
                  {zone === 'mesozoic' && <path d={d} fill="url(#gm-dots)" />}
                </g>
              ))}
            </g>
          </g>

          {/* interactive region shapes (borders + hit areas) */}
          {REGIONS.map((r) => {
            const on = selected === r.id;
            return (
              <g
                key={r.id}
                className={`gm-region ${on ? 'is-selected' : ''} ${hovered === r.id ? 'is-hover' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={p.regions[r.id].name}
                onClick={() => select(r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(r.id)}
                onBlur={() => setHovered(null)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    select(r.id);
                  }
                }}
              >
                <path d={MAP_REGIONS[r.key].d} className="gm-hit" filter={on ? 'url(#gm-glow)' : undefined} />
              </g>
            );
          })}

          <path d={MAP_OUTLINE} className="geomap-outline" />
          <path d={MAP_CORRIDOR} className="geomap-corridor"><title>{p.corridor}</title></path>

          {/* region names */}
          {REGIONS.map((r) => (
            <text
              key={r.id}
              x={MAP_REGIONS[r.key].cx + (r.dx ?? 0)}
              y={MAP_REGIONS[r.key].cy + (r.dy ?? 0)}
              textAnchor="middle"
              className={`geomap-name ${selected === r.id ? 'on' : ''}`}
            >
              {p.regions[r.id].name}
            </text>
          ))}

          {/* places */}
          {MAP_PLACES.map((pl) => (
            <g key={pl.name} className={`gm-place gm-${pl.kind} pl-${pl.name}`} transform={`translate(${pl.x} ${pl.y})`}>
              {pl.kind !== 'town' && <circle r="11" className="pulse" />}
              {pl.kind === 'capital' ? <path d="M0 -7 L2.2 -2.2 L7 0 L2.2 2.2 L0 7 L-2.2 2.2 L-7 0 L-2.2 -2.2Z" className="dot" /> : <circle r={pl.kind === 'port' ? 4.5 : 3} className="dot" />}
              <text x="9" y="4" className="place-label">{p.places[pl.name] ?? pl.name}</text>
            </g>
          ))}
        </svg>

        <div className="geomap-legend" aria-live="polite">
          {layer === 'geology'
            ? (['guban', 'basement', 'mesozoic', 'haud'] as const).map((z) => (
                <span key={z} className="lg-item" title={p.zones[z].desc}>
                  <i className={`sw gz-${z}`} />{p.zones[z].name}
                </span>
              ))
            : REGIONS.map((r) => (
                <span key={r.id} className="lg-item">
                  <i className={`sw gm-${r.id}`} />{p.regions[r.id].name}
                </span>
              ))}
          <span className="lg-item"><i className="sw-star" />{p.placeKinds.capital}</span>
          <span className="lg-item"><i className="sw-dot" />{p.placeKinds.port}</span>
          <span className="lg-item"><i className="sw-line" />{p.corridor}</span>
        </div>
      </div>

      <aside className="geomap-panel">
        <div className="region-tabs" role="group" aria-label={p.regionsLabel}>
          {REGIONS.map((r) => (
            <button key={r.id} type="button" className={`gm-tab gm-${r.id}`} aria-pressed={selected === r.id} onClick={() => select(r.id)}>
              <i className="tab-dot" />
              {p.regions[r.id].name}
            </button>
          ))}
        </div>

        <div className={`region-card gm-${selected}`} key={selected}>
          <h3>{active.name}</h3>
          <dl>
            <dt>{p.roleLabel}</dt>
            <dd>{active.role}</dd>
            <dt>{p.geologyLabel}</dt>
            <dd>{active.geology}</dd>
            <dt>{p.mineralsLabel}</dt>
            <dd className="chips">
              {active.minerals.map((m) => <span key={m} className="chip">{m}</span>)}
            </dd>
          </dl>
          <button type="button" className="region-cta" onClick={goContact}>
            {p.cta} <ArrowUpRight size={16} />
          </button>
        </div>
      </aside>

      <p className="geomap-note">{p.note}</p>
    </div>
  );
}
