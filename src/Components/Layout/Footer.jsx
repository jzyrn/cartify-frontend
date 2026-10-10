import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="shop-footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="shop-footer-brand">Cartify</h5>
            <p className="shop-footer-text">
              Considered essentials in leather, wool, and steel — made to be
              worn in, not worn out.
            </p>
          </Col>

          <Col md={2} className="mb-4">
            <h6 className="shop-footer-heading">Shop</h6>
            <ul className="shop-footer-links">
              <li><a href="/new-arrivals">New Arrivals</a></li>
              <li><a href="/watches">Watches</a></li>
              <li><a href="/bags">Bags</a></li>
              <li><a href="/sale">Sale</a></li>
            </ul>
          </Col>

          <Col md={2} className="mb-4">
            <h6 className="shop-footer-heading">Help</h6>
            <ul className="shop-footer-links">
              <li><a href="/track-order">Track order</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/shipping">Shipping</a></li>
              <li><a href="/contact">Contact us</a></li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h6 className="shop-footer-heading">Stay in the loop</h6>
            <form className="shop-newsletter-form d-flex">
              <input
                type="email"
                id="newsletter-email"
                name="newsletter-email"
                placeholder="Your email"
                className="shop-newsletter-input"
              />
              <button type="submit" className="shop-newsletter-btn">
                Subscribe
              </button>
            </form>
          </Col>
        </Row>

        <hr className="shop-footer-divider" />

        <p className="shop-footer-bottom">
          &copy; {new Date().getFullYear()} Cartify. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}