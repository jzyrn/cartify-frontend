import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import { getProductDetails, clearErrors } from "../../actions/productActions";
import { addItemToCart } from "../../actions/cartActions";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.productDetails);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [shade, setShade] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProductDetails(id));
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);

  if (error) {
    return (
      <Container className="py-5">
        <p>{error}</p>
        <Link to="/">Back to shop</Link>
      </Container>
    );
  }

  // wait until the loaded product is the one in the URL
  if (loading || product._id !== id) return <Loader />;

  const hasShades = product.shades && product.shades.length > 0;

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your cart", { position: "bottom-right" });
      navigate(`/login?redirect=/product/${product._id}`);
      return;
    }

    if (hasShades && !shade) {
      return toast.error("Please choose a shade", { position: "bottom-right" });
    }
    dispatch(addItemToCart(product._id, quantity, shade));
    toast.success("Cart updated", { position: "bottom-right" });
  };

  return (
    <>
      <MetaData title={product.name} />
      <Container className="py-5">
        <Link to="/" className="cartify-details-back">&larr; Back to shop</Link>

        <Row className="mt-3">
          <Col md={5} className="mb-4">
            <div className="cartify-details-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0].url} alt={product.name} />
              ) : (
                <i className="fa fa-shopping-bag" />
              )}
            </div>
          </Col>

          <Col md={7}>
            <p className="cartify-details-meta">{product.category}</p>
            <h1 className="cartify-details-name">{product.name}</h1>
            <p className="cartify-details-brand">{product.brand}</p>
            <p className="cartify-details-price">₱{product.price}</p>
            <p className="cartify-details-desc">{product.description}</p>

            {hasShades && (
              <div className="mb-3">
                <strong>Shade:</strong> {shade || "Select one"}
                <div className="cartify-shades">
                  {product.shades.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={"cartify-shade" + (s === shade ? " active" : "")}
                      onClick={() => setShade(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mb-3">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            {product.stock > 0 && (
              <div className="cartify-details-actions">
                <div className="cartify-qty">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
                <button type="button" className="cartify-btn primary" onClick={addToCartHandler}>
                  Add to Cart
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}