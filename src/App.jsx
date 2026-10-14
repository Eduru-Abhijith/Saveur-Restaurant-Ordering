/**
 * ╔══════════════════════════════════════════╗
 * ║   Saveur — Restaurant Ordering System    ║
 * ║   Original Author : E.Abhijith          ║
 * ║   Gaming Handle   : Daaku_Maharaaj      ║
 * ║   © 2026 All rights reserved            ║
 * ╚══════════════════════════════════════════╝
 */
import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import Footer from "./components/Footer";
import EasterEgg from "./components/EasterEgg";
import "./App.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <CartProvider>
      <div className="app">
        <Header
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="app-body">
          <MenuGrid
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
          <Cart onCheckout={() => setShowCheckout(true)} />
        </div>

        <Footer />

        {showCheckout && (
          <CheckoutModal onClose={() => setShowCheckout(false)} />
        )}

        {/* Easter egg — author: E.Abhijith | Daaku_Maharaaj */}
        <EasterEgg />
      </div>
    </CartProvider>
  );
}
