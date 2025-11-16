import { configureStore } from "@reduxjs/toolkit";
import productosReducer from "./productosSlices";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import categoriasReducer from "./categoriasSlice";
import ordenesReducer from "./ordenesSlice";
import proveedorReducer from "./proveedorSlice";
import direccionesReducer from "./direccionesSlice";

export const store = configureStore({
  reducer: {
    productos: productosReducer,
    cart: cartReducer,
    auth: authReducer,
    categorias: categoriasReducer,
    ordenes: ordenesReducer,
    proveedor: proveedorReducer,
    direcciones: direccionesReducer,
  },
});
