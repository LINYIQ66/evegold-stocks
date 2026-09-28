import { useEffect, useState } from 'react';

// Display-only movement anchored to the latest API price. Never use for orders or balances.
export default function useIndicativePrices(source) {
  const [display, setDisplay] = useState({});

  useEffect(() => {
    const base = Object.fromEntries(
      Object.entries(source || {}).map(([symbol, quote]) => [symbol, typeof quote === 'number' ? quote : quote?.price])
        .filter(([, price]) => Number.isFinite(price) && price > 0)
    );
    setDisplay(base);
    if (!Object.keys(base).length) return;

    let timer;
    const tick = () => {
      setDisplay(Object.fromEntries(Object.entries(base).map(([symbol, price]) => {
        const amplitude = 0.0005 + Math.random() * 0.0005;
        return [symbol, price * (1 + (Math.random() < 0.5 ? -1 : 1) * amplitude)];
      })));
      timer = setTimeout(tick, 1000 + Math.random() * 1000);
    };
    timer = setTimeout(tick, 1000 + Math.random() * 1000);
    return () => clearTimeout(timer);
  }, [source]);

  return display;
}