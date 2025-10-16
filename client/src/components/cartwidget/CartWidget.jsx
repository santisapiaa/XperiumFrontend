import logo from "./cartIcon.png"
import "./CartWidget.css"

const CartWidget = () => {
  return (
    <div>
      <div className="ContainerLogoCart">
        <img className="CartIcon" src={logo || "/placeholder.svg"} alt="Carrito" />
      </div>
    </div>
  )
}

export default CartWidget
