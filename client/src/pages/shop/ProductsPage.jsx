import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/axiosInstance";
import ProductCard from "../../components/product/ProductCard";
import AgroLoader from "../../components/common/AgroLoader";
import "../../styles/ProductsPage.css";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  const queryCategory = searchParams.get("category") || "All";
  const querySearch = searchParams.get("q") || "";

  useEffect(() => {
    document.title = "All Products – AgroMart";
    api.get("/products").then((res) => {
      setProducts(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (queryCategory !== "All") {
      list = list.filter((p) =>
        p.category?.toLowerCase().includes(queryCategory.toLowerCase()) ||
        p.name?.toLowerCase().includes(queryCategory.toLowerCase())
      );
    }

    // Filter by search
    if (querySearch) {
      const q = querySearch.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "price-asc") list.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0));
    if (sort === "price-desc") list.sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0));
    if (sort === "name") list.sort((a, b) => a.name?.localeCompare(b.name));

    return list;
  }, [products, queryCategory, querySearch, sort]);



  return (
    <div className="products-page">
      <div className="container">
        {/* PAGE HEADER */}
        <div className="products-page__header">
          <div>
            <h1 className="products-page__title">
              {querySearch
                ? `Results for "${querySearch}"`
                : queryCategory !== "All"
                ? queryCategory
                : "All Products"}
            </h1>
            <p className="products-page__count">
              {loading ? "Discovering the best for you..." : `${filtered.length} products found`}
            </p>
          </div>
          <div className="products-page__sort">
            <label htmlFor="sort-select" className="form-label">Sort by:</label>
            <select
              id="sort-select"
              className="form-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: "auto", padding: "8px 12px" }}
            >
              <option value="default">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className="products-page__layout">
          {/* PRODUCTS GRID */}
          <div className="products-page__main">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0', width: '100%' }}>
                <AgroLoader text="Fetching nature's best..." />
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different category or search term.</p>
              </div>
            ) : (
              <div className="grid-products">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
