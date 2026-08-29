// src/ai/nutritionData.js
//
// Nutrition estimates per typical serving, for each of our 20 trained
// food classes. These are reasonable standard estimates based on
// common Indian nutrition references — good enough for demo purposes,
// not lab-precise measurements.

export const NUTRITION_DATA = {
  burger: { protein_g: 12, carbs_g: 35, sugar_g: 6, calories: 295 },
  butter_naan: { protein_g: 6, carbs_g: 40, sugar_g: 2, calories: 260 },
  chai: { protein_g: 2, carbs_g: 12, sugar_g: 10, calories: 90 },
  chapati: { protein_g: 3, carbs_g: 18, sugar_g: 0.5, calories: 104 },
  chole_bhature: { protein_g: 12, carbs_g: 55, sugar_g: 6, calories: 450 },
  dal_makhani: { protein_g: 8, carbs_g: 20, sugar_g: 2, calories: 180 },
  dhokla: { protein_g: 4, carbs_g: 18, sugar_g: 3, calories: 160 },
  fried_rice: { protein_g: 6, carbs_g: 45, sugar_g: 2, calories: 250 },
  idli: { protein_g: 2, carbs_g: 12, sugar_g: 0.3, calories: 39 },
  jalebi: { protein_g: 1, carbs_g: 30, sugar_g: 25, calories: 150 },
  kaathi_rolls: { protein_g: 14, carbs_g: 35, sugar_g: 3, calories: 320 },
  kadai_paneer: { protein_g: 14, carbs_g: 10, sugar_g: 4, calories: 280 },
  kulfi: { protein_g: 4, carbs_g: 20, sugar_g: 18, calories: 200 },
  masala_dosa: { protein_g: 4, carbs_g: 30, sugar_g: 2, calories: 168 },
  momos: { protein_g: 6, carbs_g: 25, sugar_g: 1, calories: 210 },
  paani_puri: { protein_g: 2, carbs_g: 20, sugar_g: 3, calories: 150 },
  pakode: { protein_g: 5, carbs_g: 18, sugar_g: 1, calories: 220 },
  pav_bhaji: { protein_g: 6, carbs_g: 40, sugar_g: 6, calories: 300 },
  pizza: { protein_g: 11, carbs_g: 33, sugar_g: 4, calories: 285 },
  samosa: { protein_g: 4, carbs_g: 24, sugar_g: 1, calories: 262 },
};
