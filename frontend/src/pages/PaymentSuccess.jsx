import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { animateSuccess } from '../animations/gsap-utils';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => animateSuccess(containerRef.current), 500);
    }
  }, []);

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, delay: 0.2 }} className="w-24 h-24 rounded-full gradient-amber flex items-center justify-center mb-8 animate-pulse-glow">
          <span className="text-5xl">✓</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl font-bold text-cream mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          Order <span className="gradient-text">Confirmed!</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-cream/50 text-center max-w-md mb-2">
          Your order has been placed successfully. We're preparing your food with love.
        </motion.p>
        {orderId && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-amber font-medium mb-8">Order ID: #{orderId}</motion.p>}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-4">
          <Link to={`/orders/${orderId}`} className="btn-primary" id="track-order-btn">Track Order</Link>
          <Link to="/menu" className="btn-secondary">Order More</Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
