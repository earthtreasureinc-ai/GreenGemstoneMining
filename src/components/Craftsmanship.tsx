import { useReveal } from '@/hooks/useReveal';
import { useMedia } from '@/hooks/useMedia';
import { PLACEHOLDER } from '@/data/content';
import { Hammer, Search, Gem } from 'lucide-react';

export default function Craftsmanship() {
  const { ref, visible } = useReveal();
  const { media } = useMedia('craftsmanship');

  const mainImage = media.find((m) => m.media_type === 'image')?.public_url || PLACEHOLDER.craftMain;
  const secondaryImage = media.length > 1 ? media[1].public_url : PLACEHOLDER.craftSecondary;

  const steps = [
    {
      icon: Search,
      title: 'Sourcing',
      text: 'We travel to mines across Colombia, Zambia, and Brazil, hand-selecting each stone for its color, clarity, and character.',
    },
    {
      icon: Hammer,
      title: 'Crafting',
      text: 'Our master goldsmiths spend weeks shaping each piece, marrying ancient techniques with precision modern tools.',
    },
    {
      icon: Gem,
      title: 'Finishing',
      text: 'Every facet is polished by hand, every setting inspected under loupe — perfection is the only acceptable result.',
    },
  ];

  return (
    <section id="craftsmanship" className="py-24 md:py-32 px-6 bg-gradient-to-b from-charcoal-950 to-charcoal-900 relative">
      <div ref={ref} className={`max-w-7xl mx-auto ${visible ? 'reveal visible' : 'reveal'}`}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] shadow-2xl">
              <img src={mainImage} alt="Craftsmanship" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-4 md:-right-8 w-40 h-52 md:w-56 md:h-72 rounded-lg overflow-hidden shadow-2xl border-4 border-charcoal-950">
              <img src={secondaryImage} alt="Detail" className="w-full h-full object-cover" />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-emerald-700/30 rounded-lg -z-10" />
          </div>

          {/* Text content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="ornament-line" />
              <span className="section-label">The Atelier</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-champagne-50 leading-tight mb-6">
              Where Earth's Fire<br />Meets Human Art
            </h2>
            <p className="text-champagne-100/60 font-light leading-relaxed mb-10">
              For three generations, our atelier has transformed raw gemstones into wearable poetry.
              Each piece passes through the hands of artisans who have dedicated their lives to this craft —
              from the geologists who source our stones to the goldsmiths who bring the final design to life.
            </p>

            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div
                  key={step.title}
                  className={`flex gap-5 reveal ${visible ? 'visible' : ''} reveal-delay-${(idx + 1) * 100}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-emerald-700/30 bg-emerald-900/20 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif text-champagne-50 mb-1">{step.title}</h4>
                    <p className="text-sm text-champagne-100/50 font-light leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
