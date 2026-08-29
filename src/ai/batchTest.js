// src/ai/batchTest.js
//
// Day 5-6 — test predictFood() against multiple real photos at once,
// so we can see accuracy across a real spread of images, not just one.

import { predictFood } from "./predictFood.js";

// List your test image filenames here (must be inside public/test-photos/).
// Naming them with the expected class helps you spot-check correctness.
const TEST_IMAGES = [
  "appam_1.jpg",
  "appe_1.jpg",
  "chicken_1.jpg",
  "daal_makahni_1.jpg",
  "dosa_1.jpg",
  "fish_fry_1.jpg",
  "iceream_1.jpg",
  "idli_1.jpg",
  "paneer_curry_1.jpg",
  "pizza_1.jpg",
  "prawns_fry_1.jpg",
  "rasagulla_1.jpg",
  "rice_1.jpg",
  "roti_1.jpg",
  "uniyappam_1.jpg",
];
// Loads an image file as an actual <img> element TF.js can read
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function runBatchTest() {
  const results = [];

  for (const filename of TEST_IMAGES) {
    try {
      const img = await loadImage(`/test-photos/${filename}`);

      const startTime = performance.now();
      const prediction = await predictFood(img);
      const endTime = performance.now();

      const timeTaken = (endTime - startTime).toFixed(0);

      results.push({
        filename,
        predicted: prediction.label,
        confidence: (prediction.confidence * 100).toFixed(1) + "%",
        timeMs: timeTaken,
      });

      console.log(
        `${filename} -> ${prediction.label} (${(prediction.confidence * 100).toFixed(1)}%) in ${timeTaken}ms`,
      );
    } catch (err) {
      console.error(`Failed on ${filename}:`, err);
      results.push({ filename, error: err.message });
    }
  }

  console.log("--- Full batch results ---");
  console.table(results);

  return results;
}
