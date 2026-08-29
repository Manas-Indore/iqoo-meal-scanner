import { useEffect, useState } from "react";
import { getLast7DaysScans } from "../storage/db";
import { generateSuggestion } from "../suggestions/suggestionEngine";

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

  if (!suggestion) return <div style={{ padding: "1rem" }}>Loading...</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Suggestion</h2>
      <p>{suggestion.message}</p>
      {suggestion.suggestedFood && (
        <a
          href={`https://www.swiggy.com/search?query=${suggestion.suggestedFood}`}
          target="_blank"
          rel="noreferrer"
        >
          <button style={{ marginTop: "1rem" }}>
            Order {suggestion.suggestedFood}
          </button>
        </a>
      )}
    </div>
  );
}

export default SuggestionScreen;