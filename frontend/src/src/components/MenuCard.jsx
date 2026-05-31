import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../hooks/useCart';

export default function MenuCard({ item }) {
  const { addToCart } = useCart();

  const placeholderColors = {
    'Fast Food': 'from-orange-500/20 to-red-500/20',
    'Italian': 'from-green-500/20 to-emerald-500/20',
    'Healthy': 'from-lime-500/20 to-teal-500/20',
    'Beverages': 'from-blue-500/20 to-purple-500/20',
  };

  const placeholderEmojis = {
    'Classic Smash Burger': '🍔',
    'Truffle Fries': '🍟',
    'Crispy Chicken Sandwich': '🍗',
    'Loaded Nachos': '🌮',
    'Margherita Pizza': '🍕',
    'Fettuccine Alfredo': '🍝',
    'Bruschetta': '🥖',
    'Tiramisu': '🍰',
    'Quinoa Power Bowl': '🥗',
    'Grilled Salmon Salad': '🥙',
    'Acai Smoothie Bowl': '🫐',
    'Espresso': '☕',
    'Mango Lassi': '🥭',
    'Fresh Lemonade': '🍋',
    'Iced Matcha Latte': '🍵',
  };

  const gradient = placeholderColors[item.category] || 'from-amber/20 to-gold/20';
  const emoji = placeholderEmojis[item.item_name] || '🍽️';

  return (
    <motion.div
      className="card group cursor-pointer menu-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image / Placeholder */}
      <div
        className={`relative h-48 ${item.image_url ? 'bg-black/20' : `bg-gradient-to-br ${gradient}`} flex items-center justify-center overflow-hidden`}
      >
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.item_name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
            {emoji}
          </span>
        )}
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium glass text-cream/80 z-10">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-lg font-semibold text-cream mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {item.item_name}
        </h3>
        <p className="text-sm text-cream/50 mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold gradient-text">
            ${item.price.toFixed(2)}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="flex items-center gap-2 btn-primary !py-2 !px-4 text-sm"
            id={`add-to-cart-${item.menu_id}`}
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
