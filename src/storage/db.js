import Dexie from "dexie";

export const db = new Dexie("MealScannerDB");

// version 1 (old schema, kept for migration)
db.version(1).stores({
  scans: "++id, date, label, protein_g, carbs_g, sugar_g, calories",
});

// version 2 (new schema, with mealType)
db.version(2).stores({
  scans: "++id, date, mealType, label, protein_g, carbs_g, sugar_g, calories",
});

export async function addScan(scan, mealType = "breakfast") {
  return await db.scans.add({
    date: new Date().toISOString(),
    mealType,
    label: scan.label,
    protein_g: scan.nutrition.protein_g,
    carbs_g: scan.nutrition.carbs_g,
    sugar_g: scan.nutrition.sugar_g,
    calories: scan.nutrition.calories,
  });
}

export async function getLast7DaysScans() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return await db.scans
    .where("date")
    .above(sevenDaysAgo.toISOString())
    .toArray();
}

export async function getAllScans() {
  return await db.scans.toArray();
}