import Header from "../../components/header/Header"
import HeroSection from "../../components/HeroSection/HeroSection"
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel"
import FeaturedExperiences from "../../components/FeaturedExperiences/FeaturedExperiences"
import BenefitsSection from "../../components/BenefitsSection/BenefitsSection"
import "./Homepage.css"

function Homepage() {
  return (
    <div className="homepage">
      <Header />
      <HeroSection />
      <CategoryCarousel />
      <FeaturedExperiences />
      <BenefitsSection />
    </div>
  )
}

export default Homepage

