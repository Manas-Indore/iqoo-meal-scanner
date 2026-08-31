// src/voice/parseVoiceInput.js
//
// Day 10 — voice input parsing (stretch feature).
// Takes a transcribed sentence like "I ate 500 grams of rice" and
// extracts a food label + scaled nutrition, matching our existing
// {label, nutrition} contract so it plugs into addScan() the same way.

import { NUTRITION_DATA } from "../ai/nutritionData.js";

const CLASS_NAMES = [
  "burger",
  "butter_naan",
  "chai",
  "chapati",
  "chole_bhature",
  "dal_makhani",
  "dhokla",
  "fried_rice",
  "idli",
  "jalebi",
  "kaathi_rolls",
  "kadai_paneer",
  "kulfi",
  "masala_dosa",
  "momos",
  "paani_puri",
  "pakode",
  "pav_bhaji",
  "pizza",
  "samosa",
];

// Rough standard portion size in grams for each class — used as the
// baseline to scale nutrition when the user specifies a different amount.
// These are approximate, reasonable defaults, not lab-precise.
const STANDARD_PORTION_G = {
  burger: 150,
  butter_naan: 90,
  chai: 150, // ml, treated as "portion units" here
  chapati: 40,
  chole_bhature: 250,
  dal_makhani: 150,
  dhokla: 100,
  fried_rice: 200,
  idli: 40, // per piece
  jalebi: 50,
  kaathi_rolls: 150,
  kadai_paneer: 150,
  kulfi: 80,
  masala_dosa: 120,
  momos: 100, // ~5-6 pieces
  paani_puri: 60, // ~6 pieces
  pakode: 80,
  pav_bhaji: 250,
  pizza: 120, // per slice-ish
  samosa: 60, // per piece
};

// Some foods are commonly referred to differently than their class name.
// This lets "roti" match "chapati", "dosa" match "masala_dosa", etc.
const ALIASES = {
  roti: "chapati",
  naan: "butter_naan",
  dosa: "masala_dosa",
  rice: "fried_rice",
  tea: "chai",
  chhole: "chole_bhature",
  chole: "chole_bhature",
  panipuri: "paani_puri",
  golgappa: "paani_puri",
  pakoda: "pakode",
  pakora: "pakode",
};

/**
 * Finds a matching food class in the transcribed text using simple
 * keyword matching against class names and common aliases.
 */
function findFoodLabel(text) {
  const lowerText = text.toLowerCase();

  // Check aliases first (e.g. "roti" -> chapati)
  for (const [alias, className] of Object.entries(ALIASES)) {
    if (lowerText.includes(alias)) {
      return className;
    }
  }

  // Check direct class name matches (replace underscores with spaces
  // so "dal makhani" in speech matches "dal_makhani" class)
  for (const className of CLASS_NAMES) {
    const spokenForm = className.replace(/_/g, " ");
    if (lowerText.includes(spokenForm) || lowerText.includes(className)) {
      return className;
    }
  }

  return null;
}

/**
 * Extracts a quantity from the text. Looks for a number followed by
 * a weight unit (g, gm, gram, grams), or falls back to word-numbers
 * like "two" combined with a piece-based food ("two rotis").
 */
function findQuantity(text, label) {
  const lowerText = text.toLowerCase();

  // Pattern 1: "500 grams", "500g", "500 gm"
  const gramMatch = lowerText.match(/(\d+)\s*(grams?|gm|g)\b/);
  if (gramMatch) {
    return { grams: parseInt(gramMatch[1], 10), source: "explicit_grams" };
  }

  // Pattern 2: word numbers for piece-based foods ("two rotis", "three idlis")
  const wordNumbers = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  for (const [word, num] of Object.entries(wordNumbers)) {
    if (lowerText.includes(word)) {
      const portion = STANDARD_PORTION_G[label] || 100;
      return { grams: portion * num, source: "piece_count", count: num };
    }
  }

  // Pattern 3: plain digit + piece food ("2 rotis")
  const digitMatch = lowerText.match(/(\d+)\s*(piece|pieces)?/);
  if (digitMatch && STANDARD_PORTION_G[label]) {
    const count = parseInt(digitMatch[1], 10);
    if (count > 0 && count < 20) {
      // sanity check, avoid misreading "500" as count
      return {
        grams: STANDARD_PORTION_G[label] * count,
        source: "digit_count",
        count,
      };
    }
  }

  // No quantity found — assume one standard portion
  return { grams: STANDARD_PORTION_G[label] || 100, source: "default" };
}

/**
 * Main function — parses a transcribed voice string and returns
 * {label, confidence, nutrition} matching our existing contract.
 *
 * @param {string} transcribedText
 * @returns {{label: string, confidence: number, nutrition: object} | null}
 */
export function parseVoiceInput(transcribedText) {
  const label = findFoodLabel(transcribedText);

  if (!label) {
    console.warn("Could not identify a known food in:", transcribedText);
    return null;
  }

  const quantity = findQuantity(transcribedText, label);
  const standardPortion = STANDARD_PORTION_G[label] || 100;
  const scaleFactor = quantity.grams / standardPortion;

  const baseNutrition = NUTRITION_DATA[label];
  const scaledNutrition = {
    protein_g: Math.round(baseNutrition.protein_g * scaleFactor * 10) / 10,
    carbs_g: Math.round(baseNutrition.carbs_g * scaleFactor * 10) / 10,
    sugar_g: Math.round(baseNutrition.sugar_g * scaleFactor * 10) / 10,
    calories: Math.round(baseNutrition.calories * scaleFactor),
  };

  return {
    label,
    confidence: 1.0, // voice input is direct user statement, treat as certain
    nutrition: scaledNutrition,
    detectedQuantity: quantity, // extra info, useful for debugging/display
    source: "voice",
  };
}
