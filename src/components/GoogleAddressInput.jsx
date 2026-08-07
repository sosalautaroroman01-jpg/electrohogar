import { useEffect, useRef } from "react";
import { cargarGoogleMaps } from "../services/mapsService";

export default function GoogleAddressInput({
  value = "",
  onPlaceSelect,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let autocomplete;

    async function iniciar() {
      await cargarGoogleMaps();

      const { PlaceAutocompleteElement } =
        await google.maps.importLibrary("places");

      autocomplete = new PlaceAutocompleteElement({
        componentRestrictions: {
          country: "ar",
        },
      });

      autocomplete.placeholder = "📍 Escribí la dirección...";

      if (value) {
        autocomplete.value = value;
      }

      autocomplete.addEventListener(
        "gmp-select",
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();

          await place.fetchFields({
            fields: [
              "formattedAddress",
              "location",
            ],
          });

          // 👇 Mantener visible la dirección elegida
          autocomplete.value = place.formattedAddress;

          onPlaceSelect({
            formatted_address: place.formattedAddress,
            geometry: {
              location: place.location,
            },
          });
        }
      );

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(autocomplete);
    }

    iniciar();
  }, [onPlaceSelect, value]);

  return <div ref={containerRef}></div>;
}