import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/orders/');
        if (res.data.success) setOrders(res.data.data);
      } catch { /* empty */ }
      finally { setLoading(false); }
    })();
  }, []);

  const statusColor = (s) => s === 'Completed' ? 'bg-green-500/10 text-green-400' : s === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-amber/10 text-amber';

  if (loading) return <PageTransition><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber border-t-transparent rounded-full" /></div></PageTransition>;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>My <span className="gradient-text">Orders</span></h1>
          {orders.length === 0 ? (
            <div className="text-center py-20 text-cream/40"><span className="text-5xl mb-4 block">📋</span><p className="text-lg mb-4">No orders yet</p><Link to="/menu" className="btn-primary">Browse Menu</Link></div>
          ) : (
            <div className="space-y-4">
              {orders.map((o, i) => (
                <motion.div key={o.order_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/orders/${o.order_id}`} className="block glass rounded-xl p-5 hover:border-amber/30 border border-transparent transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-cream">Order #{o.order_id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-cream/50">
                      <span>{o.items?.length || 0} item(s)</span>
                      <span>{o.order_date ? new Date(o.order_date).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="mt-2 text-right"><span className="text-lg font-bold gradient-text">${parseFloat(o.total_amount).toFixed(2)}</span></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
