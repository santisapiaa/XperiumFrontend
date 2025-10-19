const API_BASE_URL = "/api"

// Helper function to get auth token
const getAuthToken = () => {
  const usuario = localStorage.getItem("usuarioLogueado")
  if (usuario) {
    const parsed = JSON.parse(usuario)
    return parsed.access_token
  }
  return null
}

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

const handleFetchError = async (response, defaultMessage) => {
  if (!response.ok) {
    let errorMessage = defaultMessage

    // Try to get error details from response
    try {
      const contentType = response.headers.get("content-type")

      // Check if response has JSON content
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        if (text) {
          const errorData = JSON.parse(text)
          errorMessage = errorData.message || errorData.error || defaultMessage
        }
      } else {
        // Try to get text response
        const text = await response.text()
        if (text) {
          errorMessage = text
        }
      }
    } catch (e) {
      // If parsing fails, use default message
      console.error("Error parsing error response:", e)
    }

    // Add specific messages for common HTTP status codes
    if (response.status === 403) {
      errorMessage = "Acceso denegado. Verifica que tengas permisos o que tu sesión no haya expirado."
    } else if (response.status === 401) {
      errorMessage = "No autorizado. Por favor, inicia sesión nuevamente."
    } else if (response.status === 404) {
      errorMessage = "Recurso no encontrado."
    } else if (response.status === 500) {
      errorMessage = `Error del servidor: ${errorMessage}`
    }

    throw new Error(errorMessage)
  }
}

// ============ AUTENTICACIÓN ============

export const authAPI = {
  login: async (email, contrasenia) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify({ email, contrasenia }),
      })

      await handleFetchError(response, "Error al iniciar sesión")
      const responseData = await response.json()
      return responseData
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:4002 y que tenga CORS configurado",
        )
      }
      throw error
    }
  },

  registerComprador: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/comprador`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify(userData),
      })

      await handleFetchError(response, "Error al registrar usuario")
      const responseData = await response.json()
      return responseData
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "No se puede conectar al servidor. Posibles causas:\n1. El backend no está corriendo en http://localhost:4002\n2. El backend no tiene CORS configurado para permitir requests desde http://localhost:5173\n3. Firewall bloqueando la conexión",
        )
      }
      throw error
    }
  },

  registerProveedor: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/proveedor`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify(userData),
      })

      await handleFetchError(response, "Error al registrar proveedor")
      const responseData = await response.json()
      return responseData
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "No se puede conectar al servidor. Posibles causas:\n1. El backend no está corriendo en http://localhost:4002\n2. El backend no tiene CORS configurado para permitir requests desde http://localhost:5173\n3. Firewall bloqueando la conexión",
        )
      }
      throw error
    }
  },
}

// ============ PRODUCTOS ============

export const productosAPI = {
  getAll: async (page = 0, size = 100) => {
    const response = await fetch(`${API_BASE_URL}/productos?page=${page}&size=${size}`, {
      headers: createHeaders(false),
    })

    await handleFetchError(response, "Error al obtener productos")
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      headers: createHeaders(false),
    })

    await handleFetchError(response, "Error al obtener producto")
    return response.json()
  },

  getByCategoria: async (categoriaId, page = 0, size = 100) => {
    const response = await fetch(`${API_BASE_URL}/productos/${categoriaId}/categoria?page=${page}&size=${size}`, {
      headers: createHeaders(false),
    })

    await handleFetchError(response, "Error al obtener productos por categoría")
    return response.json()
  },
}

// ============ COMPRADORES ============

export const compradoresAPI = {
  getMiCuenta: async (token = null) => {
    const headers = {
      "Content-Type": "application/json",
    }

    // Use provided token or get from localStorage
    const authToken = token || getAuthToken()
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`
    }

    const response = await fetch(`${API_BASE_URL}/compradores/micuenta`, {
      headers,
    })

    await handleFetchError(response, "Error al obtener cuenta")
    return response.json()
  },

  update: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/compradores/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(userData),
    })

    await handleFetchError(response, "Error al actualizar usuario")
    return response.json()
  },
}

// ============ DIRECCIONES ============

export const direccionesAPI = {
  getAll: async (page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/direcciones?page=${page}&size=${size}`, {
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al obtener direcciones")
    return response.json()
  },

  create: async (direccionData) => {
    const response = await fetch(`${API_BASE_URL}/direcciones`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(direccionData),
    })

    await handleFetchError(response, "Error al crear dirección")
    return response.json()
  },

  update: async (id, direccionData) => {
    const response = await fetch(`${API_BASE_URL}/direcciones/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(direccionData),
    })

    await handleFetchError(response, "Error al actualizar dirección")
    return response.json()
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/direcciones/${id}`, {
      method: "DELETE",
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al eliminar dirección")
    return response.ok
  },
}

// ============ ÓRDENES DE COMPRA ============

export const ordenesDeCompraAPI = {
  getAll: async (page = 0, size = 100) => {
    const response = await fetch(`${API_BASE_URL}/ordenesDeCompra?page=${page}&size=${size}`, {
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al obtener órdenes")
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ordenesDeCompra/${id}`, {
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al obtener orden")
    return response.json()
  },

  create: async (ordenData) => {
    const response = await fetch(`${API_BASE_URL}/ordenesDeCompra`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(ordenData),
    })

    await handleFetchError(response, "Error al crear orden")
    return response.json()
  },
}

// ============ DETALLES DE ORDEN ============

export const detallesOrdenAPI = {
  create: async (detalleData) => {
    const response = await fetch(`${API_BASE_URL}/detallesOrdenDeCompra`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(detalleData),
    })

    await handleFetchError(response, "Error al agregar producto a orden")
    return response.json()
  },
}

// ============ CATEGORÍAS ============

export const categoriasAPI = {
  getAll: async (page = 0, size = 100) => {
    const response = await fetch(`${API_BASE_URL}/categorias?page=${page}&size=${size}`, {
      headers: createHeaders(false),
    })

    await handleFetchError(response, "Error al obtener categorías")
    return response.json()
  },
}

// ============ PROVEEDORES ============

export const proveedoresAPI = {
  getMiCuenta: async (token = null) => {
    const headers = {
      "Content-Type": "application/json",
    }

    const authToken = token || getAuthToken()
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`
    }

    const response = await fetch(`${API_BASE_URL}/proveedores/micuenta`, {
      headers,
    })

    await handleFetchError(response, "Error al obtener cuenta de proveedor")
    return response.json()
  },

  getMisProductos: async (page = 0, size = 100) => {
    const response = await fetch(`${API_BASE_URL}/productos/misproductos?page=${page}&size=${size}`, {
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al obtener mis productos")
    return response.json()
  },

  createProducto: async (productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(productoData),
    })

    await handleFetchError(response, "Error al crear producto")

    // Check if response is successful
    if (response.ok) {
      const contentType = response.headers.get("content-type")

      // If response is JSON, parse it
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }

      // If response is text (like "Producto creado exitosamente"), return a success object
      const text = await response.text()
      return {
        success: true,
        message: text || "Producto creado exitosamente",
        id: null, // Backend should ideally return the created product ID
      }
    }

    // This shouldn't be reached due to handleFetchError, but just in case
    throw new Error("Error al crear producto")
  },

  updateProducto: async (id, productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(productoData),
    })

    await handleFetchError(response, "Error al actualizar producto")
    return response.json()
  },

  deleteProducto: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "DELETE",
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al eliminar producto")
    return response.ok
  },
}
