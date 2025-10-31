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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-4 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-center">
          📸 Bakery Wastage Upload
        </h2>

        {/* Store dropdown */}
        <div>
          <label className="block mb-1 font-medium">Store</label>
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
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
          <label className="block mb-1 font-medium">Employee</label>
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        {/* Comment box */}
        <div>
          <label className="block mb-1 font-medium">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. End of day leftovers"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Photo upload / camera input */}
        <div>
          <label className="block mb-1 font-medium">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Upload
        </button>

        <p className="text-center text-sm text-gray-600">{status}</p>
      </form>
    </div>
  );
}
