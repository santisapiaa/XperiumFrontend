import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordenesDeCompraAPI, detallesOrdenAPI } from "../services/api";

export const fetchOrdenes = createAsyncThunk(
  "ordenes/fetchOrdenes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordenesDeCompraAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrdenById = createAsyncThunk(
  "ordenes/fetchOrdenById",
  async (id, { rejectWithValue }) => {
    try {
      const ordenCompleta = await ordenesDeCompraAPI.getById(id);
      return ordenCompleta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearOrden = createAsyncThunk(
  "ordenes/crearOrden",
  async ({ items, metodoPago, detalleMetodoPago }, { rejectWithValue }) => {
    try {
      // Crear la orden vacía primero
      const ordenCreada = await ordenesDeCompraAPI.create({});

      console.log("Orden creada:", ordenCreada);

      // Crear los detalles de la orden
      for (const item of items) {
        const detalleData = {
          ordenDeCompraId: ordenCreada.id,
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.precio,
        };
        console.log("Creando detalle:", detalleData);
        await detallesOrdenAPI.create(detalleData);
      }

      // For now, storing locally; backend can be updated to persist payment info
      const ordenFinal = await ordenesDeCompraAPI.getById(ordenCreada.id);
      console.log("Orden final:", ordenFinal);
      console.log("Método de pago:", metodoPago, detalleMetodoPago);
      
      return ordenFinal;
    } catch (error) {
      console.error("Error en crearOrden:", error);
      return rejectWithValue(error.message);
    }
  }
);

const ordenesSlice = createSlice({
  name: "ordenes",
  initialState: {
    ordenes: [],
    ordenActual: null,
    loading: false,
    error: null,
    creatingOrder: false,
  },
  reducers: {
    clearOrdenActual: (state) => {
      state.ordenActual = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todas las órdenes
      .addCase(fetchOrdenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes = action.payload;
      })
      .addCase(fetchOrdenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch orden por ID
      .addCase(fetchOrdenById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenById.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenActual = action.payload;
      })
      .addCase(fetchOrdenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crear orden
      .addCase(crearOrden.pending, (state) => {
        state.creatingOrder = true;
        state.error = null;
      })
      .addCase(crearOrden.fulfilled, (state, action) => {
        state.creatingOrder = false;
        state.ordenActual = action.payload;
        // state.ordenes es el array en initialState
        if (Array.isArray(state.ordenes)) {
          state.ordenes.push(action.payload);
        }
      })
      .addCase(crearOrden.rejected, (state, action) => {
        state.creatingOrder = false;
        state.error = action.payload;
      });
  },
});

export const selectOrdenes = (state) => state.ordenes.ordenes;
export const selectOrdenActual = (state) => state.ordenes.ordenActual;
export const selectOrdenesLoading = (state) => state.ordenes.loading;
export const selectOrdenesError = (state) => state.ordenes.error;
export const selectCreatingOrder = (state) => state.ordenes.creatingOrder;

export const { clearOrdenActual, clearError } = ordenesSlice.actions;
export default ordenesSlice.reducer;
