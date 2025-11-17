import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "../../redux/cartSlice";
import { selectUser } from "../../redux/authSlice";
import { crearOrden } from "../../redux/ordenesSlice";
import PaymentMethods from "../../components/paymentMethods/PaymentMethods";
import OrderSummary from "../../components/orderSummary/OrderSummary";
import { useState, useEffect } from "react";
import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectUser);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/carrito");
    }
  }, [cartItems.length, navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleConfirmPurchase = async () => {
    if (!selectedPayment) {
      alert("Selecciona un método de pago");
      return;
    }

    try {
      setLoading(true);

      const items = cartItems.map((item) => ({
        id: item.id,
        quantity: item.amount,
        precio: Number(item.precio),
      }));

      const ordenFinal = await dispatch(
        crearOrden({ 
          items, 
          metodoPago: selectedPayment.type,
          detalleMetodoPago: selectedPayment.details 
        })
      ).unwrap();

      alert(
        `¡Compra realizada con éxito!\nOrden #${ordenFinal.id}\nTotal: $${ordenFinal.total.toLocaleString()}`
      );

      dispatch(clearCart());
      navigate("/compras");
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert(`Error al procesar la compra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 || !user) {
    return null;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="checkout-left">
          <PaymentMethods onSelect={setSelectedPayment} selected={selectedPayment} />
          <button 
            onClick={handleConfirmPurchase} 
            disabled={loading || !selectedPayment}
            className="btn-checkout-confirm"
          >
            {loading ? "Procesando..." : "Continuar"}
          </button>
        </div>
        <div className="checkout-right">
          <OrderSummary cartItems={cartItems} total={total} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
