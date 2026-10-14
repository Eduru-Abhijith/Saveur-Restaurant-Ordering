import { createContext, useContext, useReducer, useCallback } from "react";

const CartContext = createContext();

const TAX_RATE = 0.08; // 8% tax
const SERVICE_CHARGE_RATE = 0.05; // 5% service charge

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "INCREASE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DECREASE_QTY":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_TABLE":
      return { ...state, tableNumber: action.tableNumber };
    case "SET_CUSTOMER":
      return { ...state, customerName: action.name };
    case "PLACE_ORDER":
      return {
        ...state,
        orderPlaced: true,
        orderTime: new Date().toLocaleTimeString(),
        orderId: action.orderId,
      };
    case "RESET_ORDER":
      return initialState;
    default:
      return state;
  }
}

const initialState = {
  items: [],
  tableNumber: "",
  customerName: "",
  orderPlaced: false,
  orderTime: null,
  orderId: null,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + tax + serviceCharge;
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  const addItem = useCallback((item) => dispatch({ type: "ADD_ITEM", item }), []);
  const removeItem = useCallback((id) => dispatch({ type: "REMOVE_ITEM", id }), []);
  const increaseQty = useCallback((id) => dispatch({ type: "INCREASE_QTY", id }), []);
  const decreaseQty = useCallback((id) => dispatch({ type: "DECREASE_QTY", id }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const setTable = useCallback(
    (tableNumber) => dispatch({ type: "SET_TABLE", tableNumber }),
    []
  );
  const setCustomer = useCallback(
    (name) => dispatch({ type: "SET_CUSTOMER", name }),
    []
  );
  const placeOrder = useCallback(() => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    dispatch({ type: "PLACE_ORDER", orderId });
  }, []);
  const resetOrder = useCallback(() => dispatch({ type: "RESET_ORDER" }), []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        subtotal,
        tax,
        serviceCharge,
        total,
        itemCount,
        TAX_RATE,
        SERVICE_CHARGE_RATE,
        addItem,
        removeItem,
        increaseQty,
        decreaseQty,
        clearCart,
        setTable,
        setCustomer,
        placeOrder,
        resetOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
