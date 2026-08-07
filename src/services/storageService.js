import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase";

// =========================
// Subir un solo archivo
// =========================
export async function subirArchivo(file, carpeta = "productos") {
  if (!file) return "";

  console.log("📤 Subiendo archivo...");
  console.log("📁 Carpeta:", carpeta);
  console.log("📄 Nombre:", file.name);
  console.log("📦 Tamaño:", file.size);

  const nombre = `${Date.now()}-${Math.random()}-${file.name}`;

  const referencia = ref(storage, `${carpeta}/${nombre}`);

  console.log("📌 Referencia creada:", referencia.fullPath);

  await uploadBytes(referencia, file);

  console.log("✅ Upload terminado");

  const url = await getDownloadURL(referencia);

  console.log("🔗 URL obtenida:", url);

  return url;
}

// =========================
// Compatibilidad imágenes
// =========================
export async function subirImagen(file) {
  return subirArchivo(file, "productos");
}

// =========================
// Varias imágenes
// =========================
export async function subirImagenes(files) {
  if (!files?.length) return [];

  const urls = [];

  for (const file of files) {
    urls.push(await subirImagen(file));
  }

  return urls;
}

// =========================
// Un video
// =========================
export async function subirVideo(file) {
  console.log("🎥 Iniciando subida del video...");
  return subirArchivo(file, "videos");
}

// =========================
// Varios videos
// =========================
export async function subirVideos(files) {
  if (!files?.length) return [];

  const urls = [];

  for (const file of files) {
    urls.push(await subirVideo(file));
  }

  return urls;
}