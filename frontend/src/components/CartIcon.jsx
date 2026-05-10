import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart" className="relative inline-block">
      <span className="text-2xl">🛒</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;