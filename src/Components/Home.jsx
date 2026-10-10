import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import MetaData from "./Layout/MetaData";

const categories = [
  "New Arrivals",
  "Watches",
  "Bags",
  "Footwear",
  "Outerwear",
  "Accessories",
  "Sale",
];

// Change this if your backend runs on a different port
const API_BASE_URL = "http://localhost:4001/api/v1";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("New Arrivals");
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

  return (
    <div className="shop-page">
      <MetaData title="Buy Best Products Online" />

      {/* Hero */}
      <section className="shop-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <p className="shop-hero-kicker">Autumn collection</p>
              <h1 className="shop-hero-title">
                Built for the long day, kept for the long run.
              </h1>
              <p className="shop-hero-copy">
                Considered essentials in leather, wool, and steel — made to
                be worn in, not worn out.
              </p>
              <Button className="shop-cta">Shop the collection</Button>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <div className="shop-hero-panel">
                <i className="fa fa-diamond" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Category rail */}
      <section className="shop-category-rail">
        <Container className="d-flex flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                "shop-chip" + (cat === activeCategory ? " active" : "")
              }
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
            <h2>Featured pieces</h2>
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

          <Row>
            {!loading &&
              !error &&
              products.map((p) => (
                <Col key={p._id} sm={6} lg={4} className="mb-4">
                  <div className="shop-card">
                    <div className="shop-card-image">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i className="fa fa-shopping-bag" />
                      )}
                    </div>
                    <div className="shop-card-body">
                      <p className="shop-card-category">{p.category}</p>
                      <h3 className="shop-card-name">{p.name}</h3>
                      <div className="shop-card-footer">
                        <span className="shop-card-price">${p.price}</span>
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