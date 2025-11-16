import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { categoriasAPI } from "../services/api";

// Async thunk
export const fetchCategorias = createAsyncThunk(
  "categorias/fetchCategorias",
  async ({ page = 0, size = 100 } = {}) => {
    const data = await categoriasAPI.getAll(page, size);
    return data;
  }
);

// Slice
const categoriasSlice = createSlice({
  name: "categorias",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectCategorias = (state) => state.categorias.items;
export const selectCategoriasLoading = (state) => state.categorias.loading;
export const selectCategoriasError = (state) => state.categorias.error;

export const { clearError } = categoriasSlice.actions;
export default categoriasSlice.reducer;
