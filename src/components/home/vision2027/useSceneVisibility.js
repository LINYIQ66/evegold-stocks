import { useEffect, useState } from 'react';

export default function useSceneVisibility(containerRef) {
  const [visible, setVisible] = useState(false);
  const [automatic, setAutomatic] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const update = () => setAutomatic(!preference.matches && !connection?.saveData && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType));
    update();
    preference.addEventListener?.('change', update);
    connection?.addEventListener?.('change', update);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0.05 }) : null;
    if (observer && containerRef.current) observer.observe(containerRef.current);
    else setVisible(true);
    return () => { observer?.disconnect(); preference.removeEventListener?.('change', update); connection?.removeEventListener?.('change', update); };
  }, [containerRef]);
  return { visible, automatic };
}