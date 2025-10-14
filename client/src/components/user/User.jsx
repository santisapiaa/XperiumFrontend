import logo from "./userIcon.png";
import "./user.css";

const User = () => {
  return (
    <div>
      <div className="ContainerLogoUser">
        <a href="#mas-Mi-Cuenta">
          <img className="UserIcon" src={logo} />
        </a>
      </div>
    </div>
  );
};

export default User;
