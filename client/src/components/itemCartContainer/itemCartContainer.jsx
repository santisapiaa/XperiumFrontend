"use client"

import { useContext, useState } from "react"
import { CartContext } from "../../context/CartContext"
import { ordenesDeCompraAPI, detallesOrdenAPI } from "../../services/api"
import ItemCart from "./itemCart"
import { Link, useNavigate } from "react-router-dom"
import "./ItemCartContainer.css"

const ItemCartContainer = () => {
  const { cartItems, deleteAll, productsLength } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const total = cartItems.reduce((previous, current) => previous + Number(current.precio) * Number(current.amount), 0)

  const handleComprar = async () => {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado")

    if (!usuarioLogueado) {
      alert("❌ Debes iniciar sesión para realizar una compra.")
      navigate("/login")
      return
    }

    if (cartItems.length === 0) {
      alert("❌ El carrito está vacío.")
      return
    }

    try {
      setLoading(true)

      const ordenCreada = await ordenesDeCompraAPI.create({})

      for (const item of cartItems) {
        const detalleData = {
          ordenDeCompraId: ordenCreada.id,
          productoId: item.id,
          cantidad: item.amount,
          precioUnitario: Number(item.precio),
        }
        await detallesOrdenAPI.create(detalleData)
      }

      const ordenFinalizada = await ordenesDeCompraAPI.finalizar(ordenCreada.id)

      alert(
        `✅ ¡Compra realizada con éxito!\n\nOrden #${ordenFinalizada.id}\nTotal: $${ordenFinalizada.total.toLocaleString()}\nProductos: ${productsLength}`,
      )

      deleteAll()
      navigate("/compras")
    } catch (error) {
      console.error("Error al procesar la compra:", error)
      alert(`❌ Error al procesar la compra: ${error.message}`)
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
          <Link to="/experiencias">Ir a la tienda</Link>
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
