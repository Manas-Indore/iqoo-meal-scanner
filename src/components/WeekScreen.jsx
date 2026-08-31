import { useEffect, useState } from "react";
import { getLast7DaysScans } from "../storage/db";
import { colors, cardStyle } from "../theme";

function WeekScreen() {
  const [dayTotals, setDayTotals] = useState({});

  useEffect(() => {
    loadWeek();
  }, []);

  const loadWeek = async () => {
    const scans = await getLast7DaysScans();
    const totals = {};
    scans.forEach((scan) => {
      const day = scan.date.split("T")[0];
      if (!totals[day]) totals[day] = { protein_g: 0, sugar_g: 0, calories: 0 };
      totals[day].protein_g += scan.protein_g;
      totals[day].sugar_g += scan.sugar_g;
      totals[day].calories += scan.calories;
    });
    setDayTotals(totals);
  };

  const days = Object.keys(dayTotals).sort().reverse();

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "480px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.1rem" }}>This Week</h2>

      {days.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", color: colors.textLight }}>
          No data yet this week. Start scanning your meals!
        </div>
      )}

      {days.map((day) => (
        <div key={day} style={{ ...cardStyle, textAlign: "left" }}>
          <strong>{formatDay(day)}</strong>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.85rem" }}>
            <span style={{ color: colors.protein }}>
              Protein: {Math.round(dayTotals[day].protein_g)}g
            </span>
            <span style={{ color: colors.sugar }}>
              Sugar: {Math.round(dayTotals[day].sugar_g)}g
            </span>
          </div>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: colors.textLight }}>
            {Math.round(dayTotals[day].calories)} kcal total
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeekScreen;