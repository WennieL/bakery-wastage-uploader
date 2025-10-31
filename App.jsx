const { useState } = React;

function WastageUploadForm() {
  // 🏪 店名對應員工清單
  const storeEmployees = {
    NT: ["Amy", "John", "Lisa"],
    KT: ["Bella", "Charlie", "Ethan"],
    BC: ["Dylan", "Hannah", "Zoe"],
    BB: ["Jack", "Mia", "Oliver"],
    GP: ["Sophia", "Leo", "Emily"],
  };

  const [store, setStore] = useState("");
  const [employee, setEmployee] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");

  // 選擇分店時重設員工
  const handleStoreChange = (e) => {
    setStore(e.target.value);
    setEmployee("");
  };

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
      const res = await fetch("https://event-tracker-nt.zeabur.app/webhook/wastage/upload", {
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
        {/* 🏪 分店下拉 */}
        <label>Store:</label>
        <select value={store} onChange={handleStoreChange} required>
          <option value="">Select Store</option>
          {Object.keys(storeEmployees).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* 👩‍🍳 員工下拉 */}
        <label>Employee:</label>
        <select
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          required
          disabled={!store}
        >
          <option value="">Select Employee</option>
          {store &&
            storeEmployees[store].map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
        </select>

        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment"
        />

        <label>Upload Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />

        <button type="submit">Upload</button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

const App = () => <WastageUploadForm />;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
