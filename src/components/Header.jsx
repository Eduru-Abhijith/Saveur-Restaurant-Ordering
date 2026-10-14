import { useCart } from "../context/CartContext";
import { categories } from "../data/menuData";

export default function Header({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) {
  const { itemCount, total, tableNumber } = useCart();

  return (
    <header className="header">
      <div className="header-top">
        <div className="brand">
          <span className="brand-icon">🍴</span>
          <div className="brand-text">
            <h1 className="brand-name">Saveur</h1>
            <span className="brand-tagline">Fine Dining Experience</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="header-right">
          {tableNumber && (
            <div className="table-badge">
              <span className="table-icon">🪑</span>
              <span>Table {tableNumber}</span>
            </div>
          )}
          <div className="header-cart-summary">
            <span className="cart-icon-wrap">
              <span>🛒</span>
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </span>
            <div className="cart-info">
              <span className="cart-label">{itemCount} items</span>
              <span className="cart-total">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="category-nav">
        <div className="category-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? "cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
