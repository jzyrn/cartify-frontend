import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="cartify-footer">
      <Container>
        <div className="cartify-footer-top">
          <div>
            <h4 className="cartify-footer-brand">Cartify</h4>
            <p className="cartify-footer-tagline">
              Makeup you'll actually love wearing. Easy to find, easy to try,
              easy to love.
            </p>
          </div>

          <nav className="cartify-footer-links">
            <Link to="/">Shop</Link>
            <Link to="/me">My account</Link>
            <Link to="/cart">My bag</Link>
          </nav>
        </div>

        <div className="cartify-footer-bottom">
          <span>&copy; {new Date().getFullYear()} Cartify</span>
          <span>Questions? hello@cartify.com</span>
        </div>
      </Container>
    </footer>
  );
}