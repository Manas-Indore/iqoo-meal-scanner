import { useEffect, useState } from "react";
import { getAllScans } from "../storage/db";
import { colors, cardStyle } from "../theme";

const DAILY_GOALS = { protein_g: 140, carbs_g: 250, calories: 2000 };

function ProgressBar({ label, value, goal, color }) {
  const pct = Math.min((value / goal) * 100, 100);
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: colors.textLight, marginBottom: "2px" }}>
        <span>{label}</span>
        <span>{Math.round(value)} / {goal}</span>
      </div>
      <div style={{ height: "8px", background: "#eee", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

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

  const totals = scans.reduce(
    (acc, s) => ({
      protein_g: acc.protein_g + s.protein_g,
      carbs_g: acc.carbs_g + s.carbs_g,
      calories: acc.calories + s.calories,
    }),
    { protein_g: 0, carbs_g: 0, calories: 0 }
  );

  const mealGroups = ["breakfast", "lunch", "dinner"];

  const renderMealSection = (mealType) => {
    const items = scans.filter((s) => s.mealType === mealType);
    return (
      <div key={mealType} style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ textTransform: "capitalize", fontSize: "1rem", marginBottom: "0.5rem" }}>{mealType}</h3>
        {items.length === 0 && (
          <div style={{ ...cardStyle, color: colors.textLight, fontSize: "0.85rem", textAlign: "center" }}>
            No items logged
          </div>
        )}
        {items.map((scan) => (
          <div key={scan.id} style={{ ...cardStyle, textAlign: "left" }}>
            <strong style={{ textTransform: "capitalize" }}>{scan.label.replace(/_/g, " ")}</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: colors.textLight }}>
              P: {scan.protein_g}g &nbsp;|&nbsp; C: {scan.carbs_g}g &nbsp;|&nbsp; S: {scan.sugar_g}g &nbsp;|&nbsp; {scan.calories} kcal
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Today's Summary</h2>
        <ProgressBar label="Protein (g)" value={totals.protein_g} goal={DAILY_GOALS.protein_g} color={colors.protein} />
        <ProgressBar label="Carbs (g)" value={totals.carbs_g} goal={DAILY_GOALS.carbs_g} color={colors.carbs} />
        <ProgressBar label="Calories" value={totals.calories} goal={DAILY_GOALS.calories} color={colors.calories} />
      </div>

      {mealGroups.map(renderMealSection)}
    </div>
  );
}

export default TodayScreen;