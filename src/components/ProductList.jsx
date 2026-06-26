import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductItem from "./ProductItem";

function ProductList() {

  const [productos, setProductos] = useState([]);

  async function cargarProductos() {

    const consulta = await getDocs(collection(db, "productos"));

    const lista = consulta.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProductos(lista);

  }

  useEffect(() => {

    cargarProductos();

  }, []);

  return (

    <div style={{marginTop:"50px"}}>

      <h2>📦 Productos</h2>

      {
        productos.map(producto => (

          <ProductItem
            key={producto.id}
            producto={producto}
            actualizar={cargarProductos}
          />

        ))
      }

    </div>

  );

}

export default ProductList;