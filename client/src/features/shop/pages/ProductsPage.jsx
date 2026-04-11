import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@core/api/client";
import ProductCard from "@features/shop/components/ProductCard";
import AgroLoader from "@core/components/AgroLoader";
import "@/styles/ProductsPage.css";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  const queryCategory = searchParams.get("category");
  const querySearch = searchParams.get("search");

  useEffect(() => {
    document.title = "Products – AgroMart";
    setLoading(true);
    
    const params = new URLSearchParams();
    if (queryCategory && queryCategory !== "All") params.append("category", queryCategory);
    if (querySearch) params.append("search", querySearch);
    
    api.get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [queryCategory, querySearch]);

  const sortedProducts = useMemo(() => {
    let list = [...products];
    if (sort === "price-asc") list.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0));
    if (sort === "price-desc") list.sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0));
    if (sort === "name") list.sort((a, b) => a.name?.localeCompare(b.name));
    return list;
  }, [products, sort]);



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
              {loading ? "Discovering the best for you..." : `${sortedProducts.length} products found`}
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
            ) : sortedProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different category or search term.</p>
              </div>
            ) : (
              <div className="grid-products">
                {sortedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
