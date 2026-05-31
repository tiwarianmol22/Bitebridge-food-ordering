import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery', 'PayPal'];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, getSubtotal, getTax, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error('Please enter a delivery address');
    if (cartItems.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderRes = await api.post('/orders/', { items: cartItems.map(i => ({ menu_id: i.menu_id, quantity: i.quantity })) });
      if (orderRes.data.success) {
        const orderId = orderRes.data.data.order_id;
        await api.post('/payment/', { order_id: orderId, payment_method: paymentMethod });
        clearCart();
        if (paymentMethod === 'Cash on Delivery') {
          navigate(`/payment-success?order_id=${orderId}`);
        } else {
          navigate(`/payment?order_id=${orderId}&method=${encodeURIComponent(paymentMethod)}`);
        }
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
            <span className="gradient-text">Checkout</span>
          </h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Delivery Address</h3>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="input-field min-h-[100px] resize-none" placeholder="Enter your delivery address" id="checkout-address" />
              </motion.div>
              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button key={method} onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-xl text-left text-sm font-medium transition-all ${paymentMethod === method ? 'border-2 border-amber bg-amber/5 text-cream' : 'border border-white/10 text-cream/60 hover:border-white/20'}`}
                      id={`payment-${method.toLowerCase().replace(/\s/g, '-')}`}>
                      <span className="mr-2">{method === 'Credit Card' ? '💳' : method === 'Debit Card' ? '💳' : method === 'UPI' ? '📱' : method === 'Cash on Delivery' ? '💵' : '🅿️'}</span>
                      {method}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
            {/* Summary */}
            <div className="glass rounded-xl p-6 h-fit sticky top-24">
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Order Summary</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.menu_id} className="flex justify-between text-sm text-cream/60">
                    <span>{item.item_name} × {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-cream/60"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                <div className="flex justify-between text-cream/60"><span>Tax</span><span>${getTax().toFixed(2)}</span></div>
                <div className="flex justify-between text-cream/60"><span>Delivery</span><span className="text-green-400">Free</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold"><span>Total</span><span className="gradient-text">${getTotal().toFixed(2)}</span></div>
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full !py-3 mt-6 disabled:opacity-50" id="place-order-btn">
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
