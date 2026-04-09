import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import useAuthStore from "@features/auth/store/auth.store";
import useCartStore from "@features/checkout/store/cart.store";
import useToastStore from "@core/hooks/useToast";
import "@/styles/productCard.css";

function calcDiscount(mrp, selling) {
  if (!mrp || !selling || mrp <= selling) return 0;
  return Math.round(((mrp - selling) / mrp) * 100);
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { customer, token } = useAuthStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const [adding, setAdding] = useState(false);

  const discount = calcDiscount(product.mrp, product.selling_price);
  const imgSrc = product.image || "https://images.unsplash.com/photo-1592982537447-6f2bf37a5f82?w=400&auto=format&fit=crop";

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      addToast("Please login to add items to cart", "info");
      navigate("/auth/login");
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, 1);
      addToast(`${product.name} added to cart!`, "success");
    } catch (err) {
      addToast(err.message || "Failed to add item", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="agri-card"
      onClick={() => navigate(`/products/${product.id}`)}
      role="button"
      tabIndex={0}
      id={`product-${product.id}`}
    >
      {/* DISCOUNT BADGE */}
      {discount > 0 && (
        <div className="agri-card__discount-badge">Save {discount}%</div>
      )}

      {/* IMAGE */}
      <div className="agri-card__img-wrap">
        <img src={imgSrc} alt={product.name} className="agri-card__img" loading="lazy" />
      </div>

      {/* INFO */}
      <div className="agri-card__body">
        {product.category && (
          <div className="agri-card__category">{product.category}</div>
        )}
        
        <h3 className="agri-card__name">{product.name}</h3>

        {product.unit && (
          <div className="agri-card__unit">Size/Weight: {product.unit}</div>
        )}

        <div className="agri-card__price-row">
          <span className="price-current">₹{product.selling_price?.toFixed(2)}</span>
          {product.mrp && product.mrp > product.selling_price && (
            <span className="price-mrp">₹{product.mrp?.toFixed(2)}</span>
          )}
        </div>

        <div className="agri-card__stock">
          {product.stock > 0 ? (
            <span className="stock-in">
              <CheckCircle size={14} className="icon-gradient-emerald" style={{ marginRight: 4 }} /> In Stock
            </span>
          ) : (
            <span className="stock-out">
              <XCircle size={14} style={{ marginRight: 4 }} /> Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="agri-card__actions">
        <button
          id={`add-cart-${product.id}`}
          className="btn-agri-primary"
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {adding ? (
            <span className="spinner-sm"></span>
          ) : (
            <>
              <ShoppingCart size={18} className="svg-colorful-icon" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}