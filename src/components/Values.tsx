import { useReveal } from '@/hooks/useReveal';
import { Leaf, Shield, Award } from 'lucide-react';

export default function Values() {
  const { ref, visible } = useReveal();

  const values = [
    {
      icon: Leaf,
      title: 'Ethically Sourced',
      text: 'Every gemstone is traceable from mine to masterpiece. We partner only with mines that protect their workers and the land.',
    },
    {
      icon: Award,
      title: 'Master Crafted',
      text: 'Each piece is hand-finished by master goldsmiths with decades of experience, blending traditional techniques with modern design.',
    },
    {
      icon: Shield,
      title: 'Lifetime Guaranteed',
      text: 'We stand behind every piece with a lifetime guarantee and complimentary restoration, because true beauty should last forever.',
    },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-charcoal-950 relative">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto grid md:grid-cols-3 gap-12 ${visible ? 'reveal visible' : 'reveal'}`}
      >
        {values.map((value, idx) => (
          <div
            key={value.title}
            className={`text-center reveal ${visible ? 'visible' : ''} reveal-delay-${(idx + 1) * 100}`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full border border-emerald-700/30 bg-emerald-900/20">
              <value.icon className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-serif font-light text-champagne-50 mb-3">{value.title}</h3>
            <p className="text-sm font-light text-champagne-100/60 leading-relaxed max-w-xs mx-auto">
              {value.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
