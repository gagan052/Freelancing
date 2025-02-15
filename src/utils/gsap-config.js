import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configure defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 1
});

ScrollTrigger.defaults({
  markers: false,
  toggleActions: 'play none none reverse',
  start: 'top bottom-=100'
});

// Configure GSAP
gsap.config({
  nullTargetWarn: false,
  autoSleep: 60,
  force3D: true
});

export default gsap; 