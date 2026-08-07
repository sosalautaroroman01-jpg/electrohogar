
export default function ProductMedia({
  form,
  setForm,
  preview,
  setPreview,
}) {
  function handleImagen(e) {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setForm((prev) => ({
      ...prev,
      imagenesFile: [
        ...(prev.imagenesFile || []),
        ...files,
      ],
    }));

    setPreview((prev) => [
      ...prev,
      ...files.map((file) =>
        URL.createObjectURL(file)
      ),
    ]);

    e.target.value = "";
  }

  function handleVideo(e) {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      videoFile: file,
    }));

    e.target.value = "";
  }

  function eliminarImagen(index) {
    setPreview((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setForm((prev) => {
      const imagenes = [...(prev.imagenes || [])];
      const imagenesFile = [
        ...(prev.imagenesFile || []),
      ];

      if (index < imagenes.length) {
        imagenes.splice(index, 1);
      } else {
        imagenesFile.splice(
          index - imagenes.length,
          1
        );
      }

      return {
        ...prev,
        imagenes,
        imagenesFile,
      };
    });
  }

  return (
    <>
      <h2>📦 Datos del Producto</h2>

      <label>📷 Imágenes (hasta 5)</label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImagen}
      />

      <label style={{ marginTop: 15 }}>
        🎥 Video del producto
      </label>

      <input
        type="file"
        accept="video/*"
        onChange={handleVideo}
      />

      {preview.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {preview.map((img, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={img}
                alt=""
                className="preview-image"
              />

              <button
                type="button"
                onClick={() =>
                  eliminarImagen(index)
                }
                style={{
                  marginTop: "6px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑 Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {form.videoFile && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <video
            controls
            width="250"
            src={URL.createObjectURL(
              form.videoFile
            )}
            style={{
              borderRadius: "10px",
            }}
          />

          <br />

          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                videoFile: null,
              }))
            }
            style={{
              marginTop: "8px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🗑 Eliminar video
          </button>
        </div>
      )}

      {form.video && !form.videoFile && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <video
            controls
            width="250"
            src={form.video}
            style={{
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </>
  );
}