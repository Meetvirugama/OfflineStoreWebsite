import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Award,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import api from "../../services/axiosInstance";
import useAuthStore from "@features/auth/store/auth.store";
import useCartStore from "@features/checkout/store/cart.store";
import useToastStore from "@core/hooks/useToast";
import "@/styles/ProductDetailPage.css";

const CATEGORY_IMAGES = {
  urea: "/urea_fertilizer_1775135561678.png",
  dap: "/dap_fertilizer_1775135675120.png",
  compost: "/organic_compost_1775135579361.png",
  fertilizer: "/fertilizer_product_1775134268291.png",
  fertilizers: "/fertilizer_product_1775134268291.png",
  npk: "/fertilizer_product_1775134268291.png",
  herbicide: "/herbicide_spray_1775135598697.png",
  fungicide: "/fungicide_powder_1775135615038.png",
  insecticide: "/insecticide_bottle_1775135692300.png",
  pesticide: "/pesticide_product_1775134285892.png",
  pesticides: "/pesticide_product_1775134285892.png",
  seed: "/seeds_packet_1775135709334.png",
  seeds: "/seeds_packet_1775135709334.png",
  medicine: "/crop_medicine_liquid_1775135656180.png",
  medicines: "/crop_medicine_liquid_1775135656180.png",
  "bio medicine": "/crop_medicine_liquid_1775135656180.png",
  default: "/fertilizer_product_1775134268291.png",
};

function getProductImage(product) {
  const cat = (product?.category || "").toLowerCase();
  const name = (product?.name || "").toLowerCase();
  
  if (name.includes("urea")) return CATEGORY_IMAGES.urea;
  if (name.includes("dap")) return CATEGORY_IMAGES.dap;
  if (name.includes("compost")) return CATEGORY_IMAGES.compost;
  if (name.includes("herbicide") || name.includes("weed")) return CATEGORY_IMAGES.herbicide;
  if (name.includes("fungicide")) return CATEGORY_IMAGES.fungicide;
  if (name.includes("insecticide")) return CATEGORY_IMAGES.insecticide;
  if (cat.includes("seed") || name.includes("seed")) return CATEGORY_IMAGES.seeds;

  for (const key of Object.keys(CATEGORY_IMAGES)) {
    if (cat.includes(key) || name.includes(key)) return CATEGORY_IMAGES[key];
  }
  return CATEGORY_IMAGES.default;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  const { customer, token } = useAuthStore();
  const { addToCart } = useCartStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    setLoading(true);
    api.get("/products").then((res) => {
      const found = res.data?.find((p) => String(p.id) === String(id));
      setProduct(found || null);
      if (found) document.title = `${found.name} – AgroMart`;
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      addToast("Please login to add items to cart", "info");
      navigate("/auth/login");
      return;
    }
    if (!customer) return;
    setAdding(true);
    try {
      await addToCart(customer.id, product.id, qty);
      addToast(`${product.name} added to cart!`, "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!token || !customer) {
      addToast("Please login to proceed with Buy Now", "info");
      // Use state to remember where to return
      navigate("/auth/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    setBuying(true);
    try {
      // Add to cart silently (don't open drawer)
      await addToCart(customer.id, product.id, qty, true);
      navigate("/checkout");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setBuying(false);
    }
  };

  const discount = product?.mrp && product?.selling_price && product.mrp > product.selling_price
    ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
    : 0;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  if (!product) return (
    <div className="empty-state container fade-in" style={{ padding: "80px 20px" }}>
      <div className="empty-state-icon">
        <XCircle size={80} strokeWidth={1} style={{ opacity: 0.2 }} />
      </div>
      <h3>Product not found</h3>
      <p>This product might have been removed or doesn't exist.</p>
      <button className="btn btn-primary" onClick={() => navigate("/products")}>
        Back to Products
      </button>
    </div>
  );

  return (
    <div className="product-detail container fade-in">
      {/* BREADCRUMB */}
      <nav className="product-detail__breadcrumb">
        <span onClick={() => navigate("/")} className="product-detail__bc-link">Home</span>
        <ChevronRight size={14} className="product-detail__bc-sep" />
        <span onClick={() => navigate("/products")} className="product-detail__bc-link">Products</span>
        <ChevronRight size={14} className="product-detail__bc-sep" />
        <span>{product.name}</span>
      </nav>

      <div className="product-detail__grid">
        {/* IMAGE */}
        <div className="product-detail__img-side">
          <div className="product-detail__img-wrap">
            {discount > 0 && (
              <div className="product-detail__discount-badge">Save {discount}%</div>
            )}
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="product-detail__img"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="product-detail__info">
          {product.brand && <p className="product-detail__brand">{product.brand}</p>}
          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__meta">
            {product.category && <span className="tag">{product.category}</span>}
            {product.unit && <span className="tag">per {product.unit}</span>}
          </div>

          {/* PRICING */}
          <div className="product-detail__pricing">
            <span className="product-detail__price">₹{product.selling_price?.toFixed(2)}</span>
            {product.mrp > product.selling_price && (
              <>
                <span className="product-detail__mrp">MRP ₹{product.mrp?.toFixed(2)}</span>
                <span className="price-discount">{discount}% off</span>
              </>
            )}
          </div>

          {/* STOCK */}
          <div className={`product-detail__stock ${product.stock > 0 ? "product-detail__stock--in" : "product-detail__stock--out"}`}>
            {product.stock > 0 ? (
              <>
                <CheckCircle size={18} /> <span>In Stock – {product.stock} units available</span>
              </>
            ) : (
              <>
                <XCircle size={18} /> <span>Out of Stock</span>
              </>
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <div className="product-detail__details">
            <h3>Product Specifications</h3>
            <table className="product-detail__table">
              <tbody>
                {product.batch_number && (
                  <tr><td>Batch No.</td><td>{product.batch_number}</td></tr>
                )}
                {product.expiry_date && (
                  <tr><td>Expiry Date</td><td>{new Date(product.expiry_date).toLocaleDateString("en-IN")}</td></tr>
                )}
                {product.category && <tr><td>Category</td><td>{product.category}</td></tr>}
                {product.brand && <tr><td>Brand</td><td>{product.brand}</td></tr>}
                {product.unit && <tr><td>Unit</td><td>{product.unit}</td></tr>}
                {product.Supplier?.name && <tr><td>Supplier</td><td>{product.Supplier.name}</td></tr>}
              </tbody>
            </table>
          </div>

          {/* QTY + ADD TO CART */}
          <div className="product-detail__actions">
            <div className="product-detail__qty">
              <label className="form-label">Quantity</label>
              <div className="product-detail__qty-ctrl">
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                ><Minus size={16} /></button>
                <span className="product-detail__qty-val">{qty}</span>
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={qty >= (product.stock || 99)}
                ><Plus size={16} /></button>
              </div>
            </div>

            <div className="product-detail__btns">
              <button
                id="detail-add-cart-btn"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
                style={{ gap: '10px' }}
              >
                {adding ? "Adding..." : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>
              <button
                id="detail-buy-btn"
                className="btn btn-accent btn-lg"
                onClick={handleBuyNow}
                disabled={adding || buying || product.stock <= 0}
                style={{ gap: '10px' }}
              >
                {buying ? (
                  <>
                    <span className="spinner" style={{ width: 18, height: 18, borderTopColor: 'white' }} /> Processing...
                  </>
                ) : (
                  <>
                    <Zap size={20} /> Buy Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TRUST BADGES */}
          <div className="product-detail__trust">
            <div className="product-detail__trust-item"><Truck size={16} /> <span>Farm Delivery</span></div>
            <div className="product-detail__trust-item"><Award size={16} /> <span>Certified Organic</span></div>
            <div className="product-detail__trust-item"><ShieldCheck size={16} /> <span>Secure Payment</span></div>
            <div className="product-detail__trust-item"><RotateCcw size={16} /> <span>Easy Return</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
