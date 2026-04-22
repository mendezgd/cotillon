import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1920&q=80',
    badge: '🎉 Cotillón y fiestas',
    headline: 'Hacé que cada\ncelebración sea mágica',
    sub: 'Globos, disfraces, decoración y cotillón. Envío a todo el país.',
    cta: { label: 'Ver productos', to: '/productos' },
    align: 'center' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1920&q=80',
    badge: '🎈 Globos y decoración',
    headline: 'Todo para decorar\ntu fiesta perfecta',
    sub: 'Guirnaldas, banners, globos metalizados y mucho más.',
    cta: { label: 'Ver decoración', to: '/productos?categoria=decoracion' },
    align: 'left' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=80',
    badge: '🎊 Ofertas especiales',
    headline: 'Envío gratis\nen compras +$10.000',
    sub: 'Celebrá con todo sin pagar de más. Entrega rápida en todo el país.',
    cta: { label: 'Ver ofertas', to: '/productos?categoria=cotillon' },
    align: 'right' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1920&q=80',
    badge: '🥳 Disfraces',
    headline: 'Disfraces para\ntoda la familia',
    sub: 'Unicornios, superhéroes, princesas y más. Tallas para chicos y grandes.',
    cta: { label: 'Ver disfraces', to: '/productos?categoria=disfraces' },
    align: 'center' as const,
  },
];

const INTERVAL = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex(next);
  }, []);

  const prev = () => go((index - 1 + SLIDES.length) % SLIDES.length, -1);
  const next = () => go((index + 1) % SLIDES.length, 1);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go((index + 1) % SLIDES.length, 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const slide = SLIDES[index];
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const textAlign = slide.align === 'center' ? 'center' : 'left';

  return (
    <section
      style={{ position: 'relative', width: '100%', height: 'clamp(480px, 72vh, 720px)', overflow: 'hidden', backgroundColor: '#1c1a17' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide images (crossfade) ── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d > 0 ? '6%' : '-6%', opacity: 0 }),
            center: { x: '0%', opacity: 1 },
            exit:  (d: number) => ({ x: d > 0 ? '-6%' : '6%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Gradient overlay — readable text at all times */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.72) 100%)',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Text content ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: alignMap[slide.align],
        justifyContent: 'flex-end',
        padding: 'clamp(24px,5vw,64px)',
        paddingBottom: 'clamp(48px,7vh,96px)',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: alignMap[slide.align], gap: '16px', maxWidth: '600px', textAlign }}
          >
            <span style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700,
              color: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px', padding: '5px 14px', letterSpacing: '0.05em',
            }}>
              {slide.badge}
            </span>

            <h1 style={{
              fontSize: 'clamp(2rem,5.5vw,3.75rem)', fontWeight: 700,
              lineHeight: 1.06, letterSpacing: '-1.5px',
              color: '#fff',
              whiteSpace: 'pre-line',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              {slide.headline}
            </h1>

            <p style={{
              fontSize: 'clamp(14px,1.8vw,18px)', lineHeight: 1.5,
              color: 'rgba(255,255,255,0.8)',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
              maxWidth: '460px',
            }}>
              {slide.sub}
            </p>

            <Link
              to={slide.cta.to}
              style={{
                marginTop: '4px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '8px',
                fontSize: '14px', fontWeight: 700,
                color: '#1c1a17', backgroundColor: '#fcfbf8',
                textDecoration: 'none', transition: 'opacity 0.15s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {slide.cta.label} <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Prev / Next arrows ── */}
      {[
        { label: 'Anterior', icon: <ChevronLeft style={{ width: 20, height: 20 }} />, onClick: prev, side: 'left' },
        { label: 'Siguiente', icon: <ChevronRight style={{ width: 20, height: 20 }} />, onClick: next, side: 'right' },
      ].map(({ label, icon, onClick, side }) => (
        <button
          key={side}
          aria-label={label}
          onClick={onClick}
          style={{
            position: 'absolute', top: '50%', [side]: '16px',
            transform: 'translateY(-50%)',
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.28)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
        >
          {icon}
        </button>
      ))}

      {/* ── Dot indicators ── */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', alignItems: 'center',
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a slide ${i + 1}`}
            onClick={() => go(i, i > index ? 1 : -1)}
            style={{
              width: i === index ? '24px' : '8px', height: '8px',
              borderRadius: '9999px', border: 'none', cursor: 'pointer',
              backgroundColor: i === index ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'width 0.3s ease, background-color 0.2s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      {!paused && (
        <motion.div
          key={`progress-${index}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
            backgroundColor: 'rgba(255,255,255,0.6)',
            transformOrigin: 'left',
          }}
        />
      )}
    </section>
  );
}
