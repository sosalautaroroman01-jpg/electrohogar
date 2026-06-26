import ProductList from "../components/ProductList";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

function Admin() {
  const guardarProducto = async () => {
  try {

    let urlImagen = "";

    if (imagen) {

      const nombreArchivo = Date.now() + "_" + imagen.name;

      const referencia = ref(storage, "productos/" + nombreArchivo);

      await uploadBytes(referencia, imagen);

      urlImagen = await getDownloadURL(referencia);

    }

    await addDoc(collection(db, "productos"), {
      nombre,
      precio: Number(precio),
      descripcion,
      categoria,
      imagen: urlImagen,
      creado: new Date()
    });

    alert("Producto agregado correctamente");

    setNombre("");
    setPrecio("");
    setDescripcion("");
    setCategoria("");
    setImagen(null);

  } catch (error) {
    console.error(error);
    alert("Error al guardar");
  }
};
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);

  return (
    <div style={{maxWidth:"700px",margin:"40px auto"}}>
      <h1>📦 Panel Administrador</h1>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e)=>setNombre(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Precio"
        value={precio}
        onChange={(e)=>setPrecio(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e)=>setDescripcion(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Categoría"
        value={categoria}
        onChange={(e)=>setCategoria(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagen(e.target.files[0])}
      />
      <br /><br />

      <button onClick={guardarProducto}>
  Guardar Producto
</button>

<ProductList />
    </div>
  );
}

export default Admin;