"use client"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./Header.css"
import User from "../user/user"
import CartWidget from "../cartwidget/cartWidget"

function Header() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const goHome = () => {
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/experiencias?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    
    <header className="header">
      <div className="logo" onClick={goHome}>
        Xperium
      </div>

      <nav className="nav">
        <Link to="/experiencias">Experiencias</Link>
        <Link to="/eventos">Eventos</Link>
        <a href="#mas-vendidos">Más vendidos</a>
      </nav>

      <div className="actions">
        <input
          type="text"
          placeholder="Buscar experiencias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn-regalo">Abrir regalo</button>
      </div>
      
      <div className="actions">
        <User />
        <Link to="/carrito">
          <CartWidget />
        </Link>
      </div>
    </header>
  )
}

export default Header
