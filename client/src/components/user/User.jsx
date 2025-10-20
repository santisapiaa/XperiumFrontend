import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./userIcon.png";
import "./user.css";
import MenuUsuario from "../../components/MenuUsuario/MenuUsuario";

const User = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setMenuVisible((prev) => !prev);
  };

  return (
    <div>
      <div className="ContainerLogoUser">
        <button
          onClick={handleClick}
          className="user-button"
          aria-label="Ir a usuario"
        >
          <img className="UserIcon" src={logo} alt="user icon" />
        </button>
        {menuVisible && <MenuUsuario onClose={() => setMenuVisible(false)} />}
      </div>
    </div>
  );
};

export default User;
