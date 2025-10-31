function WastageUploadForm() {
  const { useState, useEffect, useRef } = React;
  const [store, setStore] = useState("");
  const [employee, setEmployee] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const imageRef = useRef(null);
  const cropperRef = useRef(null);

  const stores = ["NT", "KT", "BC", "BB", "GP"];
  const employees = ["Ethan", "Bella", "Mia", "Leo", "Amy"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(file);
      setPreview(url);
    }
  };

  useEffect(() => {
    if (preview && imageRef.current) {
      if (cropperRef.current) cropperRef.current.destroy();
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "move",
        autoCropArea: 1,
      });
    }
  }, [preview]);

  const handleCrop = async () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCroppedCanvas({
      width: 1024,
      height: 1024,
    });

    // 壓縮
    const blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.7)
    );

    const newFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    setPhoto(newFile);
    setPreview(URL.createObjectURL(newFile));
    cropperRef.current.destroy();
    cropperRef.current = null;
  };

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
      const res = await fetch(
        "https://event-tracker-nt.zeabur.app/webhook/wastage/upload",
        {
          method: "POST",
          body: formData,
        }
      );

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
          maxWidth: "420px",
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

        {/* 裁剪預覽 */}
        {preview && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
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
              ✂️ Confirm Crop
            </button>
          </div>
        )}

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
