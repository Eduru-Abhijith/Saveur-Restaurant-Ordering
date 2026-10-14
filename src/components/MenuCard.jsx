import { useState } from "react";
import { useCart } from "../context/CartContext";

const TAG_COLORS = {
  Popular: "#f59e0b",
  "Chef's Pick": "#8b5cf6",
  Veg: "#22c55e",
  Spicy: "#ef4444",
  Premium: "#f97316",
  Healthy: "#10b981",
  Classic: "#6366f1",
  Shareable: "#06b6d4",
  "Must Try": "#ec4899",
};

const CATEGORY_IMAGES = {
  starters: ["photo-1547592180-85f173990554", "photo-1512621776951-a57141f2eefd"],
  mains: ["photo-1546069901-ba9599a7e63c", "photo-1547592180-85f173990554", "photo-1512621776951-a57141f2eefd"],
  grills: ["photo-1555939594-58d7cb561ad1", "photo-1544025162-d76694265947"],
  pizza: ["photo-1565299624946-b28f40a0ae38", "photo-1579751626657-72bc17010498"],
  burgers: ["photo-1568901346375-23c9450c58cd", "photo-1550547660-d9450f859349"],
  pasta: ["photo-1473093295043-cdd812d0e601", "photo-1551183053-bf91a1d81141"],
  desserts: ["photo-1565958011703-44f9829ba187", "photo-1578985545062-69928b1d9587"],
  drinks: ["photo-1544145945-f90425340c7e", "photo-1513558161293-cdaf765edfd47"],
};

export default function MenuCard({ item }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const cartItem = items.find((i) => i.id === item.id);
  const categoryImages = CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.mains;
  const image = categoryImages[item.id % categoryImages.length];

  function handleAdd() {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  const stars = Array.from({ length: 5 }, (_, i) => {
    const fill = i + 1 <= Math.floor(item.rating) ? "full" : i < item.rating ? "half" : "empty";
    return fill;
  });

  return (
    <div className={`menu-card ${added ? "menu-card--added" : ""}`}>
      <div className="menu-card-emoji-wrap">
        <img
          className="menu-card-image"
          src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=82`}
          alt={item.name}
          loading="lazy"
        />
        <span className="menu-card-category">{item.category}</span>
        {item.isVeg && <span className="veg-dot veg-dot--green" title="Vegetarian" />}
        {!item.isVeg && <span className="veg-dot veg-dot--red" title="Non-vegetarian" />}
        {item.isSpicy && <span className="spicy-badge">🌶️</span>}
      </div>

      <div className="menu-card-body">
        <div className="menu-card-header">
          <h3 className="menu-card-name">{item.name}</h3>
          <span className="menu-card-price">${item.price.toFixed(2)}</span>
        </div>

        <p className="menu-card-desc">{item.description}</p>

        <div className="menu-card-tags">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="tag"
              style={{ "--tag-color": TAG_COLORS[tag] || "#64748b" }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="menu-card-meta">
          <div className="rating">
            {stars.map((fill, i) => (
              <span key={i} className={`star star--${fill}`}>
                ★
              </span>
            ))}
            <span className="rating-value">{item.rating}</span>
          </div>
          <span className="meta-divider">·</span>
          <span className="prep-time">⏱ {item.prepTime}</span>
          <span className="meta-divider">·</span>
          <span className="calories">🔥 {item.calories} cal</span>
        </div>

        <div className="menu-card-footer">
          {cartItem ? (
            <div className="in-cart-badge">
              <span>✓ {cartItem.qty} in cart</span>
            </div>
          ) : null}
          <button
            className={`add-btn ${added ? "add-btn--success" : ""}`}
            onClick={handleAdd}
          >
            {added ? "✓ Added!" : "+ Add to Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
