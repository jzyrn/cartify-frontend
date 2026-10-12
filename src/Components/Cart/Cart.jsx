import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const increaseQty = (item) => {
    const newQty = item.quantity + 1;
    if (newQty > item.stock) return;
    dispatch(addItemToCart(item.product, newQty, item.shade));
  };

  const decreaseQty = (item) => {
    const newQty = item.quantity - 1;
    if (newQty <= 0) return;
    dispatch(addItemToCart(item.product, newQty, item.shade));
  };

  const removeHandler = (item) => {
    dispatch(removeItemFromCart(item.product, item.shade));
  };

  const checkoutHandler = () => {
    navigate(isAuthenticated ? "/shipping" : "/login?redirect=shipping");
  };

  const units = cartItems.reduce((acc, item) => acc + Number(item.quantity), 0);
  const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <>
      <MetaData title="Your Cart" />
      <Container className="cartify-cart py-5">
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h2>Your cart is empty</h2>
            <Link to="/">Continue shopping</Link>
          </div>
        ) : (
          <>
            <h2 className="mb-4">
              Your Cart: <b>{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</b>
            </h2>

            <div className="cartify-cart-layout">
              <div className="cartify-cart-list">
                {cartItems.map((item) => (
                  <div className="cartify-cart-item" key={`${item.product}-${item.shade || ""}`}>
                    <div className="cartify-cart-thumb">
                      {item.image ? <img src={item.image} alt={item.name} /> : <i className="fa fa-shopping-bag" />}
                    </div>

                    <div className="cartify-cart-info">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      {item.brand && <p className="cartify-cart-sub">{item.brand}</p>}
                      {item.shade && <p className="cartify-cart-sub">Shade: {item.shade}</p>}
                    </div>

                    <div className="cartify-cart-price">₱{item.price}</div>

                    <div className="cartify-qty">
                      <button type="button" onClick={() => decreaseQty(item)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => increaseQty(item)}>+</button>
                    </div>

                    <button
                      type="button"
                      className="cartify-cart-remove"
                      onClick={() => removeHandler(item)}
                      title="Remove"
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                ))}
              </div>

              <aside className="cartify-cart-summary">
                <h4>Order Summary</h4>
                <hr />
                <p>Units: <span>{units}</span></p>
                <p>Est. total: <span>₱{total.toFixed(2)}</span></p>
                <hr />
                <button type="button" className="cartify-btn primary w-100" onClick={checkoutHandler}>
                  Check out
                </button>
              </aside>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;