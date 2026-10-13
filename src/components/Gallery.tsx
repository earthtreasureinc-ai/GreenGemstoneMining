import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useMedia } from '@/hooks/useMedia';
import { PLACEHOLDER } from '@/data/content';
import { X, Play } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title: string;
}

export default function Gallery() {
  const { ref, visible } = useReveal();
  const { media } = useMedia('gallery');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] =
    media.length > 0
      ? media.map((m) => ({
          id: m.id,
          url: m.public_url,
          type: m.media_type,
          title: m.title,
        }))
      : [
          { id: 'g1', url: PLACEHOLDER.gallery1, type: 'image', title: 'Raw Emerald' },
          { id: 'g2', url: PLACEHOLDER.gallery2, type: 'image', title: 'Emerald Crystal' },
          { id: 'g3', url: PLACEHOLDER.gallery3, type: 'image', title: 'Green Beryl' },
          { id: 'g4', url: PLACEHOLDER.gallery4, type: 'image', title: 'Rough Emerald' },
          { id: 'g5', url: PLACEHOLDER.gallery5, type: 'image', title: 'Emerald on Dark' },
          { id: 'g6', url: PLACEHOLDER.gallery6, type: 'image', title: 'Healing Crystals' },
        ];

  return (
    <section id="gallery" className="py-24 md:py-32 px-6 bg-charcoal-900 relative">
      <div ref={ref} className={`max-w-7xl mx-auto ${visible ? 'reveal visible' : 'reveal'}`}>
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="ornament-line" />
            <span className="section-label">The Gallery</span>
            <span className="ornament-line" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-champagne-50">
            Nature's Green Masterpieces
          </h2>
          <p className="mt-4 text-champagne-100/60 font-light max-w-xl mx-auto">
            A close look at the raw beauty of the gemstones that become our jewelry —
            and the pieces themselves, captured in exquisite detail.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {items.map((item, idx) => {
            const isLarge = idx === 0 || (idx === 5 && items.length > 6);
            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : ''
                }`}
                onClick={() => setLightbox(item)}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    muted
                    loop
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-charcoal-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.type === 'video' ? (
                    <Play className="w-10 h-10 text-champagne-50 fill-champagne-50" />
                  ) : (
                    <span className="text-champagne-50 text-sm font-light tracking-wide">{item.title}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal-950/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-champagne-100/60 hover:text-champagne-50 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          {lightbox.type === 'video' ? (
            <video src={lightbox.url} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
          ) : (
            <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[85vh] rounded-lg" />
          )}
        </div>
      )}
    </section>
  );
}
