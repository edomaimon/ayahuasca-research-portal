'use client';

import { useRef, useState, useEffect } from 'react';

export default function LazyCard({ children, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(index < 6);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  if (!visible) {
    return (
      <div ref={ref} className="lazy-card-placeholder" />
    );
  }

  return children;
}
