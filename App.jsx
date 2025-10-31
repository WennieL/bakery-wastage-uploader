function WastageUploadForm() {
  const { useState } = React;

  const [store, setStore] = useState("");
  const [employee, setEmployee] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");

  const stores = ["NT", "KT", "BC", "BB", "GP"];
  const employees = ["Ethan", "Bella", "Mia", "Leo", "Amy"];

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
        setStatus("✅ Upload successful! Data sent to system.");
        setStore("");
        setEmployee("");
        setComment("");
        setPhoto(null);
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

        {/* Store dropdown */}
        <div>
          <label style={{ fontWeight: "500" }}>Store</label>
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select store</option>
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Employee dropdown */}
        <div>
          <label style={{ fontWeight: "500" }}>Employee</label>
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div>
          <label style={{ fontWeight: "500" }}>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. End of day leftovers"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minHeight: "60px",
            }}
          />
        </div>

        {/* Photo upload / camera */}
        <div>
          <label style={{ fontWeight: "500" }}>Take a Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Photo Preview */}
        {photo && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#555" }}>Preview:</p>
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              style={{
                borderRadius: "8px",
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                border: "1px solid #ddd",
              }}
            />
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
            marginTop: "10px",
          }}
        >
          Upload
        </button>

        {status && (
          <p style={{ textAlign: "center", fontSize: "14px", color: "#333" }}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
