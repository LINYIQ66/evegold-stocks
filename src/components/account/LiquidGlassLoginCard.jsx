import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const LiquidGlassLoginCard = ({ children }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxTilt = 15; // Slightly reduced for a more subtle effect

    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const rotateX = -((y - centerY) / centerY) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* 
        This is the main card container with the 3D tilt interaction.
        will-change and transform-style are performance optimizations.
      */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        {/* Layer 1: Blurred Background with SVG Distortion */}
        <div 
          className="absolute inset-0"
          style={{ 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // For Safari
            filter: 'url(#glass-distortion)',
            borderRadius: 'inherit'
          }}
        />
        
        {/* Layer 2: Semi-transparent Tint */}
        <div 
          className="absolute inset-0 bg-black/20"
          style={{ borderRadius: 'inherit' }}
        />

        {/* Layer 3: Shine and Border Effect */}
        <div 
          className="absolute inset-0 border border-white/20 rounded-3xl"
          style={{
            boxShadow: 'inset 0 1px 4px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 4px 0 rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }}
        />

        {/* Layer 4: Content */}
        <div className="relative z-10 p-8 md:p-12 text-white">
          {children}
        </div>
      </div>

      {/* 
        SVG filter definition. It's hidden but used by the CSS 'filter' property.
        This creates the "liquid" distortion effect on the blurred background.
      */}
      <svg className="absolute w-0 h-0">
        <filter id="glass-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.04" numOctaves="2" seed="2" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" />
        </filter>
      </svg>
    </motion.div>
  );
};

export default LiquidGlassLoginCard;