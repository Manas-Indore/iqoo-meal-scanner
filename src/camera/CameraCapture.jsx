import { useRef, useState } from "react";
import { predictFood } from "../ai/predictFood";
import { addScan } from "../storage/db";

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [mealType, setMealType] = useState("breakfast");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera: " + err.message);
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);

    setPrediction("Scanning...");
    try {
      const result = await predictFood(canvas);
      setPrediction(result);
      console.log("Prediction:", result);

      await addScan(result, mealType);
      console.log("Scan saved to database");
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Error scanning food");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Meal Scanner Camera</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "400px", background: "#000", borderRadius: "12px" }}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", margin: "0.75rem 0" }}>
        {["breakfast", "lunch", "dinner"].map((type) => (
          <button
            key={type}
            onClick={() => setMealType(type)}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "20px",
              border: mealType === type ? "2px solid #9b59b6" : "1px solid #ccc",
              background: mealType === type ? "#9b59b6" : "#fff",
              color: mealType === type ? "#fff" : "#333",
              fontSize: "0.8rem",
              textTransform: "capitalize",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{ margin: "1rem 0", display: "flex", justifyContent: "center", gap: "0.75rem" }}>
        <button
          onClick={startCamera}
          style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "1px solid #ccc", background: "#fff", color: "#333" }}
        >
          Start Camera
        </button>
        <button
          onClick={capturePhoto}
          style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", background: "#9b59b6", color: "#fff", fontWeight: "bold" }}
        >
          Capture
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {capturedImage && (
        <div>
          <h3>Captured Photo:</h3>
          <img
            src={capturedImage}
            alt="captured"
            style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
          />
        </div>
      )}

      {prediction && typeof prediction === "object" && (
        <div style={{ marginTop: "1rem", textAlign: "left", display: "inline-block", background: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0, textTransform: "capitalize" }}>{prediction.label.replace(/_/g, " ")}</h3>
          <p style={{ color: "#888", fontSize: "0.85rem" }}>Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
          <p style={{ fontSize: "0.9rem" }}>
            Protein: {prediction.nutrition.protein_g}g | Carbs: {prediction.nutrition.carbs_g}g | Sugar: {prediction.nutrition.sugar_g}g | Calories: {prediction.nutrition.calories}
          </p>
        </div>
      )}
      {prediction && typeof prediction === "string" && <p>{prediction}</p>}
    </div>
  );
}

export default CameraCapture;