import { useEffect, useRef, useState } from 'react';
import { Gem } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}

export function Crystal3D() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return undefined;
    const onMove = (event: MouseEvent) => {
      if (!ref.current) return;
      const cx = event.clientX / window.innerWidth - 0.5;
      const cy = event.clientY / window.innerHeight - 0.5;
      ref.current.style.transform = `translateY(-50%) rotateX(${cy * 18}deg) rotateY(${cx * 24}deg)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);
  return (
    <div className="crystal-3d" aria-hidden="true">
      <div className="crystal-inner" ref={ref}>
        <div className="crystal-face"><Gem size={280} strokeWidth={0.3} /></div>
      </div>
      <div className="crystal-glow" />
    </div>
  );
}

/** Counts up once when scrolled into view. `year` mode shows the value without a "+" suffix. */
export function Counter({ value, label, plus = true }: { value: number; label: string; plus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return undefined;
    let raf = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      observer.disconnect();
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        setShown(Math.round((1 - (1 - p) ** 3) * value));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      setShown(0);
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, reduced]);

  return (
    <div ref={ref} className="split-stats-card">
      <strong dir="ltr">{shown}{plus ? '+' : ''}</strong>
      <span>{label}</span>
    </div>
  );
}
