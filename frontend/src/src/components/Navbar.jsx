import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    ...(user ? [{ to: '/orders', label: 'My Orders' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Dashboard' }] : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🍽️</span>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <span className="gradient-text">Bite</span>
              <span className="text-cream">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-300 hover:text-amber ${
                  location.pathname === link.to ? 'text-amber' : 'text-cream/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            {user && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-cream/70 hover:text-amber transition-colors"
                id="cart-button"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full gradient-amber text-charcoal"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 text-cream/70 hover:text-amber transition-colors"
                  id="profile-button"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden md:inline text-sm">{user.name}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-cream">{user.name}</p>
                        <p className="text-xs text-cream/50">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-cream/70 hover:text-amber hover:bg-white/5 transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-cream/70"
            >
              {mobileOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-sm font-medium text-cream/70 hover:text-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm flex-1 text-center">
                      Sign In
                    </Link>
                    <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm flex-1 text-center">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
