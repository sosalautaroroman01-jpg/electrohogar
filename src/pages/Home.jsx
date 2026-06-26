import AnimatedBackground from "../components/AnimatedBackground";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";

function Home() {
  return (
    <>
      <AnimatedBackground />

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