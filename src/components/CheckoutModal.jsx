import { useState } from "react";
import { useCart } from "../context/CartContext";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "upi", label: "UPI / Digital Wallet", icon: "📱" },
  { id: "cash", label: "Cash at Counter", icon: "💵" },
];

export default function CheckoutModal({ onClose }) {
  const {
    items,
    subtotal,
    tax,
    serviceCharge,
    total,
    TAX_RATE,
    SERVICE_CHARGE_RATE,
    tableNumber,
    customerName,
    orderPlaced,
    orderTime,
    orderId,
    setTable,
    setCustomer,
    placeOrder,
    resetOrder,
  } = useCart();

  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=confirm
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [localTable, setLocalTable] = useState(tableNumber || "");
  const [localName, setLocalName] = useState(customerName || "");
  const [errors, setErrors] = useState({});

  function validateStep1() {
    const errs = {};
    if (!localTable.trim()) errs.table = "Table number is required";
    if (!localName.trim()) errs.name = "Customer name is required";
    return errs;
  }

  function handleNextStep1() {
    const errs = validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setTable(localTable);
    setCustomer(localName);
    setStep(2);
  }

  function handlePlaceOrder() {
    placeOrder();
    setStep(3);
  }

  function handleNewOrder() {
    resetOrder();
    onClose();
  }

  function handlePrintReceipt() {
    window.print();
  }

  if (orderPlaced && step === 3) {
    return (
      <div className="modal-overlay" onClick={handleNewOrder}>
        <div
          className="modal modal--success"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="success-animation">
            <div className="success-circle">
              <span className="success-check">✓</span>
            </div>
          </div>
          <h2 className="success-title">Order Confirmed!</h2>
          <p className="success-sub">
            Your food is being prepared with love 🍽️
          </p>

          <div className="order-summary-card">
            <div className="order-id-row">
              <span className="order-id-label">Order ID</span>
              <span className="order-id-value">{orderId}</span>
            </div>
            <div className="order-detail-row">
              <span>Customer</span>
              <span>{customerName}</span>
            </div>
            <div className="order-detail-row">
              <span>Table</span>
              <span>#{tableNumber}</span>
            </div>
            <div className="order-detail-row">
              <span>Time</span>
              <span>{orderTime}</span>
            </div>
            <div className="order-detail-row">
              <span>Payment</span>
              <span className="capitalize">
                {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
              </span>
            </div>
            <div className="order-detail-row order-detail-row--total">
              <span>Total Paid</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-items">
            <p className="receipt-label">Items Ordered</p>
            {items.map((item) => (
              <div key={item.id} className="receipt-item-row">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="receipt-total-row">
                <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="receipt-total-row">
                <span>Service ({(SERVICE_CHARGE_RATE * 100).toFixed(0)}%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="receipt-total-row receipt-total-row--grand">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="print-receipt-btn" onClick={handlePrintReceipt}>
            Print receipt
          </button>

          <button className="new-order-btn" onClick={handleNewOrder}>
            🍽️ Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Progress Steps */}
        <div className="modal-steps">
          {["Details", "Payment", "Review"].map((label, i) => (
            <div key={label} className="step-wrap">
              <div
                className={`step-dot ${step > i + 1 ? "step-dot--done" : step === i + 1 ? "step-dot--active" : ""}`}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className="step-label">{label}</span>
              {i < 2 && <div className={`step-line ${step > i + 1 ? "step-line--done" : ""}`} />}
            </div>
          ))}
        </div>

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="modal-content">
            <h2 className="modal-title">Order Details</h2>
            <p className="modal-sub">Let us know where to bring your food</p>

            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                className={`form-input ${errors.name ? "form-input--error" : ""}`}
                type="text"
                placeholder="Enter your name"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
              />
              {errors.name && (
                <span className="form-error">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Table Number</label>
              <div className="table-grid">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`table-btn ${localTable === String(n) ? "table-btn--selected" : ""}`}
                    onClick={() => setLocalTable(String(n))}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {errors.table && (
                <span className="form-error">{errors.table}</span>
              )}
            </div>

            <button className="modal-next-btn" onClick={handleNextStep1}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="modal-content">
            <h2 className="modal-title">Payment Method</h2>
            <p className="modal-sub">Choose a demo payment method. No payment will be processed.</p>

            <div className="payment-methods">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  className={`payment-btn ${paymentMethod === pm.id ? "payment-btn--selected" : ""}`}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  <span className="payment-icon">{pm.icon}</span>
                  <span className="payment-label">{pm.label}</span>
                  {paymentMethod === pm.id && (
                    <span className="payment-check">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mini-summary">
              <div className="mini-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mini-summary-row">
                <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="mini-summary-row">
                <span>Service ({(SERVICE_CHARGE_RATE * 100).toFixed(0)}%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="mini-summary-row mini-summary-row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-btn-row">
              <button className="modal-back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="modal-next-btn" onClick={() => setStep(3)}>
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="modal-content">
            <h2 className="modal-title">Review & Confirm</h2>
            <p className="modal-sub">One last look before we send it to the kitchen</p>

            <div className="review-info">
              <span>
                👤 <strong>{customerName || localName}</strong>
              </span>
              <span>
                🪑 Table <strong>{tableNumber || localTable}</strong>
              </span>
              <span>
                {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.icon}{" "}
                <strong>
                  {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                </strong>
              </span>
            </div>

            <div className="review-items">
              {items.map((item) => (
                <div key={item.id} className="review-item-row">
                  <div className="review-item-left">
                    <span
                      className={`veg-dot veg-dot--sm ${item.isVeg ? "veg-dot--green" : "veg-dot--red"}`}
                    />
                    <span className="review-item-name">{item.name}</span>
                    <span className="review-qty">× {item.qty}</span>
                  </div>
                  <span className="review-price">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="review-totals">
              <div className="review-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="review-total-row">
                <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="review-total-row">
                <span>Service ({(SERVICE_CHARGE_RATE * 100).toFixed(0)}%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="review-total-row review-total-row--grand">
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-btn-row">
              <button className="modal-back-btn" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className="place-order-btn" onClick={handlePlaceOrder}>
                🍽️ Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
