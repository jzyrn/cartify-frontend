import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import cartifyLogo from "../../assets/cartify_logo.png";
import { API_BASE_URL, getUser, logout } from "../Utils/helpers";

export function Header() {
  useLocation(); // re-renders the header on every page change so login state stays fresh
  const navigate = useNavigate();
  const user = getUser();

  const logoutHandler = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`);
    } catch (err) {
      // even if the request fails, still log out on this device
    }
    logout(() => navigate("/login"));
  };

  return (
    <>
      <div className="shop-utility-bar">
        <Container className="d-flex justify-content-between">
          <span>Free shipping on orders over $150</span>
          <span>Help &nbsp;|&nbsp; Track order</span>
        </Container>
      </div>

      <Navbar expand="lg" className="shop-navbar" variant="dark">
        <Container className="d-flex justify-content-between align-items-center flex-wrap">
          <Navbar.Brand href="/" className="shop-brand">
            <img src={cartifyLogo} alt="Cartify" className="shop-logo-img" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="shop-nav" />

          <Navbar.Collapse id="shop-nav" className="justify-content-end">
            <div className="d-flex align-items-center shop-nav-icons">
              <Search />

              {/* not logged in -> /login, logged in -> /me */}
              <Link to={user ? "/me" : "/login"} className="shop-icon-link mx-3" title={user ? user.name : "Login / Register"}>
                <i className="fa fa-user-o shop-icon" />
              </Link>

              <a href="/cart" className="shop-icon-link">
                <i className="fa fa-shopping-cart shop-icon" />
              </a>

              {user && (
                <button
                  onClick={logoutHandler}
                  className="shop-icon-link ms-3"
                  title="Logout"
                  style={{ background: "none", border: 0 }}
                >
                  <i className="fa fa-sign-out shop-icon" />
                </button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;