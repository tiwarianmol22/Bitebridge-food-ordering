import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const method = searchParams.get('method') || 'Credit Card';
  const navigate = useNavigate();
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (val) => val.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => { const clean = val.replace(/\D/g, ''); if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2, 4); return clean; };

  const handlePay = async () => {
    if (!card.number || !card.expiry || !card.cvv || !card.name) return toast.error('Fill all card details');
    setLoading(true);
    try {
      // Simulate payment processing
      const paymentRes = await api.get(`/payment/${orderId}`);
      if (paymentRes.data.success) {
        await api.put(`/payment/${paymentRes.data.data.payment_id}`, { payment_status: 'Paid' });
      }
      toast.success('Payment successful!');
      navigate(`/payment-success?order_id=${orderId}`);
    } catch { toast.error('Payment failed'); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">💳</span>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Payment</h1>
              <p className="text-cream/50 text-sm mt-1">Order #{orderId} • {method}</p>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Cardholder Name</label><input value={card.name} onChange={(e) => setCard({...card, name: e.target.value})} className="input-field" placeholder="JOHN DOE" id="card-name" /></div>
              <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Card Number</label><input value={card.number} onChange={(e) => setCard({...card, number: formatCardNumber(e.target.value)})} className="input-field tracking-widest" placeholder="4242 4242 4242 4242" maxLength={19} id="card-number" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Expiry</label><input value={card.expiry} onChange={(e) => setCard({...card, expiry: formatExpiry(e.target.value)})} className="input-field" placeholder="MM/YY" maxLength={5} id="card-expiry" /></div>
                <div><label className="block text-sm font-medium text-cream/70 mb-1.5">CVV</label><input type="password" value={card.cvv} onChange={(e) => setCard({...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})} className="input-field" placeholder="•••" maxLength={4} id="card-cvv" /></div>
              </div>
              <button onClick={handlePay} disabled={loading} className="btn-primary w-full !py-3 !mt-6 disabled:opacity-50" id="pay-now-btn">{loading ? 'Processing...' : 'Pay Now'}</button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
