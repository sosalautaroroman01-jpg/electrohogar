import FloatingCart from "../components/FloatingCart";
import AnimatedBackground from "../components/AnimatedBackground";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";
import DollarTicker from "../components/DollarTicker";
import InfoBar from "../components/InfoBar";

function Home({ modoLocal = false }) {
  return (
    <>
      <AnimatedBackground />

      <Cart modoLocal={modoLocal} />
      <FloatingCart />

      <div className="app">
        <DollarTicker />

        <Header />

        <section className="hero">
          <div className="hero-search">
            <SearchBar />
          </div>

          {/* Barra informativa */}
          <InfoBar />

          <div className="hero-categories">
            <Categories />
          </div>
        </section>

        <ProductGrid />
      </div>
    </>
  );
}

export default Home;