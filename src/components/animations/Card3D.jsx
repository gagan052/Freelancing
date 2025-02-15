import { useEffect, useRef } from 'react';

export function Card3D({ children, className = '' }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    let bounds;

    const rotateToMouse = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      card.style.transform = `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
        )
      `;
      card.style.background = `
        radial-gradient(
          circle at
          ${center.x * 2 + bounds.width / 2}px
          ${center.y * 2 + bounds.height / 2}px,
          rgba(255, 255, 255, 0.15),
          transparent 40%
        )
      `;
    };

    const resetStyles = () => {
      card.style.transform = '';
      card.style.background = '';
    };

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };

    const handleMouseEnter = () => {
      updateBounds();
      document.addEventListener('mousemove', rotateToMouse);
    };

    const handleMouseLeave = () => {
      document.removeEventListener('mousemove', rotateToMouse);
      resetStyles();
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateBounds);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateBounds);
      document.removeEventListener('mousemove', rotateToMouse);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
} 