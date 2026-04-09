import React from 'react';
import { motion } from 'framer-motion';

interface MotionCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

const MotionCard: React.FC<MotionCardProps> = ({ children, index = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.35,
      delay: index * 0.08,
      ease: [0.4, 0, 0.2, 1],
    }}
    whileHover={{ y: -2, boxShadow: 'var(--shadow-elevated)' }}
    className={className}
  >
    {children}
  </motion.div>
);

export default MotionCard;
