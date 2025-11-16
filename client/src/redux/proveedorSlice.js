import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { proveedoresAPI, categoriasAPI } from "../services/api";

export const fetchMiCuenta = createAsyncThunk(
  "proveedor/fetchMiCuenta",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await proveedoresAPI.getMiCuenta();
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMisProductos = createAsyncThunk(
  "proveedor/fetchMisProductos",
  async (_, { rejectWithValue }) => {
    try {
      const productosData = await proveedoresAPI.getMisProductos();
      return productosData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearProducto = createAsyncThunk(
  "proveedor/crearProducto",
  async (productoData, { rejectWithValue }) => {
    try {
      const nuevoProducto = await proveedoresAPI.createProducto(productoData);
      return nuevoProducto;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarProducto = createAsyncThunk(
  "proveedor/actualizarProducto",
  async ({ id, productoData }, { rejectWithValue }) => {
    try {
      const productoActualizado = await proveedoresAPI.updateProducto(
        id,
        productoData
      );
      return productoActualizado;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarProducto = createAsyncThunk(
  "proveedor/eliminarProducto",
  async (id, { rejectWithValue }) => {
    try {
      await proveedoresAPI.deleteProducto(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const proveedorSlice = createSlice({
  name: "proveedor",
  initialState: {
    cuenta: null,
    productos: [],
    loading: false,
    error: null,
    productoOperation: {
      loading: false,
      error: null,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.productoOperation.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cuenta del proveedor
      .addCase(fetchMiCuenta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMiCuenta.fulfilled, (state, action) => {
        state.loading = false;
        state.cuenta = action.payload;
      })
      .addCase(fetchMiCuenta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch productos del proveedor
      .addCase(fetchMisProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMisProductos.fulfilled, (state, action) => {
        state.loading = false;
        // Normalizar a array - si viene con estructura de página, extraer content
        state.productos = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.content || [];
      })
      .addCase(fetchMisProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crear producto
      .addCase(crearProducto.pending, (state) => {
        state.productoOperation.loading = true;
        state.productoOperation.error = null;
      })
      .addCase(crearProducto.fulfilled, (state, action) => {
        state.productoOperation.loading = false;
        // Asegurar que productos es un array antes de hacer push
        if (!Array.isArray(state.productos)) {
          state.productos = state.productos?.content || [];
        }
        // Asegurar que el producto tenga valores por defecto
        const nuevoProducto = {
          id: action.payload.id,
          nombre: action.payload.nombre || "Sin nombre",
          descripcion: action.payload.descripcion || "",
          precio: action.payload.precio || 0,
          stock: action.payload.stock || 0,
          estado: action.payload.estado || "DISPONIBLE",
          descuento: action.payload.descuento || 0,
          imagenUrl: action.payload.imagenUrl || "",
          ...action.payload,
        };
        state.productos.push(nuevoProducto);
      })
      .addCase(crearProducto.rejected, (state, action) => {
        state.productoOperation.loading = false;
        state.productoOperation.error = action.payload;
      })
      // Actualizar producto
      .addCase(actualizarProducto.pending, (state) => {
        state.productoOperation.loading = true;
        state.productoOperation.error = null;
      })
      .addCase(actualizarProducto.fulfilled, (state, action) => {
        state.productoOperation.loading = false;
        // Asegurar que productos es un array
        const productosArray = Array.isArray(state.productos)
          ? state.productos
          : state.productos?.content || [];
        const index = productosArray.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          productosArray[index] = action.payload;
        }
        state.productos = productosArray;
      })
      .addCase(actualizarProducto.rejected, (state, action) => {
        state.productoOperation.loading = false;
        state.productoOperation.error = action.payload;
      })
      // Eliminar producto
      .addCase(eliminarProducto.pending, (state) => {
        state.productoOperation.loading = true;
        state.productoOperation.error = null;
      })
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.productoOperation.loading = false;
        // Asegurar que productos es un array
        const productosArray = Array.isArray(state.productos)
          ? state.productos
          : state.productos?.content || [];
        state.productos = productosArray.filter((p) => p.id !== action.payload);
      })
      .addCase(eliminarProducto.rejected, (state, action) => {
        state.productoOperation.loading = false;
        state.productoOperation.error = action.payload;
      });
  },
});

export const selectProveedorCuenta = (state) => state.proveedor.cuenta;
export const selectProveedorProductos = (state) => state.proveedor.productos;
export const selectProveedorLoading = (state) => state.proveedor.loading;
export const selectProveedorError = (state) => state.proveedor.error;
export const selectProductoOperationLoading = (state) =>
  state.proveedor.productoOperation.loading;
export const selectProductoOperationError = (state) =>
  state.proveedor.productoOperation.error;

export const { clearError } = proveedorSlice.actions;
export default proveedorSlice.reducer;
