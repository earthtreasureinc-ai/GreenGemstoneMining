import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Gem,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Settings,
  Video,
  X,
} from 'lucide-react';
import MediaPanel from '@/components/MediaPanel';
import { supabase, MediaUpload } from '@/lib/supabase';

const P = {
  field: 'https://images.pexels.com/photos/17839768/pexels-photo-17839768.jpeg?auto=compress&cs=tinysrgb&w=1400',
  crystal: 'https://images.pexels.com/photos/35497189/pexels-photo-35497189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  quarry: 'https://images.pexels.com/photos/38500487/pexels-photo-38500487.jpeg?auto=compress&cs=tinysrgb&w=1200',
  mountains: 'https://images.pexels.com/photos/32006755/pexels-photo-32006755.jpeg?auto=compress&cs=tinysrgb&w=1400',
};

const NAV = [
  { label: 'Overview', href: '#top' },
  { label: 'Company', href: '#company' },
  { label: 'Portfolio', href: '#resources' },
  { label: 'Projects', href: '#projects' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const DEPOSITS = [
  { name: 'Gemstone Deposits', desc: 'Emeralds and high-value stones with a disciplined path from discovery to development.', img: P.crystal, tag: 'Precious' },
  { name: 'Rare Earth Deposits', desc: 'Strategic minerals positioned for the industries shaping a more connected future.', img: P.quarry, tag: 'Strategic' },
  { name: 'Industrial Metal Deposits', desc: 'Copper, gold, lithium, tantalum, chromite, lead — diversified across Somaliland.', img: P.field, tag: 'Industrial' },
  { name: 'Non-Metal Deposits', desc: 'Practical resources supporting construction, manufacturing, and regional growth.', img: P.mountains, tag: 'Industrial' },
];

const MINERALS = [
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

const REGIONS = [
  { name: 'Awdal', x: 80, y: 120, w: 140, h: 90 },
  { name: 'Maroodi Jeex', x: 230, y: 140, w: 110, h: 70 },
  { name: 'Saaxil', x: 200, y: 220, w: 140, h: 80 },
  { name: 'Togdheer', x: 340, y: 100, w: 130, h: 90 },
  { name: 'Sanaag', x: 480, y: 90, w: 160, h: 110 },
  { name: 'Sool', x: 440, y: 210, w: 140, h: 80 },
];

const HERO_METRICS = [
  { value: '6', label: 'Regions explored' },
  { value: '12+', label: 'Mineral verticals' },
  { value: '250+', label: 'Local workforce' },
  { value: 'Global', label: 'Partnership focus' },
];

const TIMELINE = [
  { year: '2018', title: 'Founded', desc: 'Initial investment and first geological survey in Somaliland.' },
  { year: '2020', title: 'First Project', desc: 'First mining project launched.' },
  { year: '2022', title: 'Emerald Deposit', desc: 'Reached emerald deposit and expanded exploration.' },
  { year: '2025', title: 'Gold Processing', desc: 'Gold processing plant received.' },
];

const MARQUEE = ['Responsible', 'Locally rooted', 'Globally ambitious', 'Resource focused', 'Partnership driven', 'Built to last'];

type GalleryFilter = 'All' | 'Company' | 'Deposits' | 'Projects' | 'Ore gallery' | 'Field gallery' | 'Contact' | 'My uploads';
const GALLERY_FILTERS: GalleryFilter[] = ['All', 'Company', 'Deposits', 'Projects', 'Ore gallery', 'Field gallery', 'Contact', 'My uploads'];

type GalleryItem = { src: string; label: string; w: string; type: 'image' | 'video'; isUpload?: boolean; folder?: string };

const GALLERY: GalleryItem[] = [
  { src: '/assets/images/1.png', label: 'Homepage', w: 'w7', type: 'image' },
  { src: '/assets/images/2.png', label: 'Navigation', w: 'w5', type: 'image' },
  { src: '/assets/images/About_Our_Company.png', label: 'About our company', w: 'w6', type: 'image' },
  { src: '/assets/images/Company_Profile.png', label: 'Company profile', w: 'w7', type: 'image' },
  { src: '/assets/images/Mission.png', label: 'Mission', w: 'w5', type: 'image' },
  { src: '/assets/images/Our_Awesome_History.png', label: 'Our history', w: 'w6', type: 'image' },
  { src: '/assets/images/Gemstone_Deposits.png', label: 'Gemstone deposits', w: 'w5', type: 'image' },
  { src: '/assets/images/Rare_Earth_Metal_Deposits.png', label: 'Rare earth deposits', w: 'w6', type: 'image' },
  { src: '/assets/images/Industrial_Metal_Deposits.png', label: 'Industrial metal deposits', w: 'w7', type: 'image' },
  { src: '/assets/images/Non-Metal_Deposits.png', label: 'Non-metal deposits', w: 'w5', type: 'image' },
  { src: '/assets/images/Emerald_Project_1.png', label: 'Emerald project 1', w: 'w6', type: 'image' },
  { src: '/assets/images/Emerald_Project_2.png', label: 'Emerald project 2', w: 'w5', type: 'image' },
  { src: '/assets/images/Emerald_Project_3.png', label: 'Emerald project 3', w: 'w6', type: 'image' },
  { src: '/assets/images/Emerald_Project_4.png', label: 'Emerald project 4', w: 'w7', type: 'image' },
  { src: '/assets/images/Gemstone_Gallery_1.png', label: 'Gemstone gallery 1', w: 'w5', type: 'image' },
  { src: '/assets/images/Gemstone_Gallery_2.png', label: 'Gemstone gallery 2', w: 'w6', type: 'image' },
  { src: '/assets/images/Gemstone_Gallery_3.png', label: 'Gemstone gallery 3', w: 'w5', type: 'image' },
  { src: '/assets/images/Our_Gallery_1.png', label: 'Field gallery 1', w: 'w6', type: 'image' },
  { src: '/assets/images/Our_Gallery_2.png', label: 'Field gallery 2', w: 'w7', type: 'image' },
  { src: '/assets/images/Our_Gallery_3.png', label: 'Field gallery 3', w: 'w5', type: 'image' },
  { src: '/assets/images/Our_Gallery_4.png', label: 'Field gallery 4', w: 'w6', type: 'image' },
  { src: '/assets/images/Our_Gallery_5.png', label: 'Field gallery 5', w: 'w5', type: 'image' },
  { src: '/assets/images/Our_Gallery_6.png', label: 'Field gallery 6', w: 'w7', type: 'image' },
  { src: '/assets/images/Our_Gallery_7.png', label: 'Field gallery 7', w: 'w6', type: 'image' },
  { src: '/assets/images/Our_Gallery_8.png', label: 'Field gallery 8', w: 'w5', type: 'image' },
  { src: '/assets/images/Our_Gallery_9.png', label: 'Field gallery 9', w: 'w6', type: 'image' },
  { src: '/assets/images/Beryllium_Ore_Gallery.png', label: 'Beryllium ore', w: 'w5', type: 'image' },
  { src: '/assets/images/Chromite_Ore_Gallery.png', label: 'Chromite ore', w: 'w6', type: 'image' },
  { src: '/assets/images/Copper_Ore_Gallery.png', label: 'Copper ore', w: 'w7', type: 'image' },
  { src: '/assets/images/Gold_Gallery.png', label: 'Gold', w: 'w5', type: 'image' },
  { src: '/assets/images/Lead_Ore_Gallery.png', label: 'Lead ore', w: 'w6', type: 'image' },
  { src: '/assets/images/Lithium_Ore_Gallery.png', label: 'Lithium ore', w: 'w5', type: 'image' },
  { src: '/assets/images/Mica_Muscovite_Gallery.png', label: 'Mica muscovite', w: 'w7', type: 'image' },
  { src: '/assets/images/Tantalum_Ore_Gallery.png', label: 'Tantalum ore', w: 'w6', type: 'image' },
  { src: '/assets/images/Contact_Us.png', label: 'Contact us', w: 'w5', type: 'image' },
  { src: '/assets/images/Thank_You.png', label: 'Thank you', w: 'w6', type: 'image' },
  { src: '/assets/canva/page_01.png', label: 'Canva cover export', w: 'w7', type: 'image' },
];

const getUploadFolderName = (storagePath?: string | null): string => {
  if (!storagePath) return 'General';
  const parts = storagePath.split('/').filter(Boolean);
  if (parts.length <= 2) return 'General';
  return parts.slice(1, -1).join('/') || 'General';
};

function matchesGalleryFilter(item: GalleryItem, filter: GalleryFilter): boolean {
  if (filter === 'All') return true;
  if (filter === 'My uploads') return item.isUpload === true;
  if (filter === 'Company') return ['Homepage', 'Navigation', 'About our company', 'Company profile', 'Mission', 'Our history'].includes(item.label);
  if (filter === 'Deposits') return item.label.toLowerCase().includes('deposit');
  if (filter === 'Projects') return item.label.toLowerCase().includes('project');
  if (filter === 'Ore gallery') return item.label.toLowerCase().includes('ore') || item.label === 'Gold';
  if (filter === 'Field gallery') return item.label.toLowerCase().includes('field gallery') || item.label.toLowerCase().includes('gemstone gallery');
  return item.label === 'Contact us' || item.label === 'Thank you' || item.label === 'Canva cover export';
}

function useScrollHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function useReveals() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      setReducedMotion(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }
    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return reducedMotion;
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const val = useCountUp(value, active);

  return (
    <div ref={ref} className="split-stats-card">
      <strong>{val > 0 ? val : ''}{value === 2018 ? '' : '+'}</strong>
      <span>{label}</span>
    </div>
  );
}

function Scramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(text);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return undefined;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let raf = 0;
    const timeout = window.setTimeout(() => {
      let frame = 0;
      const animate = () => {
        const progress = frame / 40;
        const scrambled = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < progress * text.length) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        setDisplay(scrambled);
        frame += 1;
        if (frame <= 40) raf = requestAnimationFrame(animate);
        else setDisplay(text);
      };
      animate();
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, reducedMotion]);

  return <span className="scramble">{display}</span>;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let raf = 0;
    let w = 0;
    let h = 0;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 22; i += 1) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 162, 82, ${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return <canvas id="particles" ref={canvasRef} aria-hidden="true" />;
}

function Crystal3D() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (ref.current) ref.current.style.transform = 'translateY(-50%) rotateX(0deg) rotateY(0deg)';
      return undefined;
    }

    const onMove = (event: MouseEvent) => {
      if (!ref.current) return;
      const cx = event.clientX / window.innerWidth - 0.5;
      const cy = event.clientY / window.innerHeight - 0.5;
      ref.current.style.transform = `translateY(-50%) rotateX(${cy * 18}deg) rotateY(${cx * 24}deg)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  return (
    <div className="crystal-3d" aria-hidden="true">
      <div className="crystal-inner" ref={ref}>
        <div className="crystal-face"><Gem size={280} strokeWidth={0.3} /></div>
      </div>
      <div className="crystal-glow" />
    </div>
  );
}

function Loader({ done }: { done: boolean }) {
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className={`loader ${done ? 'gone' : ''}`} aria-live="polite">
      <div className="loader-gem"><Gem size={48} strokeWidth={0.8} /></div>
      <div className="loader-bar"><span style={{ width: `${Math.min(progress, 100)}%` }} /></div>
      <div className="loader-text">Green Gemstone Mining Company</div>
    </div>
  );
}

function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

function SomalilandMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg className="map-svg" viewBox="0 0 680 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="340" y="30" textAnchor="middle" className="map-title">SOMALILAND</text>
      {REGIONS.map((r) => (
        <g
          key={r.name}
          className="map-region"
          onMouseEnter={() => setHovered(r.name)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <rect className="region-shape" x={r.x} y={r.y} width={r.w} height={r.h} rx="10" fillOpacity={hovered === r.name ? '0.3' : '0.15'} />
          <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r="4" fill="var(--gold)" />
          <text className="region-label" x={r.x + r.w / 2} y={r.y + r.h / 2 + 20} textAnchor="middle">{r.name}</text>
        </g>
      ))}
    </svg>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('All');
  const [loaded, setLoaded] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaUpload[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('All folders');
  const [lightboxItem, setLightboxItem] = useState<{ src: string; type: 'image' | 'video' } | null>(null);
  const lightboxButtonRef = useRef<HTMLButtonElement>(null);
  const scrolled = useScrollHeader();
  useReveals();

  useEffect(() => {
    if (!lightboxItem) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxItem(null);
    };

    lightboxButtonRef.current?.focus();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem]);

  const fetchUploadedMedia = useCallback(async () => {
    const { data } = await supabase
      .from('media_uploads')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (data) setUploadedMedia(data as MediaUpload[]);
  }, []);

  useEffect(() => {
    fetchUploadedMedia();
  }, [fetchUploadedMedia]);

  const folderGroups = useMemo(() => {
    const groups = new Map<string, MediaUpload[]>();
    uploadedMedia.forEach((media) => {
      const folder = getUploadFolderName(media.storage_path);
      if (!groups.has(folder)) groups.set(folder, []);
      groups.get(folder)?.push(media);
    });
    return Array.from(groups.entries()).sort(([left], [right]) => left.localeCompare(right));
  }, [uploadedMedia]);

  const galleryFolderOptions = useMemo(() => ['All folders', ...folderGroups.map(([folder]) => folder)], [folderGroups]);

  const filteredUploadedMedia = useMemo(() => {
    if (selectedFolder === 'All folders') return uploadedMedia;
    return uploadedMedia.filter((media) => getUploadFolderName(media.storage_path) === selectedFolder);
  }, [selectedFolder, uploadedMedia]);

  const uploadedGalleryItems: GalleryItem[] = filteredUploadedMedia.map((media) => ({
    src: media.public_url,
    label: media.title,
    w: 'w6',
    type: media.media_type,
    isUpload: true,
    folder: getUploadFolderName(media.storage_path),
  }));

  const allGalleryItems: GalleryItem[] = [...GALLERY, ...uploadedGalleryItems];
  const visibleGallery = allGalleryItems.filter((item) => matchesGalleryFilter(item, galleryFilter));

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app">
      <Loader done={loaded} />
      <ScrollProgress />
      <div className="grain" />

      <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
        <a className="hdr-brand" href="#top"><Gem size={22} /><span>Green Gemstone</span></a>
        <nav className={`hdr-nav ${menuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="hdr-cta" href="#contact" onClick={() => setMenuOpen(false)}>Partner with us <ArrowUpRight size={14} /></a>
          <button className="hdr-media-btn" onClick={() => { setMediaOpen(true); setMenuOpen(false); }} aria-label="Manage media"><Settings size={16} /><span>Manage</span></button>
        </nav>
        <button className="hdr-burger" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((value) => !value)} aria-label="Menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <MediaPanel open={mediaOpen} onClose={() => setMediaOpen(false)} onUploaded={fetchUploadedMedia} />

      <main>
        <section id="top" className="hero">
          <img className="hero-design" src="/assets/canva/page_01.png" alt="Green Gemstone Mining Company brand artwork" />
          <ParticleCanvas />
          <div className="hero-overlay" />
          <Crystal3D />
          <div className="hero-inner">
            <p className="hero-kicker">Somaliland • Strategic mineral development</p>
            <h1>
              <Scramble text="Somaliland's" delay={400} />
              <Scramble text="mineral frontier" delay={700} />
            </h1>
            <p className="hero-sub">Green Gemstone Mining Company is building a diversified platform for responsible gemstone, rare earth, and industrial metal development across Somaliland — with a disciplined, investor-focused approach to long-term value creation.</p>
            <div className="hero-cta">
              <a className="btn btn-gold" href="#contact">Request investor pack <ArrowRight size={16} /></a>
              <a className="btn-ghost" href="#resources">Explore portfolio <ChevronDown size={16} /></a>
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
              <img src={P.field} alt="Mining team working in Somaliland" />
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
                  <img src={deposit.img} alt={deposit.name} />
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
          <div className="split-img"><img src={P.quarry} alt="Open-pit mining operation" /></div>
          <div className="split-text">
            <div className="reveal">
              <p className="eyebrow">Industrial metals</p>
              <h2 className="display light">Materials with<br /><em>lasting relevance.</em></h2>
              <p className="body-text">Our strategy spans both precious and non-precious metals — from copper and gold to lithium, tantalum, and chromite — supported by ongoing exploration and disciplined development planning.</p>
              <div className="split-stats">
                <Counter value={12} label="Resources targeted" />
                <Counter value={6} label="Project regions" />
                <Counter value={2018} label="Operating since" />
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
              <p className="body-text">Our focus spans Somaliland's six regions, with active opportunity across each. Hover the map to explore access points and operating potential.</p>
            </div>
            <div className="map-section">
              <div className="reveal"><SomalilandMap /></div>
              <div className="map-legend reveal" style={{ transitionDelay: '150ms' }}>
                {REGIONS.map((region, index) => (
                  <a key={region.name} href="#contact" className="map-legend-item" style={{ transitionDelay: `${index * 60}ms` }}>
                    <span className="dot" />
                    <div><strong>{region.name}</strong><small>Active exploration area</small></div>
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
              <p className="body-text">Explore our field archive from exploration, project sites, mineral sampling, and operating landscapes across Somaliland.</p>
            </div>
          </div>

          <div className="gallery-filters" role="tablist" aria-label="Filter design archive">
            {GALLERY_FILTERS.map((filter) => (
              <button
                key={filter}
                className={galleryFilter === filter ? 'active' : ''}
                onClick={() => setGalleryFilter(filter)}
                role="tab"
                aria-selected={galleryFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          {galleryFolderOptions.length > 1 && (
            <div className="gallery-filters" role="tablist" aria-label="Filter gallery folders">
              {galleryFolderOptions.map((folder) => (
                <button
                  key={folder}
                  className={selectedFolder === folder ? 'active' : ''}
                  onClick={() => setSelectedFolder(folder)}
                  role="tab"
                  aria-selected={selectedFolder === folder}
                >
                  {folder}
                </button>
              ))}
            </div>
          )}

          <div className="gallery-h reveal">
            {selectedFolder === 'All folders' ? (
              <div className="gallery-folder-grid">
                {folderGroups.length > 0 ? (
                  folderGroups.map(([folder, items]) => (
                    <button key={folder} className="gallery-folder-card" onClick={() => setSelectedFolder(folder)}>
                      <div className="gallery-folder-thumb">
                        {items[0] && (items[0].media_type === 'video' ? (
                          <video src={items[0].public_url} muted />
                        ) : (
                          <img src={items[0].public_url} alt={folder} />
                        ))}
                      </div>
                      <div className="gallery-folder-meta">
                        <strong>{folder}</strong>
                        <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="gallery-empty">No uploaded folders yet. Use the media manager to add gallery content.</div>
                )}
              </div>
            ) : (
              <div className="gallery-track">
                {visibleGallery.map((item, index) => (
                  <button key={`${item.src}-${index}`} className={`g-item ${item.w}`} onClick={() => setLightboxItem({ src: item.src, type: item.type })}>
                    {item.type === 'video' ? (
                      <video src={item.src} muted className="g-video" />
                    ) : (
                      <img src={item.src} alt={item.label} loading="lazy" />
                    )}
                    {item.type === 'video' && <span className="g-video-icon"><Video size={16} /></span>}
                    {item.folder && <span className="g-folder-tag">{item.folder}</span>}
                    <span className="g-label">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
            <img src={P.mountains} alt="Misty mountain landscape" />
            <div className="contact-stamp">Come visit<strong>Somaliland</strong></div>
          </div>
          <div className="contact-panel">
            <div className="reveal">
              <p className="eyebrow">Start a conversation</p>
              <h2 className="display light">Bring the right<br /><em>people together.</em></h2>
              <p className="body-text">We are looking for investors, deposit holders, technical partners, and operating specialists who see the opportunity in Somaliland and want to help shape it responsibly.</p>
              <div className="contact-info">
                <a href="mailto:greengemstonemining@gmail.com"><Mail size={16} /> greengemstonemining@gmail.com</a>
                <span><MapPin size={16} /> Omar Hashi Building, 4th Floor, Hargeisa, Somaliland</span>
                <a href="#contact"><Linkedin size={16} /> @greengemstonemining</a>
              </div>
              <form onSubmit={handleSubmit} className="contact-form">
                <input type="email" required placeholder="Your email address" aria-label="Your email address" />
                <button className="btn btn-gold" type="submit">{submitted ? <><Check size={16} /> Received</> : <>Request an introduction <ArrowRight size={16} /></>}</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><Gem size={20} /> Green Gemstone</div>
            <p className="footer-tag">Responsible mining. Lasting value. A stronger Somaliland built from the ground up.</p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#company">About us</a>
            <a href="#mission">Mission</a>
            <a href="#projects">Projects</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#resources">Deposits</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="mailto:greengemstonemining@gmail.com">Email</a>
            <a href="#contact">LinkedIn</a>
            <a href="#contact">Partner with us</a>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Green Gemstone Mining Company</span>
          <span>Hargeisa · Somaliland</span>
        </div>
      </footer>

      {lightboxItem && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxItem(null)}>
          <button ref={lightboxButtonRef} onClick={() => setLightboxItem(null)} aria-label="Close"><X /></button>
          {lightboxItem.type === 'video' ? (
            <video src={lightboxItem.src} controls autoPlay className="lightbox-video" onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={lightboxItem.src} alt="Expanded photograph" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </div>
  );
}
