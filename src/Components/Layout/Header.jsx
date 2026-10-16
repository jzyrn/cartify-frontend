import React from "react";
import { Navbar, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Search from "./Search";
import cartifyLogo from "../../assets/cartify_logo.png";
import { logout } from "../../actions/userActions";
import { clearCart } from "../../actions/cartActions";

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = async () => {
  await dispatch(logout());
  dispatch(clearCart());
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingInfo");
  toast.success("Logged out", { position: "bottom-right" });
  navigate("/login");
};

  return (
    <>
      <Navbar expand="lg" className="shop-navbar" variant="dark">
        <Container className="d-flex justify-content-between align-items-center flex-wrap">
          <Navbar.Brand as={Link} to="/" className="shop-brand">
            <img src={cartifyLogo} alt="Cartify" className="shop-logo-img" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="shop-nav" />

          <Navbar.Collapse id="shop-nav" className="justify-content-end">
            <div className="d-flex align-items-center shop-nav-icons">
              <Search />

              {/* not logged in -> /login link; logged in -> dropdown with the name beside the icon */}
              {isAuthenticated && user ? (
                <NavDropdown
                  align="end"
                  id="user-dropdown"
                  className="mx-3"
                  title={
                    <span className="d-inline-flex align-items-center">
                      <i className="fa fa-user-o shop-icon" />
                      <span className="ms-2 text-white">{user.name}</span>
                    </span>
                  }
                >
                  {user.role === "admin" && (
                    <NavDropdown.Item as={Link} to="/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={Link} to="/me">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders/me">
                    My Orders
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link
                  to="/login"
                  className="shop-icon-link mx-3 d-inline-flex align-items-center"
                  title="Login / Register"
                >
                  <i className="fa fa-user-o shop-icon" />
                </Link>
              )}

              <Link to="/cart" className="shop-icon-link d-inline-flex align-items-center" title="My cart">
                <i className="fa fa-shopping-cart shop-icon" />
                {cartItems.length > 0 && (
                  <span className="cartify-cart-count">{cartItems.length}</span>
                )}
              </Link>

              {isAuthenticated && user && (
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