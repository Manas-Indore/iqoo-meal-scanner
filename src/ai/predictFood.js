// src/ai/predictFood.js
//
// The final AI function — this is what the app actually calls.
// Combines: loading our trained model, running inference on an image,
// and looking up nutrition info for the predicted food.

import * as tf from "@tensorflow/tfjs";
import { NUTRITION_DATA } from "./nutritionData.js";

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

// We only want to load the model ONCE, not every time predictFood() is called
// (loading takes a couple seconds — we don't want that delay on every scan).
// This variable "caches" the loaded model after the first call.
let cachedModel = null;

async function getModel() {
  if (!cachedModel) {
    await tf.ready(); // ensures a backend is fully initialized before use
    cachedModel = await tf.loadLayersModel("/model/model.json");
  }
  return cachedModel;
}

/**
 * Runs our trained food classification model on an image and returns
 * the predicted label, confidence, and estimated nutrition.
 *
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageElement
 * @returns {Promise<{label: string, confidence: number, nutrition: object}>}
 */
export async function predictFood(imageElement) {
  const model = await getModel();

  const prediction = tf.tidy(() => {
    const tensor = tf.browser
      .fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat();

    return model.predict(tensor);
  });

  const scores = await prediction.data();
  prediction.dispose();

  let maxIndex = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[maxIndex]) maxIndex = i;
  }

  const label = CLASS_NAMES[maxIndex];
  const confidence = scores[maxIndex];
  const nutrition = NUTRITION_DATA[label];

  return {
    label,
    confidence,
    nutrition,
  };
}
