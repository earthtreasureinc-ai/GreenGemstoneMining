import { useEffect, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useMedia } from '@/hooks/useMedia';
import { PLACEHOLDER } from '@/data/content';

export default function Hero() {
  const { media } = useMedia('hero');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroMedia = media.length > 0
    ? media
    : [
        { id: 'p1', public_url: PLACEHOLDER.heroMain, media_type: 'image' as const, title: 'Hero 1' },
        { id: 'p2', public_url: PLACEHOLDER.heroSecondary, media_type: 'image' as const, title: 'Hero 2' },
      ];

  useEffect(() => {
    if (heroMedia.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMedia.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMedia.length]);

  return (
    <section id="top" className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background slideshow */}
      {heroMedia.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {item.media_type === 'video' ? (
            <video
              src={item.public_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={item.public_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/60 via-charcoal-950/30 to-charcoal-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
        <div className="animate-fade-down flex items-center gap-2 mb-6">
          <span className="ornament-line" />
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="section-label">Ethically Sourced • Masterfully Crafted</span>
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="ornament-line" />
        </div>

        <h1 className="animate-fade-up text-5xl md:text-7xl lg:text-8xl font-serif font-light text-champagne-50 max-w-4xl leading-[1.1]">
          The Radiance of
          <br />
          <span className="text-gradient-emerald italic">Green Gemstones</span>
        </h1>

        <p className="animate-fade-up reveal-delay-200 mt-8 max-w-xl text-lg font-light text-champagne-100/70 leading-relaxed">
          From the depths of the earth to the height of artistry — discover rare emeralds
          and bespoke jewelry, each piece a singular expression of nature's green fire.
        </p>

        <div className="animate-fade-up reveal-delay-300 mt-10 flex flex-col sm:flex-row gap-4">
          <a href="#collection" className="btn-primary">
            Explore the Collection
          </a>
          <a href="#craftsmanship" className="btn-outline">
            Our Craft
          </a>
        </div>

        {heroMedia.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {heroMedia.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide
                    ? 'w-10 bg-emerald-400'
                    : 'w-4 bg-champagne-100/30 hover:bg-champagne-100/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-slow">
        <ArrowDown className="w-5 h-5 text-champagne-100/50" />
      </div>
    </section>
  );
}
