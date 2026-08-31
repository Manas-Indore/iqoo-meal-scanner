import { useEffect, useState } from "react";
import { getLast7DaysScans } from "../storage/db";
import { generateSuggestion } from "../suggestions/suggestionEngine";
import { colors } from "../theme";

const typeStyles = {
  protein_low: { bg: "#fdf0ec", accent: colors.protein, icon: "⚠️" },
  sugar_high: { bg: "#fef6e8", accent: colors.warning, icon: "⚠️" },
  balanced: { bg: "#eafaf1", accent: colors.accent, icon: "✅" },
  info: { bg: "#f0f4fa", accent: colors.carbs, icon: "ℹ️" },
};

function SuggestionScreen() {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    loadSuggestion();
  }, []);

  const loadSuggestion = async () => {
    const scans = await getLast7DaysScans();
    const result = generateSuggestion(scans);
    setSuggestion(result);
  };

  if (!suggestion) {
    return <div style={{ padding: "1rem" }}>Loading...</div>;
  }

  const style = typeStyles[suggestion.type] || typeStyles.info;

  return (
    <div style={{ padding: "1rem", maxWidth: "480px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.1rem" }}>This Week's Insight</h2>

      <div
        style={{
          background: style.bg,
          borderLeft: `5px solid ${style.accent}`,
          borderRadius: "14px",
          padding: "1.25rem",
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{style.icon}</div>
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.5" }}>{suggestion.message}</p>

        {suggestion.suggestedFood && (
          <a
            href={`https://www.swiggy.com/search?query=${suggestion.suggestedFood}`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                marginTop: "1rem",
                padding: "0.7rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                background: style.accent,
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              Order {suggestion.suggestedFood}
            </button>
          </a>
        )}
      </div>
    </div>
  );
}

export default SuggestionScreen;