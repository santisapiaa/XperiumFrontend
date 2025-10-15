"use client";

import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import ItemCart from "./itemCart";
import { Link } from "react-router-dom";
import "./ItemCartContainer.css";

const ItemCartContainer = () => {
  const { cartItems, deleteAll, productsLength } = useContext(CartContext);

  // ¡Usa current.precio!
  const total = cartItems.reduce(
    (previous, current) =>
      previous + Number(current.precio) * Number(current.amount),
    0
  );

  const handleComprar = () => {
    // Verificar si hay un usuario logueado
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");

    if (!usuarioLogueado) {
      alert("❌ Debes iniciar sesión para realizar una compra.");
      return;
    }

    if (cartItems.length === 0) {
      alert("❌ El carrito está vacío.");
      return;
    }

    const usuario = JSON.parse(usuarioLogueado);

    // Obtener órdenes existentes o crear array vacío
    const ordenesExistentes =
      JSON.parse(localStorage.getItem("ordenDeCompra")) || [];
    const detallesExistentes =
      JSON.parse(localStorage.getItem("detalleDeCompra")) || [];

    // Generar ID único para la orden
    const ordenId =
      ordenesExistentes.length > 0
        ? Math.max(...ordenesExistentes.map((o) => o.id)) + 1
        : 1;

    // Crear la orden de compra
    const nuevaOrden = {
      id: ordenId,
      comprador_id: usuario.id,
      fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      total: total,
      estado: "FINALIZADA",
    };

    // Crear los detalles de compra para cada producto
    const nuevosDetalles = cartItems.map((item, index) => ({
      id: detallesExistentes.length + index + 1,
      orden_de_compra_id: ordenId,
      producto_id: item.id,
      cantidad: item.amount,
      precio_unitario: Number(item.precio),
    }));

    // Guardar en localStorage
    localStorage.setItem(
      "ordenDeCompra",
      JSON.stringify([...ordenesExistentes, nuevaOrden])
    );
    localStorage.setItem(
      "detalleDeCompra",
      JSON.stringify([...detallesExistentes, ...nuevosDetalles])
    );

    // Mostrar confirmación
    alert(
      `✅ ¡Compra realizada con éxito!\n\nOrden #${ordenId}\nTotal: $${total.toLocaleString()}\nProductos: ${productsLength}`
    );

    // Vaciar el carrito
    deleteAll();
  };

  return (
    <main className="cart-main">
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>No hay productos agregados.</p>
          <Link to="/">Ir a la tienda</Link>
        </div>
      ) : (
        <div>
          <div className="cart-container">
            <button onClick={deleteAll}>Vaciar carrito</button>
            <div className="cart-items">
              {cartItems.map((item) => (
                <ItemCart info={item} key={item.id} />
              ))}
            </div>
            <div className="cart-total">
              <span>Total: ${total.toLocaleString()}</span>
              <span>({productsLength} productos)</span>
              <button onClick={handleComprar}>Comprar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ItemCartContainer;
