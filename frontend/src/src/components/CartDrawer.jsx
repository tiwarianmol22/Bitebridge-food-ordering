import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTax, getTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
            style={{ background: 'var(--color-charcoal-light)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2
                className="text-xl font-bold text-cream"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-cream/50 hover:text-cream transition-colors rounded-lg hover:bg-white/5"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-cream/40">
                  <span className="text-5xl mb-4">🛒</span>
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm mt-1">Add some delicious items!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.menu_id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-cream">{item.item_name}</h4>
                      <p className="text-sm text-amber font-medium mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menu_id, item.quantity - 1)}
                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-cream/70 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-cream w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menu_id, item.quantity + 1)}
                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-cream/70 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.menu_id)}
                        className="p-1 rounded-md hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors ml-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm text-cream/60">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-cream/60">
                  <span>Tax (8%)</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-cream pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="gradient-text">${getTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full mt-4 !py-3"
                  id="checkout-button"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
