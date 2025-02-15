import gsap from './gsap-config';

export const fadeInUp = (element) => {
  if (!element) return null;
  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
};

export const staggerCards = (elements, stagger = 0.2) => {
  if (!elements || elements.length === 0) return null;
  return gsap.from(elements, {
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: stagger,
    scrollTrigger: {
      trigger: elements,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
};

export const scaleIn = (element) => {
  return gsap.from(element, {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
};

export const slideIn = (element, direction = 'left') => {
  const x = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
  const y = direction === 'up' ? 100 : direction === 'down' ? -100 : 0;

  return gsap.from(element, {
    x,
    y,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
}; 