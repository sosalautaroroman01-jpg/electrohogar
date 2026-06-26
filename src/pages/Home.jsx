import AnimatedBackground from "../components/AnimatedBackground";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";

function Home() {
  return (
    <>
      <AnimatedBackground />
<Cart />
      <div className="app">
        <Header />

        <SearchBar />

        <Categories />

        <h2>🔥 Productos destacados</h2>

        <ProductGrid />
      </div>
    </>
  );
}

export default Home;