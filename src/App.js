import { useState } from "react";
import "./App.css";

const CLIENTS = [
  "mensa",
  "libas",
  "uspl",
  "modenik",
  "theindiangarageco",
  "aramya",
  "guess",
  "campussutra",
  "indoera",
  "instakart",
  "rocketcommerce",
];

function App() {
  const [client, setClient] = useState("");
  const [subOrderId, setSubOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePack = async () => {
    if (!client || !subOrderId) {
      setMessage("Please select client and enter Sub Order ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://node-backend-7dm0.onrender.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client,
          subOrderId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
      } else {
        setMessage(
          data.message ||
            `Order packed successfully. Channel Order ID: ${data.channelOrderId}`
        );
      }
    } catch (err) {
      setMessage("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>WMS Packing Application</h2>

      <label>Client</label>
      <select value={client} onChange={(e) => setClient(e.target.value)}>
        <option value="">Select Client</option>
        {CLIENTS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label>Sub Order ID</label>
      <input
        type="number"
        placeholder="Enter Sub Order ID"
        onKeyDown={() => false}
        onWheel={() => false}
        value={subOrderId}
        onChange={(e) => setSubOrderId(e.target.value)}
      />

      <button onClick={handlePack} disabled={loading}>
        {loading ? "Packing..." : "Pack"}
      </button>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
