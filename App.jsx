function WastageUploadForm() {
  const { useState, useRef } = React;
  const [store, setStore] = useState("");
  const [employee, setEmployee] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [cropActive, setCropActive] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const stores = ["NT", "KT", "BC", "BB", "GP"];
  const employees = ["Ethan", "Bella", "Mia", "Leo", "Amy"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
      setCropActive(true);
    }
  };

  // ✂️ 壓縮圖片
  const compressImage = (image, mimeType = "image/jpeg", quality = 0.7, maxSize = 1024) => {
    const canvas = document.createElement("canvas");
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), mimeType, quality);
    });
  };

  // ✂️ 剪裁功能
  const handleCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;
    const size = Math.min(img.width, img.height);
    canvas.width = 1024;
    canvas.height = 1024;
    ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 1024, 1024);

    canvas.toBlob(async (blob) => {
      const compressed = await compressImage(img);
      const newFile = new File([compressed], "cropped.jpg", { type: "image/jpeg" });
      setPhoto(newFile);
      setPreview(URL.createObjectURL(newFile));
      setCropActive(false);
    }, "image/jpeg");
  };

  // 📤 上傳邏輯
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store || !employee || !photo) {
      alert("📋 Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("store", store);
    formData.append("employee", employee);
    formData.append("comment", comment || "");
    formData.append("photo", photo);

    try {
      setStatus("⏳ Uploading...");
      const res = await fetch("https://event-tracker-nt.zeabur.app/webhook/wastage/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("✅ Upload successful!");
        setStore("");
        setEmployee("");
        setComment("");
        setPhoto(null);
        setPreview(null);
      } else {
        setStatus("❌ Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Error uploading file.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>
          📸 Bakery Wastage Upload
        </h2>

        <label>Store</label>
        <select value={store} onChange={(e) => setStore(e.target.value)} required>
          <option value="">Select store</option>
          {stores.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label>Employee</label>
        <select value={employee} onChange={(e) => setEmployee(e.target.value)} required>
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <label>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g. End of day leftovers"
        />

        <label>Take Photo</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          required
        />

        {/* 預覽與剪裁區 */}
        {preview && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              style={{
                borderRadius: "8px",
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                border: "1px solid #ddd",
              }}
            />
            {cropActive && (
              <button
                type="button"
                onClick={handleCrop}
                style={{
                  marginTop: "10px",
                  background: "#16a34a",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✂️ Crop & Compress
              </button>
            )}
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "white",
            fontWeight: "600",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Upload
        </button>

        {status && <p style={{ textAlign: "center" }}>{status}</p>}
      </form>
    </div>
  );
}
