import { useEffect, useRef } from 'react';
import gsap from '../../utils/gsap-config';

export function FadeIn({ children, direction = 'up', delay = 0, duration = 1 }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    const x = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
    const y = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;

    gsap.from(element, {
      x,
      y,
      opacity: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
      }
    });
  }, [direction, delay, duration]);

  return <div ref={elementRef}>{children}</div>;
} 