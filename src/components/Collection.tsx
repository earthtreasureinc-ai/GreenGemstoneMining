import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { PRODUCTS, Product } from '@/data/content';
import { X, Gem, MapPin } from 'lucide-react';

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const;

export default function Collection() {
  const { ref, visible } = useReveal();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="collection" className="py-24 md:py-32 px-6 bg-charcoal-950 relative">
      <div ref={ref} className={`max-w-7xl mx-auto ${visible ? 'reveal visible' : 'reveal'}`}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="ornament-line" />
            <span className="section-label">The Collection</span>
            <span className="ornament-line" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-champagne-50">
            Pieces of Distinction
          </h2>
          <p className="mt-4 text-champagne-100/60 font-light max-w-xl mx-auto">
            Each creation is a singular work of art, born from the finest green gemstones the earth has to offer.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-sm tracking-wide rounded-sm transition-all duration-300 ${
                filter === cat
                  ? 'bg-emerald-700 text-champagne-50'
                  : 'border border-champagne-300/15 text-champagne-100/60 hover:border-emerald-700/50 hover:text-emerald-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, idx) => (
            <div
              key={product.id}
              className={`group cursor-pointer reveal ${visible ? 'visible' : ''}`}
              style={{ transitionDelay: `${idx * 80}ms` }}
              onClick={() => setSelected(product)}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-charcoal-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-xs uppercase tracking-wider text-gold-400">Quick View</span>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-charcoal-950/60 backdrop-blur-sm rounded-sm">
                  <span className="text-xs text-champagne-200">{product.category}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-serif text-champagne-50 group-hover:text-emerald-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-champagne-100/50 mt-0.5">{product.gemstone}</p>
                </div>
                <span className="text-gold-400 font-serif text-lg">${product.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-charcoal-900 border border-champagne-300/10 rounded-lg max-w-4xl w-full grid md:grid-cols-2 overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square md:aspect-auto relative">
              <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-champagne-100/60 hover:text-champagne-50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <span className="section-label mb-3">{selected.category}</span>
              <h3 className="text-3xl font-serif font-light text-champagne-50 mb-4">{selected.name}</h3>
              <p className="text-champagne-100/70 font-light leading-relaxed mb-6">{selected.description}</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-champagne-100/60">
                  <Gem className="w-4 h-4 text-emerald-400" />
                  {selected.gemstone}
                </div>
                <div className="flex items-center gap-3 text-sm text-champagne-100/60">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {selected.origin}
                </div>
              </div>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-serif text-gold-400">${selected.price.toLocaleString()}</span>
              </div>
              <button className="btn-gold w-full">Enquire About This Piece</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
