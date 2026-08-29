import { useEffect, useState } from "react";
import { getLast7DaysScans } from "../storage/db";

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

  return (
    <div style={{ padding: "1rem" }}>
      <h2>This Week</h2>
      {days.length === 0 && <p>No data yet this week.</p>}
      {days.map((day) => (
        <div
          key={day}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "0.5rem",
            textAlign: "left",
          }}
        >
          <strong>{day}</strong>
          <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
            Protein: {dayTotals[day].protein_g}g | Sugar: {dayTotals[day].sugar_g}g | Calories: {dayTotals[day].calories}
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeekScreen;