"use client"

import { useNavigate } from "react-router-dom"
import "./HeroSection.css"

function HeroSection() {
  const navigate = useNavigate()

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Regalá momentos <span className="hero-highlight">inolvidables</span>
        </h1>
        <p className="hero-subtitle">
          Descubrí experiencias únicas en Argentina. Desde aventuras extremas hasta momentos de relax absoluto.
        </p>
        <div className="hero-actions">
          <button className="hero-btn primary" onClick={() => navigate("/experiencias")}>
            Ver todas las experiencias
          </button>
          <button className="hero-btn secondary" onClick={() => navigate("/eventos")}>
            Explorar eventos
          </button>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Experiencias</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50K+</span>
          <span className="stat-label">Clientes felices</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">Satisfacción</span>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

