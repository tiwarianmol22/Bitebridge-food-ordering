import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../hooks/useCart';
import PageTransition from '../components/PageTransition';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTax, getTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <span className="text-6xl mb-6">🛒</span>
          <h1 className="text-3xl font-bold text-cream mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Your cart is empty</h1>
          <p className="text-cream/50 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Your <span className="gradient-text">Cart</span></h1>
            <button onClick={clearCart} className="text-sm text-red-400/60 hover:text-red-400 transition-colors">Clear All</button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, i) => (
                <motion.div key={item.menu_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl">
                  <div className="w-16 h-16 rounded-lg gradient-amber flex items-center justify-center text-2xl shrink-0">🍽️</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-cream truncate">{item.item_name}</h3>
                    <p className="text-sm text-amber font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.menu_id, item.quantity - 1)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cream/70"><MinusIcon className="w-4 h-4" /></button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.menu_id, item.quantity + 1)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cream/70"><PlusIcon className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm font-bold text-cream w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.menu_id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="glass rounded-xl p-6 h-fit sticky top-24">
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-cream/60"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                <div className="flex justify-between text-cream/60"><span>Tax (8%)</span><span>${getTax().toFixed(2)}</span></div>
                <div className="flex justify-between text-cream/60"><span>Delivery</span><span className="text-green-400">Free</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold"><span>Total</span><span className="gradient-text">${getTotal().toFixed(2)}</span></div>
              </div>
              <Link to="/checkout" className="btn-primary w-full !py-3 mt-6 text-center block" id="proceed-checkout">Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
