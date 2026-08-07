import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
});

let mapsLib = null;

export async function cargarGoogleMaps() {
  if (mapsLib) return mapsLib;

  await importLibrary("maps");
  await importLibrary("places");

  mapsLib = window.google.maps;

  return mapsLib;
}

const ORIGEN = {
  lat: -34.746819,
  lng: -58.2792843,
};

export async function calcularRuta(destino) {
  const lat =
    typeof destino.lat === "function"
      ? destino.lat()
      : destino.lat;

  const lng =
    typeof destino.lng === "function"
      ? destino.lng()
      : destino.lng;

  const response = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        Authorization: import.meta.env.VITE_ORS_API_KEY,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json, application/geo+json",
      },
      body: JSON.stringify({
        coordinates: [
          [ORIGEN.lng, ORIGEN.lat],
          [lng, lat],
        ],
        language: "es",
        preference: "fastest",
        units: "m",
      }),
    }
  );

  if (!response.ok) {
    const texto = await response.text();
    throw new Error(texto);
  }

  const data = await response.json();

  const summary =
    data.features[0].properties.summary;

  const distanciaKm = summary.distance / 1000;

  return {
    distanciaKm,
    distanciaTexto:
      distanciaKm.toFixed(1) + " km",

    duracion:
      Math.round(summary.duration / 60) +
      " min",
  };
}