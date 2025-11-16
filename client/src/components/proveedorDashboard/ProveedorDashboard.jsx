"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMiCuenta,
  fetchMisProductos,
  crearProducto as crearProductoThunk,
  actualizarProducto as actualizarProductoThunk,
  eliminarProducto as eliminarProductoThunk,
} from "../../redux/proveedorSlice";
import { logout, selectUser } from "../../redux/authSlice";
import { fetchCategorias } from "../../redux/categoriasSlice";
import "./ProveedorDashboard.css";

function ProveedorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cuenta: proveedor,
    productos,
    loading,
    error,
  } = useSelector((state) => state.proveedor);
  const { items: categorias } = useSelector((state) => state.categorias);
  const authUser = useSelector(selectUser);

  // Usar datos de auth como fallback si proveedor no está cargado aún
  const proveedorData = proveedor || authUser;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    precio: "",
    estado: "DISPONIBLE",
    stock: "",
    ubicacion: "",
    cantPersonas: "",
    categoriaId: "",
    descuento: "0",
  });

  useEffect(() => {
    dispatch(fetchMiCuenta());
    dispatch(fetchMisProductos());
    dispatch(fetchCategorias());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="proveedor-container">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="proveedor-container">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleOpenModal = (producto = null) => {
    if (producto) {
      setEditingProduct(producto);
      const precioOriginal =
        producto.descuento > 0
          ? producto.precio / (1 - producto.descuento / 100)
          : producto.precio;
      setOriginalPrice(precioOriginal);

      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagenUrl: producto.imagenUrl,
        precio: producto.precio,
        estado: producto.estado,
        stock: producto.stock,
        ubicacion: producto.ubicacion,
        cantPersonas: producto.cantPersonas,
        categoriaId: producto.categoriaId,
        descuento: producto.descuento || "0",
      });
    } else {
      setEditingProduct(null);
      setOriginalPrice(null);
      setFormData({
        nombre: "",
        descripcion: "",
        imagenUrl: "",
        precio: "",
        estado: "DISPONIBLE",
        stock: "",
        ubicacion: "",
        cantPersonas: "",
        categoriaId: "",
        descuento: "0",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "descuento") {
      const newDescuento = Number.parseInt(value) || 0;

      if (newDescuento === 0 && originalPrice !== null) {
        setFormData({
          ...formData,
          [name]: value,
          precio: originalPrice.toString(),
        });
        return;
      }
    }

    if (name === "precio" && originalPrice === null && value) {
      setOriginalPrice(Number.parseFloat(value));
    }

    setFormData({ ...formData, [name]: value });
  };

  const calculateFinalPrice = () => {
    const precio = Number.parseFloat(formData.precio) || 0;
    const descuento = Number.parseInt(formData.descuento) || 0;

    if (descuento > 0 && descuento <= 100) {
      return precio * (1 - descuento / 100);
    }
    return precio;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productoData = {
        ...formData,
        imagenUrl: formData.imagenUrl,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock),
        cantPersonas: Number.parseInt(formData.cantPersonas),
        categoriaId: Number.parseInt(formData.categoriaId),
        descuento: Number.parseInt(formData.descuento),
      };

      if (editingProduct) {
        await dispatch(
          actualizarProductoThunk({ id: editingProduct.id, productoData })
        ).unwrap();
        alert("Producto actualizado exitosamente");
      } else {
        await dispatch(crearProductoThunk(productoData)).unwrap();
        alert("Producto creado exitosamente");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving producto:", error);
      alert("Error al guardar el producto: " + error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este producto?")
    ) {
      return;
    }

    try {
      await dispatch(eliminarProductoThunk(id)).unwrap();
      alert("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting producto:", error);
      alert("Error al eliminar el producto: " + error);
    }
  };

  const productosArray = productos
    ? Array.isArray(productos)
      ? productos
      : productos?.content || []
    : [];
  const categoriasArray = categorias
    ? Array.isArray(categorias)
      ? categorias
      : categorias?.content || []
    : [];

  return (
    <div className="proveedor-container">
      <header className="proveedor-header">
        <h1>Panel de Vendedor</h1>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>

      <section className="proveedor-info">
        <h2>Mis Datos</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Nombre:</label>
            <span>{proveedorData?.nombre || "—"}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{proveedorData?.email || "—"}</span>
          </div>
          <div className="info-item">
            <label>Teléfono:</label>
            <span>{proveedorData?.telefono || "—"}</span>
          </div>
        </div>
      </section>

      <section className="productos-section">
        <div className="productos-header">
          <h2>Mis Productos</h2>
          <button onClick={() => handleOpenModal()} className="add-btn">
            + Agregar Producto
          </button>
        </div>

        {productosArray.length === 0 ? (
          <p className="no-productos">
            No tienes productos aún. ¡Agrega tu primer producto!
          </p>
        ) : (
          <div className="productos-grid">
            {productosArray.map((producto) => (
              <div key={producto.id} className="producto-card">
                <img
                  src={
                    producto.imagenUrl ||
                    "/placeholder.svg?height=200&width=300"
                  }
                  alt={producto.nombre}
                />
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <p className="producto-descripcion">{producto.descripcion}</p>
                  {producto.descuento > 0 ? (
                    <div className="producto-precio-container">
                      <p className="producto-descuento">
                        Descuento: {producto.descuento}%
                      </p>
                      <p className="producto-precio-original">
                        $
                        {(
                          (producto.precio || 0) /
                          (1 - (producto.descuento || 0) / 100)
                        ).toLocaleString()}
                      </p>
                      <p className="producto-precio">
                        ${(producto.precio || 0).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="producto-precio">
                      ${(producto.precio || 0).toLocaleString()}
                    </p>
                  )}
                  <p className="producto-stock">Stock: {producto.stock || 0}</p>
                  <p className="producto-estado">
                    Estado: {producto.estado || "N/A"}
                  </p>
                  <div className="producto-actions">
                    <button
                      onClick={() => handleOpenModal(producto)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="delete-btn"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Editar Producto" : "Agregar Producto"}</h2>
            <form onSubmit={handleSubmit} className="producto-form">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />

              <div className="image-url-container">
                <input
                  type="url"
                  name="imagenUrl"
                  placeholder="URL de la imagen"
                  value={formData.imagenUrl}
                  onChange={handleChange}
                  className="image-url-input"
                  required
                />
                {formData.imagenUrl && (
                  <div className="image-preview">
                    <img
                      src={formData.imagenUrl || "/placeholder.svg"}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=300";
                      }}
                    />
                  </div>
                )}
              </div>

              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                required
              />
              <input
                type="number"
                name="descuento"
                placeholder="Descuento (%)"
                value={formData.descuento}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
              {formData.precio && formData.descuento > 0 && (
                <div className="precio-preview">
                  <p>
                    <strong>Precio base:</strong> $
                    {Number.parseFloat(formData.precio).toLocaleString(
                      "es-AR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                  <p>
                    <strong>Descuento:</strong> {formData.descuento}%
                  </p>
                  <p className="precio-final">
                    <strong>Precio final:</strong> $
                    {calculateFinalPrice().toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="NO_DISPONIBLE">No Disponible</option>
              </select>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="cantPersonas"
                placeholder="Cantidad de personas"
                value={formData.cantPersonas}
                onChange={handleChange}
                required
              />
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categoriasArray.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.descripcion}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProveedorDashboard;
