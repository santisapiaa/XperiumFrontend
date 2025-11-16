/*import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, amount: i.amount + 1 } : i
        );
      }
      return [...prev, { ...item, precio: Number(item.precio), amount: 1 }];
    });
  };

  const deleteToCart = (item) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === item.id ? { ...i, amount: i.amount - 1 } : i))
        .filter((i) => i.amount > 0)
    );
  };

  const deleteAll = () => setCartItems([]);

  const productsLength = cartItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        deleteToCart,
        deleteAll,
        productsLength,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}*/
