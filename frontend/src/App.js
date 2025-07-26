import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const foodClasses = [
  "Donuts 🍩",
  "Omelette 🍳",
  "Pizza 🍕",
  "Ramen 🍜",
  "Steak 🥩",
  "Waffles 🧇",
  "Ice Cream 🍨",
];

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      setResult(res.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setResult({ error: "Prediction failed. Please try again." });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🍴 Food Image Classifier</h1>

      {/* Supported foods right after title */}
      <div className="classes-box">
        <h3>Supported Foods</h3>
        <div className="cards-container-simple">
          {foodClasses.map((food, i) => (
            <div key={i} className="food-card-simple">
              {food}
            </div>
          ))}
        </div>
      </div>

      <p className="upload-instruction">
        Upload a food image from the list above.
      </p>

      <div className="upload-box">
        <label htmlFor="file-upload" className="custom-file-upload">
          {preview ? (
            <img src={preview} alt="Preview" className="preview" />
          ) : (
            <div className="upload-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="upload-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              <span>Click or drag to upload</span>
            </div>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          hidden
        />
        <button onClick={handleUpload} disabled={!image || loading}>
          {loading ? "Analyzing..." : "Predict"}
        </button>
      </div>

      {/* Modal Popup for result */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            {result && result.class && (
              <div className="result-box" style={{ boxShadow: 'none', border: 'none', background: 'none', marginTop: 0 }}>
                <div style={{ fontSize: '22px', marginBottom: '8px' }}><b>🍽️ {result.class}</b></div>
                <div style={{ fontSize: '16px' }}>Confidence: {(result.confidence * 100).toFixed(2)}%</div>
              </div>
            )}
            {result?.error && <div className="error">{result.error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
