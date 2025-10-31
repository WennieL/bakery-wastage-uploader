import { useState } from "react";

export default function WastageUploadForm() {
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
      setStatus("📤 Uploading...");
      const res = await fetch(
        "https://event-tracker-nt.zeabur.app/webhook-test/wastage/upload",
        {
          method: "POST",
          body: formData,
        }
      );

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-center mb-2">
          Bakery Wastage Upload
        </h1>

        <label className="flex flex-col">
          Store
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="border rounded p-2 mt-1"
            required
          >
            <option value="">Select Store</option>
            <option value="Carlton North">Carlton North</option>
            <option value="Essendon">Essendon</option>
            <option value="Moonee Ponds">Moonee Ponds</option>
          </select>
        </label>

        <label className="flex flex-col">
          Employee Name
          <input
            type="text"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="border rounded p-2 mt-1"
            placeholder="Enter your name"
            required
          />
        </label>

        <label className="flex flex-col">
          Comment
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded p-2 mt-1"
            placeholder="Any notes?"
          />
        </label>

        <label className="flex flex-col">
          Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="border rounded p-2 mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Upload
        </button>

        {status && <p className="text-center text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
