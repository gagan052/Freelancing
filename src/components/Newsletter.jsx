import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <section className="py-20 bg-purple-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">
            Get the latest opportunities and updates delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              required
            />
            <button type="submit" className="btn bg-white text-purple-600 hover:bg-gray-100">
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default Newsletter; 