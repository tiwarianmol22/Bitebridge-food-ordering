import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = (() => {
    const p = form.password;
    if (!p) return { level: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 6) s++; if (p.length >= 10) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 2) return { level: s, label: 'Weak', color: 'bg-red-500' };
    if (s <= 3) return { level: s, label: 'Medium', color: 'bg-yellow-500' };
    return { level: s, label: 'Strong', color: 'bg-green-500' };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password });
      toast.success('Account created!'); navigate('/menu');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 py-24 relative">
        <div className="absolute inset-0"><div className="absolute top-1/4 right-1/3 w-80 h-80 bg-amber/5 rounded-full blur-[100px]" /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg">
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">🍽️</span>
              <h1 className="text-3xl font-bold text-cream mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Create Account</h1>
              <p className="text-cream/50 text-sm">Join BiteBridge for premium dining</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Full Name *</label><input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="John Doe" id="signup-name" /></div>
                <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+1 234 567 890" id="signup-phone" /></div>
              </div>
              <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" id="signup-email" /></div>
              <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Address</label><input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="123 Main St" id="signup-address" /></div>
              <div>
                <label className="block text-sm font-medium text-cream/70 mb-1.5">Password *</label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input-field pr-12" placeholder="Create a strong password" id="signup-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70">{showPw ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>
                </div>
                {form.password && <div className="mt-2"><div className="flex gap-1 mb-1">{[1,2,3,4,5].map(i=><div key={i} className={`h-1 flex-1 rounded-full ${i<=strength.level?strength.color:'bg-white/10'}`}/>)}</div><p className="text-xs text-cream/50">{strength.label}</p></div>}
              </div>
              <div><label className="block text-sm font-medium text-cream/70 mb-1.5">Confirm Password *</label><input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="Confirm password" id="signup-confirm" />{form.confirmPassword && form.password !== form.confirmPassword && <p className="text-xs text-red-400 mt-1">Passwords do not match</p>}</div>
              <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !mt-6 disabled:opacity-50" id="signup-submit">{loading ? 'Creating...' : 'Create Account'}</button>
            </form>
            <p className="text-center text-cream/40 text-sm mt-6">Already have an account? <Link to="/login" className="text-amber font-medium">Sign in</Link></p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
