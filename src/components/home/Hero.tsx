'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-cream">
      {/* Background Image / Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center">
        <motion.div 
          className="w-full md:w-3/5 lg:w-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="font-heading text-5xl md:text-7xl leading-tight text-charcoal mb-6"
          >
            Reveal Your <br />
            <span className="text-rose-gold italic">True Radiance</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="font-body text-charcoal/80 text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
          >
            Premium luxury cosmetics designed to enhance your natural beauty. Experience the epitome of skincare excellence.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link 
              href="/category/skincare"
              className="inline-block bg-rose-gold text-white font-body uppercase tracking-widest text-sm px-10 py-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-gold/20 transition-all duration-300"
            >
              Discover the Collection
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="hidden md:block w-full md:w-2/5 lg:w-1/2 h-full absolute right-0 top-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-1/4 right-1/4 w-64 h-64 border border-champagne rounded-full mix-blend-multiply opacity-50 blur-sm"
          />
           <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-blush/20 rounded-full mix-blend-multiply opacity-50 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
}
