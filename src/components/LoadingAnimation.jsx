import { useEffect, useRef } from 'react';
import gsap from '../utils/gsap-config';

function LoadingAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      const circles = containerRef.current.querySelectorAll('.loading-circle');

      if (circles.length) {
        tl.from(circles, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })
        .to(circles, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: 'back.in(1.7)'
        }, '+=0.2');
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div ref={containerRef} className="flex items-center justify-center gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="loading-circle w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-400"
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingAnimation; 