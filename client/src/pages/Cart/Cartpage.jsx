import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ItemCartContainer from "../../components/itemCartContainer/itemCartContainer";
import "./Cartpage.css";

function Cartpage() {
  return (
    <div className="cartpage">
      <Header />
      <ItemCartContainer />
    </div>
  );
}

export default Cartpage;
