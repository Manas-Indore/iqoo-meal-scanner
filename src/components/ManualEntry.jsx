import { useState } from "react";
import { addScan } from "../storage/db";

function ManualEntry() {
  const [form, setForm] = useState({
    label: "", protein_g: "", carbs_g: "", sugar_g: "", calories: "",
  });
  const [mealType, setMealType] = useState("breakfast");
  const [saved, setSaved] = useState(false);

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