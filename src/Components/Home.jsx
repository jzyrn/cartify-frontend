import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MetaData from "./Layout/MetaData";

const categories = [
  "Foundation",
  "Concealer",
  "Powder",
  "Blush & Highlighter",
  "Eyeshadow",
  "Eyeliner & Mascara",
  "Lipstick & Lip Tint",
  "Brows",
];

const API_BASE_URL = "http://localhost:4001/api/v1";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // filter on the page for now; later this moves to the backend (apiFeatures)
  const visibleProducts = products.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="shop-page">
      <MetaData title="Buy Best Makeup Online" />

      {/* Category rail */}
      <section className="shop-category-rail">
        <Container className="d-flex flex-wrap">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              className={"shop-chip" + (cat === activeCategory ? " active" : "")}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </Container>
      </section>

      {/* Product grid */}
      <section className="shop-products">
        <Container>
          <div className="shop-section-heading">
            <h2>Featured products</h2>
            <a href="/products">View all</a>
          </div>

          {loading && <p>Loading products...</p>}

          {error && (
            <p style={{ color: "red" }}>
              Could not load products: {error}. Is your backend running on{" "}
              {API_BASE_URL}?
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p>No products found. Have you run the seeder yet?</p>
          )}

          {!loading && !error && products.length > 0 && visibleProducts.length === 0 && (
            <p>No products in this category.</p>
          )}

          <Row>
            {!loading &&
              !error &&
              visibleProducts.map((p) => (
                <Col key={p._id} sm={6} lg={4} className="mb-4">
                  <div className="shop-card">
                    <div className="shop-card-image">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <i className="fa fa-shopping-bag" />
                      )}
                    </div>
                    <div className="shop-card-body">
                      <p className="shop-card-category">{p.category}</p>
                      <p className="shop-card-brand">{p.brand}</p>
                      <h3 className="shop-card-name">{p.name}</h3>
                      <div className="shop-card-footer">
                        <span className="shop-card-price">₱{p.price}</span>
                        <button className="shop-card-add">Add to bag</button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}