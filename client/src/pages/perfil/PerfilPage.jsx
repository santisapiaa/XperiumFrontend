import { useSelector } from "react-redux";
import PerfilUser from "../../components/perfilUser/PerfilUser";
import Header from "../../components/header/Header";

function PerfilPage() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <p>No hay usuario logueado.</p>;
  }

  return (
    <div className="page-container">
      <Header />
      <PerfilUser />
    </div>
  );
}

export default PerfilPage;
