// Simple rule-based suggestion engine
// Takes an array of scans (from getLast7DaysScans) and returns a suggestion

const DAILY_TARGETS = {
  protein_g: 50,
  sugar_g: 25, // max, not min
};

export function generateSuggestion(scans) {
  if (!scans || scans.length === 0) {
    return {
      message: "No meals logged yet. Scan your first plate to get started!",
      type: "info",
    };
  }

  // group scans by date (day)
  const days = {};
  scans.forEach((scan) => {
    const day = scan.date.split("T")[0];
    if (!days[day]) days[day] = { protein_g: 0, sugar_g: 0, calories: 0 };
    days[day].protein_g += scan.protein_g;
    days[day].sugar_g += scan.sugar_g;
    days[day].calories += scan.calories;
  });

  const dayEntries = Object.values(days);
  const numDays = dayEntries.length;

  const avgProtein =
    dayEntries.reduce((sum, d) => sum + d.protein_g, 0) / numDays;
  const avgSugar =
    dayEntries.reduce((sum, d) => sum + d.sugar_g, 0) / numDays;

  // count how many days were low protein
  const lowProteinDays = dayEntries.filter(
    (d) => d.protein_g < DAILY_TARGETS.protein_g
  ).length;

  const highSugarDays = dayEntries.filter(
    (d) => d.sugar_g > DAILY_TARGETS.sugar_g
  ).length;

  // rule priority: protein first, then sugar, then generic
  if (lowProteinDays >= Math.ceil(numDays / 2)) {
    return {
      message: `Your protein intake has been low on ${lowProteinDays} of the last ${numDays} days. Try adding paneer, dal, or eggs to tomorrow's meals.`,
      type: "protein_low",
      suggestedFood: "paneer",
    };
  }

  if (highSugarDays >= Math.ceil(numDays / 2)) {
    return {
      message: `Your sugar intake has been high on ${highSugarDays} of the last ${numDays} days. Consider cutting back tomorrow.`,
      type: "sugar_high",
      suggestedFood: null,
    };
  }

  return {
    message: "Your eating pattern looks balanced this week. Keep it up!",
    type: "balanced",
    suggestedFood: null,
  };
}