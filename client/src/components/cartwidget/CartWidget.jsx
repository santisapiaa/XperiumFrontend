import logo from "./cartIcon.png";
import "./CartWidget.css";

const CartWidget = () => {
  return (
    <div>
      <div className="ContainerLogoCart">
        <a href="#mas-carrito">
          <img className="CartIcon" src={logo} />
        </a>
      </div>
    </div>
  );
};

export default CartWidget;
