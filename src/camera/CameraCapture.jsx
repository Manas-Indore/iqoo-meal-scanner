import { useRef, useState } from "react";
import { predictFood } from "../ai/predictFood";
import { addScan } from "../storage/db";

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // rear camera
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

  // Run AI prediction on the captured frame
  setPrediction("Scanning...");
  try {
    const result = await predictFood(canvas);
    setPrediction(result);
    console.log("Prediction:", result);

    await addScan(result); // auto-save to IndexedDB
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
        style={{ width: "100%", maxWidth: "400px", background: "#000" }}
      />

      <div style={{ margin: "1rem 0" }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto} style={{ marginLeft: "1rem" }}>
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
            style={{ width: "100%", maxWidth: "400px" }}
          />
        </div>
      )}

      {prediction && typeof prediction === "object" && (
      <div style={{ marginTop: "1rem", textAlign: "left", display: "inline-block" }}>
        <h3>Detected: {prediction.label}</h3>
        <p>Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
        <p>Protein: {prediction.nutrition.protein_g}g | Carbs: {prediction.nutrition.carbs_g}g | Sugar: {prediction.nutrition.sugar_g}g | Calories: {prediction.nutrition.calories}</p>
      </div>
    )}
    {prediction && typeof prediction === "string" && <p>{prediction}</p>}
    </div>
  );
}

export default CameraCapture;