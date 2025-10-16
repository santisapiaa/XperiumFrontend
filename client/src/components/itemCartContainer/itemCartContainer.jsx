"use client"

import { useContext, useState } from "react"
import { CartContext } from "../../context/CartContext"
import { ordenesDeCompraAPI, detallesOrdenAPI } from "../../services/api"
import ItemCart from "./itemCart"
import { Link } from "react-router-dom"
import "./ItemCartContainer.css"

const ItemCartContainer = () => {
  const { cartItems, deleteAll, productsLength } = useContext(CartContext)
  const [loading, setLoading] = useState(false)

  const total = cartItems.reduce((previous, current) => previous + Number(current.precio) * Number(current.amount), 0)

  const handleComprar = async () => {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado")

    if (!usuarioLogueado) {
      alert("❌ Debes iniciar sesión para realizar una compra.")
      return
    }

    if (cartItems.length === 0) {
      alert("❌ El carrito está vacío.")
      return
    }

    try {
      setLoading(true)

      // Create order
      const ordenData = {
        total: total,
        estado: "FINALIZADA",
      }

      const ordenCreada = await ordenesDeCompraAPI.create(ordenData)

      // Create order details for each product
      for (const item of cartItems) {
        const detalleData = {
          orden_de_compra_id: ordenCreada.id,
          producto_id: item.id,
          cantidad: item.amount,
          precio_unitario: Number(item.precio),
        }
        await detallesOrdenAPI.create(detalleData)
      }

      alert(
        `✅ ¡Compra realizada con éxito!\n\nOrden #${ordenCreada.id}\nTotal: $${total.toLocaleString()}\nProductos: ${productsLength}`,
      )

      deleteAll()
    } catch (error) {
      console.error("Error al realizar la compra:", error)
      alert("❌ Error al procesar la compra. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

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
            <button onClick={deleteAll} disabled={loading}>
              Vaciar carrito
            </button>
            <div className="cart-items">
              {cartItems.map((item) => (
                <ItemCart info={item} key={item.id} />
              ))}
            </div>
            <div className="cart-total">
              <span>Total: ${total.toLocaleString()}</span>
              <span>({productsLength} productos)</span>
              <button onClick={handleComprar} disabled={loading}>
                {loading ? "Procesando..." : "Comprar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ItemCartContainer
