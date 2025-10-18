import Header from "../../components/header/Header"
import Carousel from "../../components/carousel/Carousel"
import "./Homepage.css"
import UsuarioLogueado from "../../components/UsuarioLogueado/UsuarioLogueado"

function Homepage() {
  return (
    <div className="page-container">
      <UsuarioLogueado />
      <Header />
      <Carousel />
    </div>
  )
}

export default Homepage
