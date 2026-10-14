import { useCart } from "../context/CartContext";

export default function Cart({ onCheckout }) {
  const {
    items,
    subtotal,
    tax,
    serviceCharge,
    total,
    itemCount,
    TAX_RATE,
    SERVICE_CHARGE_RATE,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    tableNumber,
    customerName,
  } = useCart();

  if (items.length === 0) {
    return (
      <aside className="cart cart--empty">
        <div className="cart-header">
          <h2 className="cart-title">Your Order</h2>
        </div>
        <div className="cart-empty-state">
          <div className="empty-icon">🛒</div>
          <p className="empty-title">No items yet</p>
          <p className="empty-sub">Browse the menu and add delicious items!</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="cart">
      <div className="cart-header">
        <h2 className="cart-title">Your Order</h2>
        <div className="cart-header-meta">
          <span className="cart-item-count">{itemCount} items</span>
          <button className="clear-btn" onClick={clearCart} title="Clear order">
            Clear All
          </button>
        </div>
      </div>

      {(tableNumber || customerName) && (
        <div className="cart-info-bar">
          {tableNumber && (
            <span className="cart-info-chip">
              🪑 Table {tableNumber}
            </span>
          )}
          {customerName && (
            <span className="cart-info-chip">
              👤 {customerName}
            </span>
          )}
        </div>
      )}

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-top">
              <div className="cart-item-name-wrap">
                <span
                  className={`veg-dot veg-dot--sm ${item.isVeg ? "veg-dot--green" : "veg-dot--red"}`}
                />
                <span className="cart-item-name">{item.name}</span>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeItem(item.id)}
                title="Remove"
              >
                ✕
              </button>
            </div>
            <div className="cart-item-bottom">
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => decreaseQty(item.id)}
                >
                  −
                </button>
                <span className="qty-value">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => increaseQty(item.id)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-price">
                <span className="unit-price">${item.price.toFixed(2)} ea</span>
                <span className="line-price">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bill-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Service ({(SERVICE_CHARGE_RATE * 100).toFixed(0)}%)</span>
          <span>${serviceCharge.toFixed(2)}</span>
        </div>
        <div className="summary-row summary-row--total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="checkout-btn" onClick={onCheckout}>
        <span>Proceed to Checkout</span>
        <span className="checkout-arrow">→</span>
      </button>
    </aside>
  );
}
