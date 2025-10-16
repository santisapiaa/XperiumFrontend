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
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || defaultMessage)
    } catch (e) {
      if (e.message && e.message !== defaultMessage) {
        throw e
      }
      throw new Error(defaultMessage)
    }
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
      console.log("[v0] Registering proveedor with data:", userData)
      const response = await fetch(`${API_BASE_URL}/auth/register/proveedor`, {
        method: "POST",
        headers: createHeaders(false),
        body: JSON.stringify(userData),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      const contentType = response.headers.get("content-type")
      console.log("[v0] Content-Type:", contentType)

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Error al registrar proveedor"
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } else {
            const textError = await response.text()
            console.log("[v0] Error response text:", textError)
            errorMessage = textError || errorMessage
          }
        } catch (e) {
          console.log("[v0] Could not parse error response:", e)
        }
        throw new Error(errorMessage)
      }

      // Check if response has JSON content
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json()
        console.log("[v0] Success response:", responseData)
        return responseData
      } else {
        // If no JSON, return success indicator
        console.log("[v0] No JSON response, registration might be successful")
        return { success: true }
      }
    } catch (error) {
      console.error("[v0] Registration error:", error)
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

  finalizar: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ordenesDeCompra/${id}/finalizar`, {
      method: "PUT",
      headers: createHeaders(true),
    })

    await handleFetchError(response, "Error al finalizar orden")
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
