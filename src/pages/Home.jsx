import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from '../utils/gsap-config';
import { 
  CodeBracketIcon, 
  PencilSquareIcon, 
  PaintBrushIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import ParticleBackground from '../components/ParticleBackground';
import { Card3D } from '../components/animations/Card3D';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import Chat from '../components/Chat';
import ChatButton from '../components/ChatButton';
import { useChat } from '../contexts/ChatContext';

function Home() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [activeValue, setActiveValue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);
  const { isOpen } = useChat();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial fade in with better easing
      gsap.to(mainRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Enhanced hero animations
      const heroTimeline = gsap.timeline();
      
      heroTimeline
        .from(heroRef.current.querySelector('h1'), {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'back.out(1.2)'
        })
        .from(heroRef.current.querySelector('p'), {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.6')
        .from(heroRef.current.querySelectorAll('a'), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        }, '-=0.4');

      // Parallax effect for hero video
      gsap.to(heroRef.current.querySelector('video'), {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Enhanced scroll animations
      const stats = statsRef.current.querySelectorAll('.stat-card');
      gsap.from(stats, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      });

      // Features with staggered reveal
      const features = featuresRef.current.querySelectorAll('.feature-card');
      features.forEach((feature, index) => {
        gsap.from(feature, {
          x: index % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Categories with scale effect
      const categories = categoriesRef.current.querySelectorAll('button');
      gsap.from(categories, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      });

      // Add floating animation to images
      gsap.to('.floating-image', {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: {
          each: 0.2,
          from: 'random'
        }
      });

      // Add shine effect to cards
      gsap.to('.shine', {
        x: '150%',
        duration: 1.5,
        repeat: -1,
        ease: 'power2.inOut',
        delay: 1
      });
    });

    return () => ctx.revert();
  }, []);

  const handleCategoryClick = (category) => {
    navigate('/jobs', { state: { category: category.name.toLowerCase() } });
  };

  // Update the featuredSection with this enhanced version
  const featuredSection = (
    <section className="py-20 relative overflow-hidden">


      {/* ================================= Background Elements ========================================*/}


      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-white dark:from-gray-900/30 dark:to-gray-800" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-purple-50 dark:bg-purple-900/20 transform skew-x-12 translate-x-1/2" />
      
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-4"
      >
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Left Column */}
          <div className="md:w-1/2">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl opacity-20 blur-lg" />
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl">
                <motion.h2 
                  className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                {/* ----------------------------------------============------------------------------------ */}
                  Why Choose AbilityWorks?
                </motion.h2>

                {[
                  {
                    title: 'Inclusive Platform Design',
                    description: 'Built with accessibility at its core, ensuring everyone can participate fully.',
                    icon: '🎯',
                    stats: '100% WCAG Compliant'
                  },
                  {
                    title: 'Specialized Support',
                    description: 'Dedicated team trained to assist users with different abilities.',
                    icon: '🤝',
                    stats: '24/7 Support Available'
                  },
                  {
                    title: 'Fair Opportunities',
                    description: 'Equal access to high-quality projects and competitive rates.',
                    icon: '⭐',
                    stats: '5000+ Active Projects'
                  },
                  {
                    title: 'Growing Community',
                    description: 'Connect with like-minded professionals and supportive clients.',
                    icon: '🌱',
                    stats: '10K+ Members'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative mb-6 last:mb-0"
                  >
                    <Card3D>
                      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            <span className="transform group-hover:rotate-12 transition-transform">
                              {feature.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {feature.description}
                            </p>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              whileHover={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                                {feature.stats}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>


          {/* ================================  Right Column ======================================*/}


          <div className="md:w-1/2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="relative group"
            >


              {/*====================================== Video Container ==================================*/}


              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl opacity-20 blur-lg 
                            group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <video
                    className="w-full transform group-hover:scale-105 transition-transform duration-300"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/videos/platform-demo.mp4" type="video/mp4" />
                  </video>


                  
                  {/* ===========================   Video Overlay   =================================== */}



                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">See AbilityWorks in Action</h3>
                      <p className="text-sm text-gray-200">Watch how our platform empowers professionals</p>
                    </div>
                  </div>


                  {/*=============================== Play Button Overlay =============================*/}


                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>


              {/*==================================== Stats Below Video =================================*/}


              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: 'Success Rate', value: '95%' },
                  { label: 'Active Users', value: '10K+' },
                  { label: 'Projects Completed', value: '25K+' }
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center"
                  >
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );

  // =========================Update the testimonialTabs section with this enhanced version


  const TestimonialSection = () => {
    const testimonials = {
      all: [
        {
          name: "Gagan Saini",
          role: "Frontend Developer",
          company: "Google",
          image: "https://replicate.delivery/pbxt/IJe5o8kW1mQxRrZZM4T4xbIzGRsNq7UgPaP5sRhg5mxiE7FC/out-0.png", 
        
          //================================= Professional male developer

          quote: "AbilityWorks has transformed my career. The platform's accessibility features make it easy to showcase my skills.",
          rating: 5,
          projectCount: 24,
          earnings: "$45K+",
          type: "freelancer"
        },
        {
          name: "Gagan Saini",
          role: "Project Manager",
          company: "Microsoft",
          image: "https://replicate.delivery/pbxt/O6HW1Qd0K5Qqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", 
          
          // ===============================Professional female manager

          quote: "Finding talented developers has never been easier. The platform's inclusive approach brings amazing results.",
          rating: 5,
          hireCount: 15,
          successRate: "98%",
          type: "client"
        },

        // ======================================Add more testimonials...

      ],
      freelancers: [
        {
          name: "Gagan Saini",
          role: "UX Designer",
          company: "Freelancer",
          image: "https://replicate.delivery/pbxt/Qr4uIY7OyaZwp2qZqvqgPYXHvtMGXZnIvR9Ig6HwnmvnE7FC/out-0.png", // UX designer portrait
          quote: "The platform's commitment to accessibility sets it apart. I can work independently and efficiently.",
          rating: 5,
          projectCount: 32,
          earnings: "$60K+",
          skills: ["UI/UX", "Accessibility", "Design Systems"]
        },


        // =======================  Add more freelancer testimonials...


      ],
      clients: [
        {
          name: "Gagan Saini",
          role: "HR Director",
          company: "Adobe",
          image: "https://replicate.delivery/pbxt/W8HZDQpKvVXn0YmzLJQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // HR director portrait
          quote: "We've built an incredible team through AbilityWorks. The talent pool is exceptional.",
          rating: 5,
          hireCount: 20,
          successRate: "95%",
          industries: ["Tech", "Design", "Marketing"]
        },


        // ======================================  Add more client testimonials...

        
      ]
    };

    return (
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/patterns/dots.svg)',
              backgroundSize: '30px 30px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '30px 30px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Real stories from our community members
            </p>

            {/* =============================Enhanced Tab Navigation ================================*/}


            <div className="flex justify-center gap-4 mb-12">
              {['all', 'freelancers', 'clients'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    initial={false}
                    animate={{
                      opacity: activeTab === tab ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="relative z-10">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ================================== Testimonial Cards ===================================*/}


          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials[activeTab].map((testimonial, index) => (
                <Card3D key={testimonial.name}>
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative overflow-hidden group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* ======================Decorative Background ======================*/}

                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
                    
                    {/*======================== Profile Section ===========================*/}
                    <div className="relative flex items-center gap-4 mb-6">
                      <motion.img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/20"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      />
                      <div>
                        <h3 className="font-semibold text-lg dark:text-white">{testimonial.name}</h3>
                        <p className="text-purple-600 dark:text-purple-400">{testimonial.role}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                      </div>
                    </div>

                    {/*============================ Quote ==============================*/}


                    <blockquote className="text-gray-600 dark:text-gray-300 mb-6 relative">
                      <span className="absolute -top-2 -left-2 text-4xl text-purple-200 dark:text-purple-900">"</span>
                      <p className="relative z-10 italic">{testimonial.quote}</p>
                    </blockquote>

                    {/*============================= Stats ==============================*/}


                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {testimonial.type === 'freelancer' ? (
                        <>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="font-bold text-purple-600 dark:text-purple-400">{testimonial.projectCount}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="font-bold text-purple-600 dark:text-purple-400">{testimonial.earnings}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Earned</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="font-bold text-purple-600 dark:text-purple-400">{testimonial.hireCount}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Hires</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="font-bold text-purple-600 dark:text-purple-400">{testimonial.successRate}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Success</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/*================================== Rating =================================*/}


                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.svg
                            key={i}
                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </motion.svg>
                        ))}
                      </div>
                      <motion.button
                        className="text-purple-600 dark:text-purple-400 text-sm hover:underline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Profile
                      </motion.button>
                    </div>
                  </motion.div>
                </Card3D>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ================================Call to Action =================================*/}


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg 
                hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              View All Success Stories
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  };

  // ======================  ========== Add this section before the categories section


  const testimonialTabs = (
    <TestimonialSection />
  );

  // ========================================= Add floating elements to the hero section
  const floatingElements = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"
      />
    </div>
  );

  // =============================== Replace the existing featuresShowcase section with this enhanced version
  const PlatformFeatures = () => {
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [showDemo, setShowDemo] = useState(false);

    const features = [
      {
        title: 'Screen Reader Optimized',
        description: 'Fully compatible with popular screen readers',
        icon: '🎯',
        color: 'purple',
        stats: '100% WCAG Compliant',
        details: [
          'NVDA and VoiceOver support',
          'ARIA labels integration',
          'Semantic HTML structure',
          'Keyboard focus indicators'
        ],
        demoUrl: '/demos/screen-reader.mp4'
      },
      {
        title: 'Keyboard Navigation',
        description: 'Complete keyboard accessibility',
        icon: '⌨️',
        color: 'blue',
        stats: 'Zero Mouse Dependency',
        details: [
          'Custom shortcut keys',
          'Focus management',
          'Skip navigation links',
          'Logical tab order'
        ],
        demoUrl: '/demos/keyboard-nav.mp4'
      },
      {
        title: 'Color Contrast',
        description: 'WCAG 2.1 compliant color schemes',
        icon: '🎨',
        color: 'green',
        stats: 'AAA Level Contrast',
        details: [
          'High contrast mode',
          'Custom color themes',
          'Text scaling support',
          'Dark mode optimization'
        ],
        demoUrl: '/demos/color-contrast.mp4'
      },
      {
        title: 'Adaptive Interface',
        description: 'Customizable user experience',
        icon: '🔧',
        color: 'pink',
        stats: 'Personalized UX',
        details: [
          'Font size adjustment',
          'Motion reduction',
          'Layout customization',
          'Input assistance'
        ],
        demoUrl: '/demos/adaptive-ui.mp4'
      }
    ];

    return (
      <section className="py-24 relative overflow-hidden">

        {/*============================= Enhanced Background =========================*/}


        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 dark:from-gray-900/30 dark:via-gray-800 dark:to-gray-900/30" />
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(/images/patterns/circuit.svg)',
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4">

          {/* ==============================Enhanced Header =============================*/}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built with accessibility and inclusivity at its core
            </p>
          </motion.div>

          {/*============================ Features Grid =======================================*/}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card3D key={feature.title}>
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="group relative h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-hidden"
                    onMouseEnter={() => setHoveredFeature(feature.title)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    whileHover={{ y: -5 }}
                  >

                    {/*================================== Animated Background ===========================*/}

                    
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-transparent`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredFeature === feature.title ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 mb-6 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 
                        flex items-center justify-center text-3xl relative z-10`}
                      animate={{ 
                        scale: hoveredFeature === feature.title ? 1.1 : 1,
                        rotate: hoveredFeature === feature.title ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>

                      {/* Stats Badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
                          bg-${feature.color}-100 dark:bg-${feature.color}-900/30 
                          text-${feature.color}-600 dark:text-${feature.color}-400`}
                        >
                          {feature.stats}
                        </span>
                      </div>

                      {/* Expandable Details */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: hoveredFeature === feature.title ? 'auto' : 0,
                          opacity: hoveredFeature === feature.title ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 mb-4">
                          {feature.details.map((detail, i) => (
                            <motion.li
                              key={detail}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ 
                                opacity: hoveredFeature === feature.title ? 1 : 0,
                                x: hoveredFeature === feature.title ? 0 : -20
                              }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {detail}
                            </motion.li>
                          ))}
                        </ul>
                        <motion.button
                          onClick={() => setShowDemo(feature.demoUrl)}
                          className={`w-full py-2 rounded-lg text-sm text-white 
                            bg-${feature.color}-500 hover:bg-${feature.color}-600 transition-colors`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Watch Demo
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </Card3D>
            ))}
          </div>

          {/* Demo Modal */}
          <AnimatePresence>
            {showDemo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowDemo(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-w-4xl w-full"
                  onClick={e => e.stopPropagation()}
                >
                  <video
                    src={showDemo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full"
                  />
                  <button
                    onClick={() => setShowDemo(false)}
                    className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  };

  // Add notification system
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const SuccessStories = () => {
    const stories = [
      {
        name: "Sarah Johnson",
        role: "Web Developer",
        quote: "AbilityWorks helped me showcase my programming skills and find clients who value my work.",
        image: "https://replicate.delivery/pbxt/Y3u1ExVbNlZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Professional female developer
        stats: {
          projectsCompleted: 45,
          earnings: "$52K+",
          rating: 4.9
        },
        skills: ["React", "Accessibility", "TypeScript", "UI/UX"]
      },
      {
        name: "Michael Chen",
        role: "Content Writer",
        quote: "The platform's accessibility features make it easy for me to work independently.",
        image: "https://replicate.delivery/pbxt/Z4v2FyWcOlZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Professional male writer
        stats: {
          projectsCompleted: 78,
          earnings: "$34K+",
          rating: 4.8
        },
        skills: ["Technical Writing", "SEO", "Content Strategy", "Editing"]
      },
      {
        name: "Emily Rodriguez",
        role: "Graphic Designer",
        quote: "I found a supportive community that celebrates diversity and promotes inclusion.",
        image: "https://replicate.delivery/pbxt/A5w3GzXdPmZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Professional female designer
        stats: {
          projectsCompleted: 92,
          earnings: "$48K+",
          rating: 4.9
        },
        skills: ["UI Design", "Branding", "Illustration", "Motion Graphics"]
      }
    ];

    return (
      <section ref={statsRef} className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet our talented freelancers who have found success through AbilityWorks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <Card3D key={story.name}>
                <motion.div
                  className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setActiveStory(story)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    whileHover={{ scale: 1.1 }}
                  />

                  <div className="relative z-10">
                    {/* Profile Image */}
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 object-cover mx-auto transform group-hover:scale-110 transition-transform duration-300 relative z-10"
                      />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-2 dark:text-white text-center">{story.name}</h3>
                    <p className="text-purple-600 dark:text-purple-400 mb-4 text-center">{story.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 italic text-center mb-6">"{story.quote}"</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(story.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {value}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {story.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      Click to view full story
                    </span>
                  </motion.div>
                </motion.div>
              </Card3D>
            ))}
          </div>

          {/* Enhanced Modal */}
          <AnimatePresence>
            {activeStory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setActiveStory(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-3xl w-full relative"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setActiveStory(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <img
                        src={activeStory.image}
                        alt={activeStory.name}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                      <div className="mt-6 space-y-4">
                        <h3 className="text-2xl font-bold dark:text-white">{activeStory.name}</h3>
                        <p className="text-purple-600 dark:text-purple-400">{activeStory.role}</p>
                        <div className="flex flex-wrap gap-2">
                          {activeStory.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <blockquote className="text-lg text-gray-600 dark:text-gray-300 italic">
                        "{activeStory.quote}"
                      </blockquote>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(activeStory.stats).map(([key, value]) => (
                          <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              {value}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  };

  // Replace the MissionSection with this new ImpactSection
  const ImpactSection = () => {
    const [activeMetric, setActiveMetric] = useState(null);

    const metrics = [
      {
        category: "Job Creation",
        stats: [
          {
            value: "10,000+",
            label: "Jobs Created",
            icon: "💼",
            detail: "Remote opportunities created for professionals with disabilities"
          },
          {
            value: "$15M+",
            label: "Economic Impact",
            icon: "💰",
            detail: "Total earnings generated through our platform"
          }
        ]
      },
      {
        category: "Community Growth",
        stats: [
          {
            value: "85%",
            label: "Employment Rate",
            icon: "📈",
            detail: "Of our active users found meaningful work"
          },
          {
            value: "50+",
            label: "Countries",
            icon: "🌍",
            detail: "Global community spanning across continents"
          }
        ]
      },
      {
        category: "Skills Development",
        stats: [
          {
            value: "25,000+",
            label: "Training Hours",
            icon: "📚",
            detail: "Free skill development and training provided"
          },
          {
            value: "95%",
            label: "Skill Growth",
            icon: "🎯",
            detail: "Users reported significant skill improvement"
          }
        ]
      }
    ];

    return (
      <section className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 dark:from-gray-900/30 dark:via-gray-800 dark:to-gray-900/30" />
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(/images/patterns/impact.svg)',
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Impact & Growth
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Creating measurable change in the lives of professionals with disabilities
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 text-center">
                  {section.category}
                </h3>
                
                {section.stats.map((metric) => (
                  <Card3D key={metric.label}>
                    <motion.div
                      className="relative bg-white dark:bg-gray-800 p-6 rounded-xl overflow-hidden"
                      onMouseEnter={() => setActiveMetric(metric.label)}
                      onMouseLeave={() => setActiveMetric(null)}
                      whileHover={{ y: -5 }}
                    >
                      {/* Animated Background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: activeMetric === metric.label ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                          className="text-4xl mb-4"
                          animate={{
                            scale: activeMetric === metric.label ? 1.2 : 1,
                            rotate: activeMetric === metric.label ? [0, -10, 10, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {metric.icon}
                        </motion.div>

                        {/* Value */}
                        <motion.div
                          className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2"
                          animate={{
                            scale: activeMetric === metric.label ? 1.1 : 1
                          }}
                        >
                          {metric.value}
                        </motion.div>

                        {/* Label */}
                        <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                          {metric.label}
                        </div>

                        {/* Detail */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: activeMetric === metric.label ? 'auto' : 0,
                            opacity: activeMetric === metric.label ? 1 : 0
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {metric.detail}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Card3D>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-16"
          >
            <Link
              to="/impact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg 
                hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              View Detailed Impact Report
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  };

  const CategoriesSection = () => {
    const categories = [
      { 
        name: 'Web Development',
        icon: "https://replicate.delivery/pbxt/U9q7AtRXJlZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Modern code icon
        count: '850+',
        color: 'purple',
        skills: ['React', 'Node.js', 'Python', 'WordPress'],
        description: 'Build accessible and responsive web applications',
        topCompanies: ['Google', 'Microsoft', 'Amazon']
      },
      {
        name: 'Content Writing',
        icon: "https://replicate.delivery/pbxt/V0r8BuSYKlZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Writing icon
        count: '620+',
        color: 'blue',
        skills: ['SEO', 'Blogging', 'Copywriting', 'Technical Writing'],
        description: 'Create engaging and accessible content',
        topCompanies: ['HubSpot', 'Shopify', 'Adobe']
      },
      {
        name: 'Graphic Design',
        icon: "https://replicate.delivery/pbxt/W1s9CvTZLlZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Design tools icon
        count: '450+',
        color: 'pink',
        skills: ['UI/UX', 'Illustration', 'Branding', 'Motion Graphics'],
        description: 'Design inclusive visual experiences',
        topCompanies: ['Apple', 'Figma', 'Canva']
      },
      {
        name: 'Virtual Assistance',
        icon: "https://replicate.delivery/pbxt/X2t0DwUaMlZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png", // Virtual support icon
        count: '380+',
        color: 'green',
        skills: ['Admin Support', 'Data Entry', 'Customer Service', 'Scheduling'],
        description: 'Provide remote administrative support',
        topCompanies: ['Asana', 'Slack', 'Zoom']
      }
    ];

    return (
      <section ref={categoriesRef} className="relative py-20 overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30 dark:from-gray-900/30 dark:via-gray-800 dark:to-gray-900/30" />
        <motion.div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'url(/images/backgrounds/pattern-2.svg)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Featured Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore opportunities across various fields, each designed to be inclusive and accessible
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card3D key={category.name}>
                <motion.div
                  className="relative h-full"
                  onHoverStart={() => setHoveredCategory(category.name)}
                  onHoverEnd={() => setHoveredCategory(null)}
                >
                  <motion.button
                    onClick={() => handleCategoryClick(category)}
                    className={`group relative w-full h-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg 
                      transition-all duration-300 overflow-hidden`}
                    whileHover={{ y: -5 }}
                  >
                    {/* Enhanced Background Gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br from-${category.color}-500/20 via-${category.color}-500/10 to-transparent`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredCategory === category.name ? 1 : 0,
                        scale: hoveredCategory === category.name ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Enhanced Icon Animation */}
                    <motion.div
                      className="relative z-10 mb-6"
                      animate={{
                        scale: hoveredCategory === category.name ? 1.1 : 1,
                        rotate: hoveredCategory === category.name ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className={`w-16 h-16 mx-auto rounded-full bg-${category.color}-100 
                          dark:bg-${category.color}-900/30 flex items-center justify-center
                          group-hover:shadow-lg group-hover:shadow-${category.color}-500/20`}
                        animate={{
                          boxShadow: hoveredCategory === category.name ? 
                            `0 0 20px ${category.color}40` : "none"
                        }}
                      >
                        <motion.img
                          src={category.icon}
                          alt=""
                          className="w-8 h-8"
                          animate={{
                            scale: hoveredCategory === category.name ? 1.2 : 1
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Enhanced Content Animation */}
                    <div className="relative z-10 text-center">
                      <motion.h3 
                        className="text-xl font-semibold mb-2 dark:text-white"
                        animate={{
                          color: hoveredCategory === category.name ? 
                            `var(--${category.color}-600)` : "currentColor"
                        }}
                      >
                        {category.name}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600 dark:text-gray-300 mb-4"
                        animate={{
                          opacity: hoveredCategory === category.name ? 0.9 : 0.7
                        }}
                      >
                        {category.description}
                      </motion.p>
                      <motion.div 
                        className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4"
                        animate={{
                          scale: hoveredCategory === category.name ? 1.1 : 1
                        }}
                      >
                        {category.count} jobs
                      </motion.div>

                      {/* Enhanced Skills Animation */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: hoveredCategory === category.name ? 'auto' : 0,
                          opacity: hoveredCategory === category.name ? 1 : 0
                        }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {category.skills.map((skill, index) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ 
                                opacity: hoveredCategory === category.name ? 1 : 0,
                                y: hoveredCategory === category.name ? 0 : 10
                              }}
                              transition={{ delay: index * 0.1 }}
                              className={`px-2 py-1 text-xs rounded-full bg-${category.color}-100 
                                dark:bg-${category.color}-900/30 text-${category.color}-600 
                                dark:text-${category.color}-400 transform hover:scale-110 transition-transform`}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: hoveredCategory === category.name ? 1 : 0,
                            y: hoveredCategory === category.name ? 0 : 10
                          }}
                          className="text-sm text-gray-500 dark:text-gray-400"
                        >
                          Top companies: {category.topCompanies.join(', ')}
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Enhanced Bottom Indicator */}
                    <motion.div
                      className={`absolute bottom-0 left-0 w-full h-1 bg-${category.color}-500`}
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: hoveredCategory === category.name ? 1 : 0,
                        boxShadow: hoveredCategory === category.name ? 
                          `0 0 10px ${category.color}60` : "none"
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </motion.div>
              </Card3D>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-lg 
                hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              View All Categories
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  };

  // Update the hero section content
  const heroContent = {
    title: "EnableFreelance",
    subtitle: "Where Abilities Take Center Stage",
    description: "The premier platform connecting talented individuals with disabilities to inclusive employers worldwide. Our mission is to empower and showcase the unique skills of our community.",
    stats: [
      { label: 'Active Jobs', value: '1,000+', icon: '💼' },
      { label: 'Freelancers', value: '5,000+', icon: '👥' },
      { label: 'Success Rate', value: '92%', icon: '⭐' },
      { label: 'Total Earnings', value: '$500K+', icon: '💰' }
    ]
  };

  // Update the features section
  const features = [
    {
      title: 'Sign Language Recognition',
      description: 'Advanced YOLOv5-powered sign language interpretation for seamless communication',
      icon: '🤟',
      stats: 'Real-time Recognition'
    },
    {
      title: 'Voice Control Interface',
      description: 'Complete voice-controlled navigation and project management capabilities',
      icon: '🎤',
      stats: 'Voice-Enabled IDE'
    },
    {
      title: 'Adaptive Technologies',
      description: 'Customizable interface with screen reader optimization and keyboard navigation',
      icon: '⌨️',
      stats: 'WCAG 2.1 Compliant'
    },
    {
      title: 'Inclusive Community',
      description: 'Connect with a supportive network of professionals and inclusive employers',
      icon: '🤝',
      stats: '5000+ Members'
    }
  ];

  // Update the categories section
  const categories = [
    {
      name: 'Technology',
      description: 'Software development, web design, and IT support roles',
      count: '450+',
      skills: ['Programming', 'Web Development', 'IT Support', 'UX/UI Design']
    },
    {
      name: 'Creative Arts',
      description: 'Digital art, graphic design, and multimedia content creation',
      count: '320+',
      skills: ['Digital Art', 'Graphic Design', 'Animation', 'Video Editing']
    },
    {
      name: 'Professional Services',
      description: 'Virtual assistance, content writing, and consulting',
      count: '280+',
      skills: ['Virtual Assistance', 'Writing', 'Consulting', 'Data Entry']
    },
    {
      name: 'Education',
      description: 'Online tutoring, course creation, and educational content',
      count: '200+',
      skills: ['Tutoring', 'Course Creation', 'Language Teaching', 'Educational Content']
    }
  ];

  // Update the impact metrics
  const impactMetrics = {
    employment: {
      title: 'Employment Impact',
      value: '1000+',
      description: 'Professionals placed in meaningful roles'
    },
    earnings: {
      title: 'Economic Impact',
      value: '$500K+',
      description: 'Generated through our platform'
    },
    companies: {
      title: 'Partner Companies',
      value: '200+',
      description: 'Inclusive employers worldwide'
    }
  };

  // Update testimonials
  const testimonials = [
    {
      name: "David Chen",
      role: "Software Developer",
      quote: "EnableFreelance's voice control features allow me to code efficiently despite my mobility challenges.",
      image: "path/to/image",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Graphic Designer",
      quote: "The platform's adaptive interface helps me showcase my creative work to global clients.",
      image: "path/to/image",
      rating: 5
    }
  ];

  return (
    <div ref={mainRef} className="space-y-16 opacity-0">
      {/* Hero Section - Add Interactive Scroll Indicator */}
      <section ref={heroRef} className="relative h-screen text-center text-white overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
          <ParticleBackground />
          <motion.video
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
          >
            <source src="https://replicate.delivery/pbxt/C7y5IBZfRoZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.mp4" type="video/mp4" />
          </motion.video>
          
          {/* Enhanced Pattern Overlay */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              backgroundImage: 'url(/images/hero/overlay-pattern.svg)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]" />
        
        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                {heroContent.title}
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-purple-200">
                {heroContent.subtitle}
              </span>
            </motion.h1>

            <motion.p 
              className="text-2xl mb-12 max-w-3xl mx-auto text-purple-50/90 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {heroContent.description}
            </motion.p>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {heroContent.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-4xl mb-2 block">{stat.icon}</span>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="space-x-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/jobs"
                  className="group relative inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-lg overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500"
                    animate={{
                      x: ['0%', '100%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                  <span className="relative">Find Work</span>
                  <motion.svg
                    className="w-5 h-5 relative"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </Link>
              </motion.div>

              <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/hire"
                  className="group relative inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                  />
                  <span className="relative">Hire Talent</span>
                  <motion.svg
                    className="w-5 h-5 relative"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <div className="w-8 h-14 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                <motion.div 
                  className="w-1 h-3 bg-white/50 rounded-full"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <p className="mt-2 text-sm text-white/70">Scroll to explore</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {featuredSection}

      {/* Interactive Stats Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Active Jobs', value: '2,345+', icon: '💼', color: 'purple', detail: 'Open positions across all categories' },
              { label: 'Freelancers', value: '5,678+', icon: '👥', color: 'blue', detail: 'Skilled professionals ready to work' },
              { label: 'Success Rate', value: '95%', icon: '⭐', color: 'yellow', detail: 'Projects completed successfully' },
              { label: 'Total Earnings', value: '$1M+', icon: '💰', color: 'green', detail: 'Paid out to our freelancers' }
            ].map((stat) => (
              <Card3D key={stat.label}>
                <div 
                  className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredStat(stat.label)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  {/* Animated background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 to-transparent`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredStat === stat.label ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{ 
                        scale: hoveredStat === stat.label ? 1.1 : 1,
                        rotate: hoveredStat === stat.label ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2"
                      animate={{ y: hoveredStat === stat.label ? -5 : 0 }}
                    >
                      <span className="inline-block animate-count">{stat.value}</span>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: hoveredStat === stat.label ? 'auto' : 0,
                        opacity: hoveredStat === stat.label ? 1 : 0
                      }}
                      className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden"
                    >
                      {stat.detail}
                    </motion.div>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <SuccessStories />

      {/* Impact Section */}
      <ImpactSection metrics={impactMetrics} />

      {/* Mission Statement */}
      <section ref={featuresRef} className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="feature-card space-y-6">
            <h2 className="text-3xl font-bold dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in creating an inclusive digital workspace where abilities are celebrated and barriers are broken.
            </p>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>✓ Fully accessible platform design</li>
              <li>✓ Specialized support for different abilities</li>
              <li>✓ Fair and inclusive hiring practices</li>
              <li>✓ Community-driven growth opportunities</li>
            </ul>
          </div>
          <div className="feature-card">
            <img
              src="https://replicate.delivery/pbxt/B6x4HAYeQnZqm1mzkHQpqYrLh5UiDtk39B0YGPFynm3hE7FC/out-0.png"
              alt="Inclusive workspace"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Interactive Categories with Magnetic Effect */}
      <CategoriesSection categories={categories} />

      {testimonialTabs}

      <PlatformFeatures features={features} />

      {/* Add ChatBubble */}
      <ChatBubble />

      {/* Add notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-24 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h4 className="font-semibold dark:text-white">Welcome!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Discover opportunities that match your skills
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update the floating buttons positioning */}
      <div className="fixed right-8 z-50 flex flex-col gap-4" style={{ bottom: '2rem' }}>
        {/* Community Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, delay: 0.5 }}
        >
          <Link
            to="/community"
            className="relative group block"
          >
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-full blur-lg opacity-75 group-hover:opacity-100"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="relative flex items-center gap-2 bg-white dark:bg-gray-800 text-green-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-bold">Community</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Connect & Share</div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Sign Language Coding Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, delay: 0.7 }}
        >
          <Link
            to="/sign-language-coding"
            className="relative group block"
          >
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-75 group-hover:opacity-100"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="relative flex items-center gap-2 bg-white dark:bg-gray-800 text-purple-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">🤟</span>
              <div>
                <div className="font-bold">Code with Signs</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">AI-Powered</div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Chat Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, delay: 0.9 }}
        >
          <ChatBubble className="mt-4" />
        </motion.div>
      </div>

      {/* Move Scroll to Explore up */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* ... existing scroll to explore content ... */}
      </motion.div>

      <ChatButton />
      <AnimatePresence>
        {isOpen && <Chat />}
      </AnimatePresence>
    </div>
  );
}

export default Home; 