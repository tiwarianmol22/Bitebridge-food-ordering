import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuForm, setMenuForm] = useState({ item_name: '', description: '', category: '', price: '', availability: true });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (user?.role !== 'admin') navigate('/'); else fetchAll(); }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, o, m, c] = await Promise.all([
        api.get('/admin/dashboard'), api.get('/admin/orders'),
        api.get('/menu/all'), api.get('/admin/customers'),
      ]);
      if (s.data.success) setStats(s.data.data);
      if (o.data.success) setOrders(o.data.data);
      if (m.data.success) setMenuItems(m.data.data);
      if (c.data.success) setCustomers(c.data.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order #${orderId} → ${status}`);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, { ...menuForm, price: parseFloat(menuForm.price) });
        toast.success('Item updated');
      } else {
        await api.post('/menu/', { ...menuForm, price: parseFloat(menuForm.price) });
        toast.success('Item added');
      }
      setShowForm(false); setEditingId(null); setMenuForm({ item_name: '', description: '', category: '', price: '', availability: true });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteMenuItem = async (id) => {
    try { await api.delete(`/menu/${id}`); toast.success('Item removed'); fetchAll(); } catch { toast.error('Failed'); }
  };

  const editMenuItem = (item) => {
    setMenuForm({ item_name: item.item_name, description: item.description || '', category: item.category || '', price: String(item.price), availability: item.availability });
    setEditingId(item.menu_id); setShowForm(true); setTab('menu');
  };

  if (loading) return <PageTransition><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber border-t-transparent rounded-full" /></div></PageTransition>;

  const tabs = [
    { id: 'overview', label: '📊 Overview' }, { id: 'orders', label: '📦 Orders' },
    { id: 'menu', label: '🍽️ Menu' }, { id: 'customers', label: '👥 Customers' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>Admin <span className="gradient-text">Dashboard</span></h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'gradient-amber text-charcoal' : 'glass text-cream/60 hover:text-cream'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.total_orders, icon: '📦' },
                { label: 'Revenue', value: `$${stats.total_revenue.toFixed(2)}`, icon: '💰' },
                { label: 'Pending', value: stats.pending_orders, icon: '⏳' },
                { label: 'Customers', value: stats.total_customers, icon: '👥' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-6 text-center">
                  <span className="text-3xl mb-2 block">{s.icon}</span>
                  <p className="text-2xl font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-cream/50 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="glass rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-cream/50">
                    <th className="text-left p-4">ID</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Total</th><th className="text-left p-4">Status</th><th className="text-left p-4">Action</th>
                  </tr></thead>
                  <tbody>{orders.map(o => (
                    <tr key={o.order_id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">#{o.order_id}</td>
                      <td className="p-4 text-cream/70">{o.customer?.name || 'N/A'}</td>
                      <td className="p-4 text-cream/50">{o.order_date ? new Date(o.order_date).toLocaleDateString() : ''}</td>
                      <td className="p-4 font-medium gradient-text">${parseFloat(o.total_amount).toFixed(2)}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === 'Completed' ? 'bg-green-500/10 text-green-400' : o.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-amber/10 text-amber'}`}>{o.status}</span></td>
                      <td className="p-4">
                        <select value={o.status} onChange={(e) => updateStatus(o.order_id, e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-cream outline-none">
                          {['Pending','Processing','Out for Delivery','Completed','Canceled'].map(s => <option key={s} value={s} className="bg-charcoal">{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Menu Management */}
          {tab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Menu Items ({menuItems.length})</h3>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setMenuForm({ item_name: '', description: '', category: '', price: '', availability: true }); }} className="btn-primary !py-2 !px-4 text-sm">
                  {showForm ? 'Cancel' : '+ Add Item'}
                </button>
              </div>
              {showForm && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleMenuSubmit} className="glass rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={menuForm.item_name} onChange={e => setMenuForm({...menuForm, item_name: e.target.value})} className="input-field" placeholder="Item Name" required />
                  <input value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})} className="input-field" placeholder="Category" required />
                  <input value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})} className="input-field" placeholder="Price" type="number" step="0.01" required />
                  <input value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})} className="input-field" placeholder="Description" />
                  <div className="md:col-span-2"><button type="submit" className="btn-primary !py-2 !px-6 text-sm">{editingId ? 'Update' : 'Add'} Item</button></div>
                </motion.form>
              )}
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-cream/50">
                    <th className="text-left p-4">Item</th><th className="text-left p-4">Category</th><th className="text-left p-4">Price</th><th className="text-left p-4">Status</th><th className="text-left p-4">Actions</th>
                  </tr></thead>
                  <tbody>{menuItems.map(m => (
                    <tr key={m.menu_id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">{m.item_name}</td>
                      <td className="p-4 text-cream/60">{m.category}</td>
                      <td className="p-4 gradient-text font-medium">${parseFloat(m.price).toFixed(2)}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${m.availability ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{m.availability ? 'Available' : 'Unavailable'}</span></td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => editMenuItem(m)} className="text-xs text-amber hover:underline">Edit</button>
                        <button onClick={() => deleteMenuItem(m.menu_id)} className="text-xs text-red-400 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers */}
          {tab === 'customers' && (
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10 text-cream/50">
                  <th className="text-left p-4">ID</th><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Phone</th><th className="text-left p-4">Role</th>
                </tr></thead>
                <tbody>{customers.map(c => (
                  <tr key={c.customer_id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-medium">#{c.customer_id}</td>
                    <td className="p-4">{c.name}</td>
                    <td className="p-4 text-cream/60">{c.email}</td>
                    <td className="p-4 text-cream/50">{c.phone || '—'}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${c.role === 'admin' ? 'bg-amber/10 text-amber' : 'bg-white/5 text-cream/50'}`}>{c.role}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
