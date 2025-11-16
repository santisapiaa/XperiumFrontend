import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tarjetasAPI } from "../services/api";

// Async thunks
export const fetchTarjetas = createAsyncThunk(
  "tarjetas/fetchTarjetas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tarjetasAPI.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearTarjeta = createAsyncThunk(
  "tarjetas/crearTarjeta",
  async (tarjetaData, { rejectWithValue }) => {
    try {
      const response = await tarjetasAPI.create(tarjetaData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarTarjeta = createAsyncThunk(
  "tarjetas/actualizarTarjeta",
  async ({ id, tarjetaData }, { rejectWithValue }) => {
    try {
      const response = await tarjetasAPI.update(id, tarjetaData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarTarjeta = createAsyncThunk(
  "tarjetas/eliminarTarjeta",
  async (id, { rejectWithValue }) => {
    try {
      await tarjetasAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const tarjetasSlice = createSlice({
  name: "tarjetas",
  initialState: {
    tarjetas: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // Fetch Tarjetas
    builder
      .addCase(fetchTarjetas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTarjetas.fulfilled, (state, action) => {
        state.loading = false;
        const contentArray = Array.isArray(action.payload) ? action.payload : action.payload.content || [];
        state.tarjetas = Array.isArray(contentArray) ? contentArray : [];
      })
      .addCase(fetchTarjetas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener tarjetas";
      });

    // Crear Tarjeta
    builder
      .addCase(crearTarjeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearTarjeta.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tarjetas)) {
          state.tarjetas.push(action.payload);
        }
      })
      .addCase(crearTarjeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al crear tarjeta";
      });

    // Actualizar Tarjeta
    builder
      .addCase(actualizarTarjeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarTarjeta.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tarjetas)) {
          const index = state.tarjetas.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tarjetas[index] = action.payload;
          }
        }
      })
      .addCase(actualizarTarjeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al actualizar tarjeta";
      });

    // Eliminar Tarjeta
    builder
      .addCase(eliminarTarjeta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarTarjeta.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tarjetas)) {
          state.tarjetas = state.tarjetas.filter(t => t.id !== action.payload);
        }
      })
      .addCase(eliminarTarjeta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al eliminar tarjeta";
      });
  },
});

// Selectors
export const selectTarjetas = (state) => state.tarjetas.tarjetas;
export const selectTarjetasLoading = (state) => state.tarjetas.loading;
export const selectTarjetasError = (state) => state.tarjetas.error;

export default tarjetasSlice.reducer;
