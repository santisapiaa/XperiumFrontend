import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productosAPI } from "../services/api";

// Async thunks
export const fetchProductos = createAsyncThunk(
  "productos/fetchProductos",
  async ({ page = 0, size = 100 } = {}) => {
    const data = await productosAPI.getAll(page, size);
    return data;
  }
);

export const fetchProductoById = createAsyncThunk(
  "productos/fetchProductoById",
  async (id) => {
    const data = await productosAPI.getById(id);
    return data;
  }
);

export const fetchProductosByCategoria = createAsyncThunk(
  "productos/fetchProductosByCategoria",
  async ({ categoriaId, page = 0, size = 100 }) => {
    const data = await productosAPI.getByCategoria(categoriaId, page, size);
    return data;
  }
);

// Slice
const productosSlice = createSlice({
  name: "productos",
  initialState: {
    items: [],
    currentProducto: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProducto: (state) => {
      state.currentProducto = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all productos
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch producto by ID
      .addCase(fetchProductoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProducto = action.payload;
      })
      .addCase(fetchProductoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch productos by categoria
      .addCase(fetchProductosByCategoria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductosByCategoria.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || action.payload;
      })
      .addCase(fetchProductosByCategoria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectProductos = (state) => state.productos.items;
export const selectCurrentProducto = (state) => state.productos.currentProducto;
export const selectProductosLoading = (state) => state.productos.loading;
export const selectProductosError = (state) => state.productos.error;

export const { clearCurrentProducto } = productosSlice.actions;
export default productosSlice.reducer;
