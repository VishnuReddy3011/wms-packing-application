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
  const [failureMessage, setFailureMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [channelOrderId, setChannelOrderId] = useState("");
  const [parentOrderCode, setParentOrderCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePack = async () => {
    if (!client || !subOrderId) {
      setFailureMessage("Please select client and enter Sub Order ID");
      return;
    }

    setLoading(true);
    setFailureMessage("");
    setSuccessMessage("");
    setChannelOrderId("");
    setParentOrderCode("");

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
        setFailureMessage(data.message || "Something went wrong");
        setChannelOrderId(data.channel_order_id || "");
        setParentOrderCode(data.parent_order_code || "");
      } else {
        setSuccessMessage(
          data.message ||
            `Order packed successfully. Channel Order ID: ${data.channelOrderId}`
        );
      }
    } catch (err) {
      setFailureMessage("Server not reachable");
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

      {failureMessage && (
        <div className="message failure">{failureMessage}</div>
      )}
      {channelOrderId && (
        <div className="order-info">
          <span className="order-label">Channel Order ID:</span>
          <span className="order-value">{channelOrderId}</span>
        </div>
      )}

      {parentOrderCode && (
        <div className="order-info">
          <span className="order-label">Parent Order Code:</span>
          <span className="order-value">{parentOrderCode}</span>
        </div>
      )}
      {successMessage && (
        <div className="message success">{successMessage}</div>
      )}
    </div>
  );
}

export default App;
