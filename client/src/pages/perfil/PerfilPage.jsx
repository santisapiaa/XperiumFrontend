import React, { useEffect, useState } from "react";
import PerfilUser from "../../components/perfilUser/perfilUser";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
function PerfilPage() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  if (!usuario) {
    return <p>No hay usuario logueado.</p>;
  }

  return (
    <div>
      <Header />
      <PerfilUser />
      <Footer />
    </div>
  );
}

export default PerfilPage;
