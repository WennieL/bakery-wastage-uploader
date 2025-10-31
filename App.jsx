const { useState } = React;

function WastageUploadForm() {
  const [store, setStore] = useState("");
  const [employee, setEmployee] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store || !employee || !photo) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("store", store);
    formData.append("employee", employee);
    formData.append("comment", comment || "");
    formData.append("photo", photo);

    try {
      setStatus("⏳ Uploading...");
      const res = await fetch("https://event-tracker-nt.zeabur.app/webhook-test/wastage/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("✅ Upload successful! Data sent to system.");
      } else {
        setStatus("❌ Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Error uploading file.");
    }
  };

  return (
    <div className="container">
      <h2>Bakery Wastage Upload</h2>
      <form onSubmit={handleSubmit}>
        <label>Store Name:</label>
        <input value={store} onChange={(e) => setStore(e.target.value)} placeholder="e.g., Carlton North" required />

        <label>Employee Name:</label>
        <input value={employee} onChange={(e) => setEmployee(e.target.value)} placeholder="e.g., Amy" required />

        <label>Comment:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional" />

        <label>Upload Photo:</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} required />

        <button type="submit">Upload</button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

const App = () => <WastageUploadForm />;

// ✅ 核心：告訴 React 把 App 掛載進 root！
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
