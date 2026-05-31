import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0"><div className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber/5 rounded-full blur-[100px]" /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">🔑</span>
              <h1 className="text-3xl font-bold text-cream mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Reset Password</h1>
              <p className="text-cream/50 text-sm">{sent ? 'Check your email for a reset link' : 'Enter your email to receive a reset link'}</p>
            </div>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label className="block text-sm font-medium text-cream/70 mb-2">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" id="forgot-email" /></div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50" id="forgot-submit">{loading ? 'Sending...' : 'Send Reset Link'}</button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-amber flex items-center justify-center"><span className="text-2xl">✉️</span></div>
                <p className="text-cream/60 text-sm">We've sent a password reset link to <strong className="text-cream">{email}</strong></p>
              </motion.div>
            )}
            <p className="text-center text-cream/40 text-sm mt-6"><Link to="/login" className="text-amber font-medium">← Back to Sign In</Link></p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
