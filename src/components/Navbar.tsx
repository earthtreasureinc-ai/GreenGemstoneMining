import { useEffect, useState } from 'react';
import { Menu, X, Gem } from 'lucide-react';

interface NavbarProps {
  onOpenMediaPanel: () => void;
}

export default function Navbar({ onOpenMediaPanel }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Collection', href: '#collection' },
    { label: 'Craftsmanship', href: '#craftsmanship' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Voices', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal-950/90 backdrop-blur-xl border-b border-champagne-300/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <Gem className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
          <span className="font-serif text-2xl tracking-wide text-champagne-50">
            Verdant<span className="text-emerald-400">ia</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-sans font-light tracking-wider text-champagne-100/80 hover:text-emerald-400 transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <button
            onClick={onOpenMediaPanel}
            className="text-xs uppercase tracking-[0.2em] text-champagne-300/60 hover:text-gold-400 transition-colors duration-300"
            title="Manage your photos & videos"
          >
            My Media
          </button>
        </div>

        <button
          className="md:hidden text-champagne-50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4 bg-charcoal-950/95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-light tracking-wider text-champagne-100/80 hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenMediaPanel();
            }}
            className="text-xs uppercase tracking-[0.2em] text-champagne-300/60 hover:text-gold-400 transition-colors text-left"
          >
            My Media
          </button>
        </div>
      </div>
    </nav>
  );
}
