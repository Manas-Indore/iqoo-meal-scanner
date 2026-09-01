import { useState } from "react";
import { addScan } from "../storage/db";
import { parseVoiceInput } from "../voice/parseVoiceInput";

function ManualEntry() {
  const [form, setForm] = useState({
    label: "", protein_g: "", carbs_g: "", sugar_g: "", calories: "",
  });
  const [mealType, setMealType] = useState("breakfast");
  const [saved, setSaved] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      console.log("Transcribed:", text);

      const parsed = parseVoiceInput(text);
      if (parsed) {
        console.log("Parsed:", parsed);
        setForm({
          label: parsed.label,
          protein_g: parsed.nutrition.protein_g,
          carbs_g: parsed.nutrition.carbs_g,
          sugar_g: parsed.nutrition.sugar_g,
          calories: parsed.nutrition.calories,
        });
      } else {
        alert(`Couldn't recognize a food in: "${text}". Please fill the form manually.`);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleSubmit = async () => {
    await addScan(
      {
        label: form.label,
        nutrition: {
          protein_g: Number(form.protein_g) || 0,
          carbs_g: Number(form.carbs_g) || 0,
          sugar_g: Number(form.sugar_g) || 0,
          calories: Number(form.calories) || 0,
        },
      },
      mealType
    );
    setSaved(true);
    setForm({ label: "", protein_g: "", carbs_g: "", sugar_g: "", calories: "" });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: "1rem", textAlign: "left", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add Food Manually</h2>

        <button
          onClick={startListening}
          disabled={listening}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "0.5rem",
            borderRadius: "8px",
            border: "none",
            background: listening ? "#e74c3c" : "#9b59b6",
            color: "#fff",
            fontWeight: "bold",
            animation: listening ? "pulse 1s infinite" : "none",
          }}
        >
          {listening ? "🔴 Listening... speak now" : "🎤 Speak your meal"}
        </button>

        {listening && (
          <p style={{ fontSize: "0.8rem", color: "#e74c3c", marginBottom: "1rem", textAlign: "center" }}>
            Recording... say something like "I ate 200 grams of rice"
          </p>
        )}

      {transcript && (
        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
          Heard: "{transcript}"
        </p>
      )}

      {transcript && form.label && (
        <div style={{ background: "#eafaf1", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem" }}>
          Detected: <strong style={{ textTransform: "capitalize" }}>{form.label.replace(/_/g, " ")}</strong> — review the values below and tap "Add Food" to confirm.
        </div>
      )}

      <input placeholder="Food name" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
      <input placeholder="Protein (g)" type="number" value={form.protein_g} onChange={(e) => setForm({ ...form, protein_g: e.target.value })} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
      <input placeholder="Carbs (g)" type="number" value={form.carbs_g} onChange={(e) => setForm({ ...form, carbs_g: e.target.value })} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
      <input placeholder="Sugar (g)" type="number" value={form.sugar_g} onChange={(e) => setForm({ ...form, sugar_g: e.target.value })} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
      <input placeholder="Calories" type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />

      <div style={{ margin: "0.5rem 0" }}>
        <button onClick={() => setMealType("breakfast")} style={{ fontWeight: mealType === "breakfast" ? "bold" : "normal" }}>Breakfast</button>
        <button onClick={() => setMealType("lunch")} style={{ fontWeight: mealType === "lunch" ? "bold" : "normal" }}>Lunch</button>
        <button onClick={() => setMealType("dinner")} style={{ fontWeight: mealType === "dinner" ? "bold" : "normal" }}>Dinner</button>
      </div>

      <button onClick={handleSubmit} style={{ width: "100%", padding: "0.75rem" }}>Add Food</button>
      {saved && <p style={{ color: "green" }}>Saved!</p>}
    </div>
  );
}

export default ManualEntry;