import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';

const STATUSES = ['Pending', 'Processing', 'Out for Delivery', 'Completed'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data.success) setOrder(res.data.data);
    } catch { /* keep existing */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrder(); const interval = setInterval(fetchOrder, 10000); return () => clearInterval(interval); }, [orderId]);

  const currentStep = order ? STATUSES.indexOf(order.status) : -1;
  const isCanceled = order?.status === 'Canceled';

  if (loading) return <PageTransition><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber border-t-transparent rounded-full" /></div></PageTransition>;

  if (!order) return <PageTransition><div className="min-h-screen flex flex-col items-center justify-center"><span className="text-5xl mb-4">😕</span><h1 className="text-2xl font-bold text-cream mb-4">Order not found</h1><Link to="/menu" className="btn-primary">Back to Menu</Link></div></PageTransition>;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Order <span className="gradient-text">#{orderId}</span></h1>
            <p className="text-cream/50">{order.order_date ? new Date(order.order_date).toLocaleString() : ''}</p>
          </motion.div>

          {/* Status Stepper */}
          {isCanceled ? (
            <div className="text-center py-12 glass rounded-xl mb-8"><span className="text-5xl mb-4 block">❌</span><p className="text-xl font-semibold text-red-400">Order Canceled</p></div>
          ) : (
            <div className="glass rounded-xl p-8 mb-8">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
                <div className="absolute top-5 left-0 h-0.5 gradient-amber transition-all duration-1000" style={{ width: `${currentStep >= 0 ? (currentStep / (STATUSES.length - 1)) * 100 : 0}%` }} />
                {STATUSES.map((status, i) => (
                  <div key={status} className="relative flex flex-col items-center z-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStep ? 'gradient-amber text-charcoal' : 'bg-charcoal-lighter border-2 border-white/20 text-cream/40'}`}>
                      {i <= currentStep ? <CheckCircleIcon className="w-6 h-6" /> : i + 1}
                    </motion.div>
                    <span className={`text-xs mt-3 text-center max-w-[80px] ${i <= currentStep ? 'text-amber font-medium' : 'text-cream/40'}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.order_detail_id} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                  <span className="text-cream/70">{item.item_name || `Item #${item.menu_id}`} × {item.quantity}</span>
                  <span className="text-cream font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span><span className="gradient-text">${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            {order.payment && <div className="mt-3 text-sm text-cream/50">Payment: {order.payment.payment_method} — <span className={order.payment.payment_status === 'Paid' ? 'text-green-400' : 'text-amber'}>{order.payment.payment_status}</span></div>}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
