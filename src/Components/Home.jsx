import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Rating from "@mui/material/Rating";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import MetaData from "./Layout/MetaData";
import Loader from "./Layout/Loader";
import { getProducts } from "../actions/productActions";

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

const GREEN = "#1a3329";
const GOLD = "#c9a227";

export default function Home() {
  const dispatch = useDispatch();
  let { keyword } = useParams();

  const { loading, products, error, filteredProductsCount } = useSelector(
    (state) => state.products
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [price, setPrice] = useState([1, 1000]); // applied filter (triggers a fetch)
  const [sliderValue, setSliderValue] = useState([1, 1000]); // what the slider shows while dragging
  const [currentPage, setCurrentPage] = useState(1);

  // every product loaded so far (infinite scroll keeps adding to this list)
  const [allProducts, setAllProducts] = useState([]);

  // invisible element at the bottom of the list; when it scrolls into view, load the next page
  const sentinelRef = useRef(null);
  const prevFilterKey = useRef(null);

  const hasMore =
    filteredProductsCount !== undefined && allProducts.length < filteredProductsCount;

  // fetch a page whenever the page or a filter changes
  useEffect(() => {
    const filterKey = `${keyword || ""}|${activeCategory}|${price[0]}-${price[1]}`;

    if (prevFilterKey.current !== null && prevFilterKey.current !== filterKey) {
      // a filter changed: start over from page 1 with an empty list
      prevFilterKey.current = filterKey;
      setAllProducts([]);
      if (currentPage !== 1) {
        setCurrentPage(1); // this effect runs again with page 1
        return;
      }
    }
    prevFilterKey.current = filterKey;

    dispatch(
      getProducts(
        currentPage,
        keyword,
        price,
        activeCategory === "All" ? "" : activeCategory
      )
    );
  }, [dispatch, currentPage, keyword, activeCategory, price]);

  // when a page arrives, replace the list (page 1) or add to it (page 2, 3, ...)
  useEffect(() => {
    if (loading || !products) return;
    if (currentPage === 1) {
      setAllProducts(products);
    } else {
      setAllProducts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        return [...prev, ...products.filter((p) => !ids.has(p._id))];
      });
    }
  }, [products, loading]);

  // infinite scroll: watch the bottom of the list
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !error && hasMore) {
          setCurrentPage((page) => page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, error, hasMore, allProducts.length]);

  const valuetext = (value) => `P${value.toString()}`;

  const renderCard = (p) => (
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

          {/* MUI Rating (read-only) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={p.ratings || 0} precision={0.5} readOnly size="small" />
            <Typography variant="caption">({p.numOfReviews || 0})</Typography>
          </Box>

          <div className="shop-card-footer">
            <span className="shop-card-price">₱{p.price}</span>
          </div>
          <div className="shop-card-actions">
            <Link to={`/product/${p._id}`} className="shop-card-btn outline">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </Col>
  );

  return (
    <div className="shop-page">
      <MetaData title="Cartify - Online Shopping " />

      {/* MUI Chips as the category filter */}
      <section className="shop-category-rail">
        <Container className="d-flex flex-wrap" style={{ gap: 8 }}>
          {["All", ...categories].map((cat) => {
            const active = cat === activeCategory;
            return (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => setActiveCategory(cat)}
                sx={{
                  height: 38,
                  fontSize: 15,
                  fontFamily: "inherit",
                  fontWeight: 500,
                  bgcolor: active ? GOLD : "#f7f5f0",
                  color: GREEN,
                  "& .MuiChip-label": { px: "16px" },
                  "&:hover": { bgcolor: active ? GOLD : "#ffffff" },
                }}
              />
            );
          })}
        </Container>
      </section>

      {/* full-page loader only for the very first load of a list */}
      {loading && allProducts.length === 0 ? (
        <Loader />
      ) : (
        <section className="shop-products">
          <Container>
            <div className="shop-section-heading">
              <h2>{keyword ? `Results for "${keyword}"` : "Featured products"}</h2>
            </div>

            {/* MUI Slider as the price filter, always visible */}
            <Box sx={{ maxWidth: 360, mb: 4 }}>
              <Typography gutterBottom>
                Price range: ₱{sliderValue[0]} – ₱{sliderValue[1]}
              </Typography>
              <Slider
                getAriaLabel={() => "Price Filter"}
                value={sliderValue}
                onChange={(event, newValue) => setSliderValue(newValue)}
                onChangeCommitted={(event, newValue) => setPrice(newValue)}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={1}
                max={1000}
                sx={{ color: GREEN }}
              />
            </Box>

            {/* MUI Alerts for errors and empty results */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Could not load products: {error}
              </Alert>
            )}

            {!error && !loading && filteredProductsCount === 0 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                No products found. Try a different category or price range.
              </Alert>
            )}

            <Row>{allProducts.map(renderCard)}</Row>

            {/* infinite scroll footer */}
            <div ref={sentinelRef} className="text-center my-4">
              {loading && allProducts.length > 0 && (
                <Loader size={28} fullScreen={false} />
              )}

              {!loading && !hasMore && allProducts.length > 0 && (
                <>
                  <Alert severity="success" sx={{ display: "inline-flex", mb: 2 }}>
                    You've reached the end.
                  </Alert>
                  <div>
                    <Fab
                      size="small"
                      aria-label="Back to top"
                      title="Back to top"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      sx={{
                        bgcolor: GREEN,
                        color: GOLD,
                        "&:hover": { bgcolor: "#12241c" },
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    </Fab>
                  </div>
                </>
              )}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}