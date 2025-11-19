'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 shadow-lg mt-auto">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <p className="text-sm md:text-base">
            © {currentYear} AI Tour Guide. All rights reserved.
          </p>
          <p className="text-xs md:text-sm mt-2 opacity-90">
            Built by <span className="font-semibold">Ruhul Amin Parvez</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

