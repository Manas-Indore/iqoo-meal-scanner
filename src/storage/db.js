import Dexie from "dexie";

export const db = new Dexie("MealScannerDB");

db.version(1).stores({
  scans: "++id, date, label, protein_g, carbs_g, sugar_g, calories",
});

export async function addScan(scan) {
  return await db.scans.add({
    date: new Date().toISOString(),
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