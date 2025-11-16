import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { direccionesAPI } from "../services/api";

export const fetchDirecciones = createAsyncThunk(
  "direcciones/fetchDirecciones",
  async (_, { rejectWithValue }) => {
    try {
      const response = await direccionesAPI.getAll();
      return Array.isArray(response) ? response : (response.content || []);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearDireccion = createAsyncThunk(
  "direcciones/crearDireccion",
  async (direccionData, { rejectWithValue }) => {
    try {
      const nuevaDireccion = await direccionesAPI.create(direccionData);
      return nuevaDireccion;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarDireccion = createAsyncThunk(
  "direcciones/actualizarDireccion",
  async ({ id, direccionData }, { rejectWithValue }) => {
    try {
      const direccionActualizada = await direccionesAPI.update(
        id,
        direccionData
      );
      return direccionActualizada;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarDireccion = createAsyncThunk(
  "direcciones/eliminarDireccion",
  async (id, { rejectWithValue }) => {
    try {
      await direccionesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const direccionesSlice = createSlice({
  name: "direcciones",
  initialState: {
    direcciones: [],
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
      // Fetch direcciones
      .addCase(fetchDirecciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDirecciones.fulfilled, (state, action) => {
        state.loading = false;
        state.direcciones = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDirecciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crear dirección
      .addCase(crearDireccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearDireccion.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.direcciones)) {
          state.direcciones.push(action.payload);
        }
      })
      .addCase(crearDireccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Actualizar dirección
      .addCase(actualizarDireccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarDireccion.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.direcciones)) {
          const index = state.direcciones.findIndex(
            (d) => d.id === action.payload.id
          );
          if (index !== -1) {
            state.direcciones[index] = action.payload;
          }
        }
      })
      .addCase(actualizarDireccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Eliminar dirección
      .addCase(eliminarDireccion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarDireccion.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.direcciones)) {
          state.direcciones = state.direcciones.filter(
            (d) => d.id !== action.payload
          );
        }
      })
      .addCase(eliminarDireccion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectDirecciones = (state) => state.direcciones.direcciones;
export const selectDireccionesLoading = (state) => state.direcciones.loading;
export const selectDireccionesError = (state) => state.direcciones.error;

export const { clearError } = direccionesSlice.actions;
export default direccionesSlice.reducer;
