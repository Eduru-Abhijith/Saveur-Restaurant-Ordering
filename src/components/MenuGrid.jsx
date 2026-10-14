import { useMemo, useState } from "react";
import { menuItems } from "../data/menuData";
import MenuCard from "./MenuCard";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "prep", label: "Fastest" },
];

export default function MenuGrid({ activeCategory, searchQuery }) {
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({ veg: false, spicy: false });

  const filtered = useMemo(() => {
    let list = menuItems;

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((i) => i.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Veg filter
    if (filters.veg) list = list.filter((i) => i.isVeg);

    // Spicy filter
    if (filters.spicy) list = list.filter((i) => i.isSpicy);

    // Sort
    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "prep":
        list = [...list].sort(
          (a, b) =>
            parseInt(a.prepTime) - parseInt(b.prepTime)
        );
        break;
      default:
        break;
    }

    return list;
  }, [activeCategory, searchQuery, sortBy, filters]);

  function toggleFilter(key) {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <main className="menu-main">
      <section className="menu-intro" aria-labelledby="menu-heading">
        <div>
          <div className="menu-eyebrow"><span className="service-indicator" /> Dinner service · Open until 10:30 pm</div>
          <h2 id="menu-heading">Good food, <em>your way.</em></h2>
          <p>Thoughtful plates, made to order. Pick a favorite and we’ll take it from here.</p>
        </div>
        <div className="menu-intro-note">
          <span className="intro-note-label">KITCHEN</span>
          <strong>~ 18 min</strong>
          <span>average prep time</span>
        </div>
      </section>

      {/* Toolbar */}
      <div className="menu-toolbar">
        <div className="toolbar-left">
          <span className="result-count">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
          <div className="filter-chips">
            <button
              className={`filter-chip ${filters.veg ? "filter-chip--active filter-chip--veg" : ""}`}
              onClick={() => toggleFilter("veg")}
            >
              🥗 Veg Only
            </button>
            <button
              className={`filter-chip ${filters.spicy ? "filter-chip--active filter-chip--spicy" : ""}`}
              onClick={() => toggleFilter("spicy")}
            >
              🌶️ Spicy
            </button>
          </div>
        </div>
        <div className="toolbar-right">
          <label className="sort-label">Sort:</label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <p className="no-results-title">No items found</p>
          <p className="no-results-sub">Try a different search or filter</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
