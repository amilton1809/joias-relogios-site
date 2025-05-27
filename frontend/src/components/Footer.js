import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Joias & Relógios</h3>
            <p>Sua loja online de joias e relógios de luxo com os melhores preços e qualidade garantida.</p>
            <div className="social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Links Rápidos</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/produtos">Produtos</a></li>
              <li><a href="/produtos/joias">Joias</a></li>
              <li><a href="/produtos/relogios">Relógios</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contato</h3>
            <ul>
              <li><FaPhone /> (11) 95994-6164</li>
              <li><FaEnvelope /> a.milton18@hotmail.com</li>
              <li><FaMapMarkerAlt /> Lope de Vega, 26 - São Paulo</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Informações</h3>
            <ul>
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Termos e Condições</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Joias & Relógios. Todos os direitos reservados - Amilton.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
