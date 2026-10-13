import { useReveal } from '@/hooks/useReveal';
import { TESTIMONIALS } from '@/data/content';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const { ref, visible } = useReveal();

  return (
    <section id="testimonials" className="py-24 md:py-32 px-6 bg-charcoal-950 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className={`max-w-7xl mx-auto relative ${visible ? 'reveal visible' : 'reveal'}`}>
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="ornament-line" />
            <span className="section-label">Voices</span>
            <span className="ornament-line" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-champagne-50">
            From Those Who Wear It
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.id}
              className={`glass-card p-8 flex flex-col reveal ${visible ? 'visible' : ''} reveal-delay-${(idx + 1) * 100}`}
            >
              <Quote className="w-8 h-8 text-emerald-600 mb-4" />
              <p className="text-champagne-100/70 font-light leading-relaxed italic flex-grow mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-champagne-300/10">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-emerald-700/30"
                />
                <div>
                  <h4 className="text-champagne-50 font-serif text-lg">{t.name}</h4>
                  <p className="text-xs text-champagne-100/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
