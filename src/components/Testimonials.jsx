import { motion } from 'framer-motion';

function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="card hover-card p-6"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{testimonial.quote}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Designer",
    quote: "AbilityWorks has changed my life. I can now work comfortably from home and showcase my design skills to clients worldwide.",
    avatar: "https://ui-avatars.com/api/?name=SJ&background=6d28d9&color=fff"
  },
  {
    name: "Michael Chen",
    role: "Web Developer",
    quote: "The platform's accessibility features make it easy for me to find and complete projects. The support team is amazing!",
    avatar: "https://ui-avatars.com/api/?name=MC&background=6d28d9&color=fff"
  },
  {
    name: "Emma Williams",
    role: "Content Writer",
    quote: "I've found a supportive community here. The opportunities are endless, and the platform truly values inclusivity.",
    avatar: "https://ui-avatars.com/api/?name=EW&background=6d28d9&color=fff"
  }
];

export default Testimonials; 