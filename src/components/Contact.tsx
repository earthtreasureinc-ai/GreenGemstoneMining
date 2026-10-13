import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Mail, Check } from 'lucide-react';

export default function Contact() {
  const { ref, visible } = useReveal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-6 bg-gradient-to-b from-charcoal-950 to-emerald-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className={`max-w-3xl mx-auto text-center relative ${visible ? 'reveal visible' : 'reveal'}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="ornament-line" />
          <span className="section-label">Stay Connected</span>
          <span className="ornament-line" />
        </div>

        <h2 className="text-4xl md:text-5xl font-serif font-light text-champagne-50 mb-6">
          Join the Verdantia Circle
        </h2>
        <p className="text-champagne-100/60 font-light leading-relaxed mb-10 max-w-xl mx-auto">
          Be the first to see new collections, private viewing invitations, and stories from our atelier.
          We write rarely, and never share your information.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-grow">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne-100/30" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full pl-12 pr-4 py-3.5 bg-charcoal-900/60 border border-champagne-300/15 rounded-sm text-champagne-50 placeholder-champagne-100/30 focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>
          <button type="submit" className="btn-gold whitespace-nowrap">
            {submitted ? (
              <span className="flex items-center gap-2 justify-center">
                <Check className="w-4 h-4" /> Subscribed
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
