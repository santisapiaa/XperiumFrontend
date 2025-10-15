import React, { useState, useEffect } from "react";
import "./perfilUser.css";

const PerfilUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="perfil-grid">
      <section className="perfil-panel perfil-main">
        <div className="perfil-panel-header">
          <h2>Perfil</h2>
          <a href="#" className="perfil-editar">
            Editar
          </a>
        </div>
        <div className="perfil-datos">
          <div>
            <span className="perfil-label">Nombre</span>
            <div>{user.nombre || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">Apellido</span>
            <div>{user.apellido || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">DNI:</span>
            <div>{user.dni || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">Teléfono (cod. área + número)</span>
            <div>{user.telefono || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">Email</span>
            <div>{user.email || "—"}</div>
          </div>
        </div>
      </section>

      <section className="perfil-panel perfil-pago">
        <div className="perfil-panel-header">
          <h3>Métodos de Pago</h3>
        </div>
        <div className="perfil-panel-body">
          <a href="#" className="perfil-link">
            +Nueva Tarjeta
          </a>
        </div>
      </section>

      <section className="perfil-panel perfil-direccion">
        <div className="perfil-panel-header">
          <h3>Direcciones</h3>
          <a href="#" className="perfil-link">
            Ver todas
          </a>
        </div>
        <div className="perfil-panel-body">
          <div className="perfil-dir-label">Dirección Principal</div>
          <div>
            {user.nombre || ""} {user.apellido || ""}
            <br />
            {user.direccion || "Null"}
            <br />
            {user.ciudad ||
              "Ciudad de Buenos Aires, Ciudad Autónoma de Buenos Aires 1424"}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PerfilUser;
