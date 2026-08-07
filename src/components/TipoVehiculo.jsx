export default function TipoVehiculo({
  vehiculo,
  setVehiculo,
}) {
  return (
    <div>
      <h3
        style={{
          marginBottom: "15px",
        }}
      >
        🚚 Elegí el vehículo
      </h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          onClick={() => setVehiculo("moto")}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "12px",
            border:
              vehiculo === "moto"
                ? "2px solid #16a34a"
                : "1px solid #ddd",
            background:
              vehiculo === "moto"
                ? "#dcfce7"
                : "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          🛵 Moto
          <br />
          $900 / km
        </button>

        <button
          onClick={() => setVehiculo("camioneta")}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "12px",
            border:
              vehiculo === "camioneta"
                ? "2px solid #16a34a"
                : "1px solid #ddd",
            background:
              vehiculo === "camioneta"
                ? "#dcfce7"
                : "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          🚐 Camioneta
          <br />
          $1500 / km
        </button>
      </div>
    </div>
  );
}