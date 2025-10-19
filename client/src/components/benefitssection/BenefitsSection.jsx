import "./BenefitsSection.css"

const benefits = [
  {
    icon: "🎁",
    title: "Regalo perfecto",
    description: "Experiencias únicas que crean recuerdos inolvidables",
  },
  {
    icon: "✅",
    title: "Fácil y seguro",
    description: "Compra online con total seguridad y confirmación inmediata",
  },
  {
    icon: "📅",
    title: "Flexibilidad total",
    description: "Elegí la fecha que más te convenga para vivir tu experiencia",
  },
  {
    icon: "💯",
    title: "Satisfacción garantizada",
    description: "Miles de clientes satisfechos respaldan nuestro servicio",
  },
]

function BenefitsSection() {
  return (
    <div className="benefits-section">
      <div className="benefits-container">
        <h2 className="benefits-title">¿Por qué elegir Xperium?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BenefitsSection

