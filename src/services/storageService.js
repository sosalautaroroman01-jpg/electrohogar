import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export async function subirImagen(file) {
  if (!file) return "";

  const nombre = `${Date.now()}-${file.name}`;
  const referencia = ref(storage, `productos/${nombre}`);

  await uploadBytes(referencia, file);

  return await getDownloadURL(referencia);
}