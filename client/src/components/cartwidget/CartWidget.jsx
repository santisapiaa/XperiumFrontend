import { useSelector } from "react-redux";
import { selectCartItemsCount } from "../../redux/cartSlice";
import logo from "./cartIcon.png";
import "./CartWidget.css";

const CartWidget = () => {
  const productsLength = useSelector(selectCartItemsCount);

  return (
    <div>
      <div className="ContainerLogoCart">
        <img
          className="CartIcon"
          src={logo || "/placeholder.svg"}
          alt="Carrito"
        />
        {productsLength > 0 && (
          <span className="cart-badge">{productsLength}</span>
        )}
      </div>
    </div>
  );
};

export default CartWidget;
