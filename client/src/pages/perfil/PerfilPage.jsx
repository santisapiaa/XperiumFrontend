"use client";

import { useSelector } from "react-redux";
import PerfilUser from "../../components/perfilUser/PerfilUser";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function PerfilPage() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <p>No hay usuario logueado.</p>;
  }

  return (
    <div className="page-container">
      <Header />
      <PerfilUser />
      <Footer />
    </div>
  );
}

export default PerfilPage;
