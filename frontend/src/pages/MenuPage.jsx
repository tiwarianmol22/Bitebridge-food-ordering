import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import MenuCard from '../components/MenuCard';
import PageTransition from '../components/PageTransition';
import { staggerMenuCards } from '../animations/gsap-utils';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.menu-card');
      if (cards.length) staggerMenuCards(cards);
    }
  }, [items, loading]);

  const fetchMenu = async (category = null) => {
    setLoading(true);
    try {
      const params = category && category !== 'All' ? `?category=${category}` : '';
      const res = await api.get(`/menu/${params}`);
      if (res.data.success) setItems(res.data.data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/menu/categories');
      if (res.data.success) setCategories(['All', ...res.data.data]);
    } catch { setCategories(['All']); }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    fetchMenu(cat);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Our <span className="gradient-text">Menu</span>
            </h1>
            <p className="text-cream/50 max-w-lg mx-auto">Discover our curated selection of premium dishes, crafted with the finest ingredients.</p>
          </motion.div>

          {/* Category Filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'gradient-amber text-charcoal' : 'glass text-cream/60 hover:text-cream hover:border-amber/30'}`}
                id={`filter-${cat.toLowerCase().replace(/\s/g, '-')}`}>
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Menu Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card"><div className="h-48 skeleton" /><div className="p-5 space-y-3"><div className="h-5 skeleton w-3/4" /><div className="h-4 skeleton w-full" /><div className="h-4 skeleton w-1/2" /></div></div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-cream/40"><span className="text-5xl mb-4 block">🍽️</span><p className="text-lg">No items found in this category</p></div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => <MenuCard key={item.menu_id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
