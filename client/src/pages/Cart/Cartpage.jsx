import Header from "../../components/header/Header"
import ItemCartContainer from "../../components/itemCartContainer/itemCartContainer"
import "./Cartpage.css"

function Cartpage() {
  return (
    <div className="page-container">
      <Header />
      <ItemCartContainer />
    </div>
  )
}

export default Cartpage
