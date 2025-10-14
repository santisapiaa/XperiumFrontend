import React from "react";
import Header from "../../components/header/Header";
import Carousel from "../../components/carousel/Carousel";
import Footer from "../../components/footer/Footer";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="homepage">
      <Header />
      <Carousel />
    </div>
  );
}

export default Homepage;
