import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const found = state.items.find((i) => i.id === item.id);

      if (found) {
        found.amount += 1;
      } else {
        state.items.push({
          ...item,
          precio: Number(item.precio),
          amount: 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      const found = state.items.find((i) => i.id === item.id);

      if (found) {
        if (found.amount > 1) {
          found.amount -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== item.id);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.amount, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.precio * item.amount, 0);

export default cartSlice.reducer;
