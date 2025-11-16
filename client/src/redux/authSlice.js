import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI, compradoresAPI, proveedoresAPI } from "../services/api";
import {
  setCurrentToken,
  clearToken,
  getCurrentToken,
} from "../services/tokenStore";

// Async thunks
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    const token = getCurrentToken();
    if (!token) {
      return null;
    }

    try {
      // Decodificar el JWT para obtener el rol
      const decoded = decodeToken(token);
      const roles = decoded?.roles || [];
      let rol = "COMPRADOR"; // default

      if (roles.includes("ROLE_VENDEDOR")) {
        rol = "PROVEEDOR";
      } else if (roles.includes("ROLE_COMPRADOR")) {
        rol = "COMPRADOR";
      }

      // Intentar obtener datos de comprador
      try {
        const userData = await compradoresAPI.getMiCuenta(token);
        return {
          ...userData,
          access_token: token,
          rol: rol,
        };
      } catch (error) {
        // Si no es comprador, intentar proveedor
        const userData = await proveedoresAPI.getMiCuenta(token);
        return {
          ...userData,
          access_token: token,
          rol: rol,
        };
      }
    } catch (error) {
      console.error("Error restoring session:", error);
      clearToken();
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to decode JWT
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, contrasenia }) => {
    const data = await authAPI.login(email, contrasenia);
    console.log("Login response from backend:", data);

    // Decodificar el JWT para obtener el rol
    const decoded = decodeToken(data.access_token);
    const roles = decoded?.roles || [];
    let rol = "COMPRADOR"; // default

    if (roles.includes("ROLE_VENDEDOR")) {
      rol = "PROVEEDOR";
    } else if (roles.includes("ROLE_COMPRADOR")) {
      rol = "COMPRADOR";
    }

    console.log("Decoded token:", decoded);
    console.log("Extracted role:", rol);

    // Determinar el rol y obtener datos adicionales
    let userData = null;
    try {
      if (rol === "COMPRADOR") {
        userData = await compradoresAPI.getMiCuenta(data.access_token);
      } else if (rol === "PROVEEDOR") {
        userData = await proveedoresAPI.getMiCuenta(data.access_token);
      }
    } catch (error) {
      console.error("Error obteniendo datos de usuario:", error);
    }

    const returnValue = {
      ...data,
      userData,
      rol: rol,
      access_token: data.access_token,
    };
    console.log("Login thunk returning:", returnValue);
    return returnValue;
  }
);

export const registerComprador = createAsyncThunk(
  "auth/registerComprador",
  async (userData) => {
    const data = await authAPI.registerComprador(userData);
    return data;
  }
);

export const registerProveedor = createAsyncThunk(
  "auth/registerProveedor",
  async (userData) => {
    const data = await authAPI.registerProveedor(userData);
    return data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, userData }) => {
    await compradoresAPI.update(userId, userData);
    return userData;
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userData: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      clearToken();
      state.user = null;
      state.userData = null;
      state.isAuthenticated = false;
    },
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Restore Session
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.userData = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.userData = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.userData = action.payload.userData;
        state.isAuthenticated = true;
        if (action.payload.access_token) {
          setCurrentToken(action.payload.access_token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      // Register Comprador
      .addCase(registerComprador.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerComprador.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerComprador.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register Proveedor
      .addCase(registerProveedor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerProveedor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerProveedor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userData) {
          state.userData = { ...state.userData, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, updateUserData, setUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserData = (state) => state.auth.userData;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.rol;

export default authSlice.reducer;
