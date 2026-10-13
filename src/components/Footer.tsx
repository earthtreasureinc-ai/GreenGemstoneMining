import { Gem, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const links = {
    Collection: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'],
    Atelier: ['Our Story', 'Craftsmanship', 'Ethical Sourcing', 'Sustainability'],
    Service: ['Bespoke Commissions', 'Restoration', 'Valuations', 'Contact Us'],
  };

  return (
    <footer className="bg-charcoal-950 border-t border-champagne-300/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Gem className="w-6 h-6 text-emerald-400" />
              <span className="font-serif text-2xl text-champagne-50">
                Verdant<span className="text-emerald-400">ia</span>
              </span>
            </div>
            <p className="text-sm text-champagne-100/40 font-light leading-relaxed max-w-xs mb-6">
              Rare emeralds and bespoke green gemstone jewelry, ethically sourced and masterfully crafted
              since 1962.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full border border-champagne-300/15 flex items-center justify-center text-champagne-100/40 hover:text-emerald-400 hover:border-emerald-700/50 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-sans font-medium uppercase tracking-wider text-emerald-400 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-champagne-100/40 hover:text-champagne-50 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-champagne-300/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-champagne-100/30 font-light">
            © {new Date().getFullYear()} Verdantia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-champagne-100/30 hover:text-champagne-50 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-champagne-100/30 hover:text-champagne-50 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-champagne-100/30 hover:text-champagne-50 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
