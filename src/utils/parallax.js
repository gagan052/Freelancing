import gsap from './gsap-config';

export const createParallax = (element, speed = 0.5) => {
  gsap.to(element, {
    y: () => (window.innerHeight * speed * -1),
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}; 