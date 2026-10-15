import { Suspense, lazy, useState } from 'react';
import { Atom, ArrowRight, ArrowUpRight, ChevronDown, Gem, Hammer, Linkedin, Mail, MapPin, Menu, Mountain, X } from 'lucide-react';
import Gallery from '@/components/Gallery';
import ContactForm from '@/components/ContactForm';
import SomalilandMap from '@/components/SomalilandMap';
import { Counter, Crystal3D, ScrollProgress } from '@/components/Effects';
import { DEPOSITS, HERO_METRICS, IMAGES, MARQUEE, MINERALS, NAV, REGIONS, SITE, TIMELINE } from '@/data/site';
import { useAdminSession } from '@/hooks/useAdminSession';
import { useReveals } from '@/hooks/useReveals';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useUploads } from '@/hooks/useUploads';
import { supabaseConfigured } from '@/lib/supabase';

const DEPOSIT_ICONS = { gem: Gem, atom: Atom, hammer: Hammer, mountain: Mountain } as const;
const METALS = MINERALS.filter((m) => m.cat === 'Metal' || m.cat === 'Precious');

const MediaPanel = lazy(() => import('@/components/MediaPanel'));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const scrolled = useScrollHeader();
  const { uploads, refresh } = useUploads();
  const admin = useAdminSession(mediaOpen);
  useReveals();

  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />

      <header className={`hdr ${scrolled || menuOpen ? 'scrolled' : ''}`}>
        <a className="hdr-brand" href="#top"><Gem size={22} aria-hidden="true" /><span>Green Gemstone</span></a>
        <nav id="main-nav" className={`hdr-nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="hdr-cta" href="#contact" onClick={() => setMenuOpen(false)}>Partner with us <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
        <button type="button" className="hdr-burger" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      {mediaOpen && (
        <Suspense fallback={null}>
          <MediaPanel open={mediaOpen} onClose={() => setMediaOpen(false)} onUploaded={refresh} admin={admin} />
        </Suspense>
      )}

      <main id="main">
        <section id="top" className="hero">
          <img className="hero-bg" src={IMAGES.company} alt="" width={806} height={536} fetchPriority="high" />
          <div className="hero-overlay" />
          <Crystal3D />
          <div className="hero-inner">
            <p className="hero-kicker">Somaliland • Strategic mineral development</p>
            <h1>Somaliland&apos;s <span className="h1-line">mineral frontier</span></h1>
            <p className="hero-sub">Green Gemstone Mining Company is building a diversified platform for responsible gemstone, rare earth, and industrial metal development across Somaliland, with a disciplined, investor-focused approach to long-term value creation.</p>
            <div className="hero-cta">
              <a className="btn btn-gold" href="#contact">Request investor information <ArrowRight size={16} aria-hidden="true" /></a>
              <a className="btn-ghost" href="#resources">Explore portfolio <ChevronDown size={16} aria-hidden="true" /></a>
            </div>
            <div className="hero-metrics">
              {HERO_METRICS.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-foot"><span>Responsible mining. Lasting value.</span></div>
        </section>

        <section className="marquee">
          <div className="marquee-track">{[...MARQUEE, ...MARQUEE].map((word, i) => <span key={`${word}-${i}`}><Gem size={12} /> {word}</span>)}</div>
        </section>

        <section id="company" className="sec">
          <div className="sec-container company">
            <div className="company-visual reveal">
              <img src={IMAGES.company} alt="Green Gemstone Mining team member in the field, Somaliland" width={806} height={536} loading="lazy" />
              <div className="company-badge">On the ground<br />in Somaliland</div>
            </div>
            <div className="company-text reveal" style={{ transitionDelay: '120ms' }}>
              <p className="eyebrow">About the company</p>
              <h2 className="display">Built in Somaliland.<br /><em>Ready for global capital.</em></h2>
              <p className="body-lg">Green Gemstone Mining Company combines local geology expertise, disciplined exploration, and a partnership-driven ambition to unlock Somaliland's mineral potential.</p>
              <p className="body-text">We are building a platform that creates long-term value for investors, local communities, and strategic partners — focusing on high-potential mineral opportunities with clear discipline and transparent execution.</p>
              <p className="body-text">Our diverse local workforce reflects the regions we operate in and the relationships we continue to build around safe, transparent, and sustainable mining practices.</p>
              <a className="link-go" href="#mission">How we work <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        <section id="resources" className="sec sec-dark">
          <div className="sec-container">
            <div className="deposits-head reveal">
              <div>
                <p className="eyebrow">Resource portfolio</p>
                <h2 className="display light">A broader view<br /><em>of what is possible.</em></h2>
              </div>
              <p>Our portfolio is intentionally diversified — gemstones, rare earths, industrial metals, and non-metal deposits — creating multiple pathways to long-term value and partnership growth.</p>
            </div>
            <div className="deposits-grid">
              {DEPOSITS.map((deposit, index) => (
                <article className="deposit reveal" key={deposit.name} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className={`deposit-art tone-${deposit.tone}`} aria-hidden="true">{(() => { const Icon = DEPOSIT_ICONS[deposit.icon]; return <Icon size={96} strokeWidth={0.6} />; })()}</div>
                  <span className="deposit-tag">{deposit.tag}</span>
                  <div className="deposit-body">
                    <h3>{deposit.name}</h3>
                    <p>{deposit.desc}</p>
                    <a href="#contact">Discuss this focus <ArrowUpRight size={14} /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="split">
          <div className="split-img split-panel"><ul aria-label="Metals in our portfolio">{METALS.map((m) => <li key={m.name}>{m.name}</li>)}</ul></div>
          <div className="split-text">
            <div className="reveal">
              <p className="eyebrow">Industrial metals</p>
              <h2 className="display light">Materials with<br /><em>lasting relevance.</em></h2>
              <p className="body-text">Our strategy spans both precious and non-precious metals — from copper and gold to lithium, tantalum, and chromite — supported by ongoing exploration and disciplined development planning.</p>
              <div className="split-stats">
                <Counter value={12} label="Resources targeted" />
                <Counter value={6} label="Project regions" plus={false} />
                <Counter value={2018} label="Operating since" plus={false} />
              </div>
              <a className="btn btn-gold" href="#projects">See project regions <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section id="mission" className="sec">
          <div className="sec-container">
            <div className="mission-head reveal">
              <p className="eyebrow">Vision and mission</p>
              <h2 className="display">Progress that<br /><em>earns trust.</em></h2>
              <p className="body-text">We want Somaliland to be recognized not only for the quality of its resources, but for the quality of the way they are developed. Our mission is to expand opportunities with discipline, responsibility, and long-term thinking.</p>
            </div>
            <div className="mission-grid">
              {[
                { n: '01', t: 'Understand the ground', d: 'Start with local insight, serious fieldwork, and a clear-eyed view of what is possible.' },
                { n: '02', t: 'Build the right partnerships', d: 'Bring investors, technical experts, operators, and resource owners together around real projects.' },
                { n: '03', t: 'Create lasting value', d: 'Grow local skills, protect people and place, and build benefits that extend well beyond the mine site.' },
              ].map((point, index) => (
                <div className="mission-card reveal" key={point.n} style={{ transitionDelay: `${index * 120}ms` }}>
                  <span className="num">{point.n}</span>
                  <h3>{point.t}</h3>
                  <p>{point.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="sec sec-dark">
          <div className="sec-container">
            <div className="reveal center-block">
              <p className="eyebrow center">Projects and regions</p>
              <h2 className="display light">The map is<br /><em>still opening.</em></h2>
              <p className="body-text">Our focus spans Somaliland's six regions, with active opportunity across each. Select a region below to enquire about it. The diagram is schematic, not a surveyed map.</p>
            </div>
            <div className="map-section">
              <div className="reveal"><SomalilandMap /></div>
              <div className="map-legend reveal" style={{ transitionDelay: '150ms' }}>
                {REGIONS.map((region, index) => (
                  <a key={region.name} href="#contact" className="map-legend-item" style={{ transitionDelay: `${index * 60}ms` }}>
                    <span className="dot" />
                    <div><strong>{region.name}</strong><small>Region of interest</small></div>
                    <ArrowUpRight size={18} className="go" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="sec-container">
            <div className="reveal center-block">
              <p className="eyebrow center">Our history</p>
              <h2 className="display">A young company<br /><em>with momentum.</em></h2>
            </div>
            <div className="timeline-rail">
              {TIMELINE.map((item, index) => (
                <div className="tl-node reveal" key={item.year} style={{ transitionDelay: `${index * 120}ms` }}>
                  <span className="tl-dot" />
                  <span className="tl-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="sec sec-dark">
          <div className="sec-container">
            <div className="reveal center-block">
              <p className="eyebrow center">Field notes</p>
              <h2 className="display light">The work is<br /><em>already underway.</em></h2>
              <p className="body-text">Browse our archive of deposits, ore samples and project material from across Somaliland.</p>
            </div>
          </div>
          <Gallery uploads={uploads} />
        </section>

        <section className="sec">
          <div className="sec-container">
            <div className="reveal center-block">
              <p className="eyebrow center">Resource catalogue</p>
              <h2 className="display">A pipeline of<br /><em>possibilities.</em></h2>
              <p className="body-text">The resources below represent the breadth of Somaliland's mineral potential and the areas we are actively seeking to develop responsibly.</p>
            </div>
            <div className="mineral-grid reveal">
              {MINERALS.map((mineral, index) => (
                <div className="mineral" key={mineral.name}>
                  <span className="mineral-num">{String(index + 1).padStart(2, '0')}</span>
                  <Gem size={18} />
                  <div className="mineral-info"><strong>{mineral.name}</strong><small>{mineral.cat}</small></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-sec">
          <div className="contact-visual">
            <div className="contact-stamp">Come visit<strong>Somaliland</strong></div>
          </div>
          <div className="contact-panel">
            <div className="reveal">
              <p className="eyebrow">Start a conversation</p>
              <h2 className="display light">Bring the right<br /><em>people together.</em></h2>
              <p className="body-text">We are looking for investors, deposit holders, technical partners, and operating specialists who see the opportunity in Somaliland and want to help shape it responsibly.</p>
              <div className="contact-info">
                <a href={`mailto:${SITE.email}`}><Mail size={16} aria-hidden="true" /> {SITE.email}</a>
                <span><MapPin size={16} aria-hidden="true" /> {SITE.address}</span>
                {SITE.linkedin && <a href={SITE.linkedin} rel="noopener noreferrer" target="_blank"><Linkedin size={16} aria-hidden="true" /> LinkedIn</a>}
              </div>
              <ContactForm />
              <p className="privacy-note">We use your details only to reply to your enquiry and do not share them. See our <a href="#privacy">privacy notice</a>.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><Gem size={20} aria-hidden="true" /> Green Gemstone</div>
            <p className="footer-tag">Responsible mining. Lasting value. A stronger Somaliland built from the ground up.</p>
          </div>
          <div className="footer-col">
            <h3>Company</h3>
            <a href="#company">About us</a>
            <a href="#mission">Mission</a>
            <a href="#projects">Projects</a>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <a href="#resources">Deposits</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h3>Connect</h3>
            <a href={`mailto:${SITE.email}`}>Email</a>
            {SITE.linkedin && <a href={SITE.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a>}
            <a href="#contact">Partner with us</a>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Hargeisa · Somaliland</span>
          {supabaseConfigured && <button type="button" className="owner-link" onClick={() => setMediaOpen(true)}>Owner login</button>}
        </div>
        <section id="privacy" className="privacy">
          <h3>Privacy notice</h3>
          <p>When you send an enquiry we store your name, email, company, interest and message so that {SITE.name} can respond. We do not sell or share this information, and we keep it only as long as needed to handle your enquiry. To see or delete your details, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </section>
      </footer>
    </div>
  );
}
