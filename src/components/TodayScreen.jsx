import { useEffect, useState } from "react";
import { getAllScans } from "../storage/db";

function TodayScreen() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    const all = await getAllScans();
    const today = new Date().toISOString().split("T")[0];
    const todayScans = all.filter((s) => s.date.startsWith(today));
    setScans(todayScans.reverse());
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Today's Meals</h2>
      {scans.length === 0 && <p>No meals scanned yet today.</p>}
      {scans.map((scan) => (
        <div
          key={scan.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "0.5rem",
            textAlign: "left",
          }}
        >
          <strong>{scan.label}</strong>
          <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
            Protein: {scan.protein_g}g | Carbs: {scan.carbs_g}g | Sugar: {scan.sugar_g}g | Calories: {scan.calories}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TodayScreen;