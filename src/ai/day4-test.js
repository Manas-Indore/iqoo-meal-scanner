// src/ai/day4-test.js
//
// Day 4 — loading OUR custom trained model (not generic MobileNet)
// and testing it on a real food photo.

import * as tf from "@tensorflow/tfjs";

// This must match the exact order of class_names we saw printed
// in Colab yesterday. Order matters — the model outputs 20 numbers,
// and position 0 = burger, position 1 = butter_naan, etc.
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

export async function runDay4Test() {
  console.log("Loading our custom trained model...");

  // Load OUR model this time, from the public/model folder.
  // Vite serves public/ files directly, so '/model/model.json' works.
  const model = await tf.loadLayersModel(
    "/model/tfjs_model/content/drive/MyDrive/iqoo-hackathon indian-food-dataset.zip/tfjs_model/model.json",
  );
  console.log("Custom model loaded.");

  const imgElement = document.getElementById("testImage");
  if (!imgElement) {
    console.error('No <img id="testImage"> found on the page.');
    return;
  }

  // Preprocess the image manually — this is the part the mobilenet
  // helper library used to do for us automatically:
  const prediction = tf.tidy(() => {
    // Convert the image into a tensor (grid of numbers)
    let tensor = tf.browser
      .fromPixels(imgElement)
      // Resize to 224x224, same size we trained on
      .resizeNearestNeighbor([224, 224])
      // Add a "batch" dimension — model expects a batch of images,
      // even if we're only sending one
      .expandDims(0)
      // Convert pixel values to decimal (0-255 -> float),
      // our model's first layer already does the /255 scaling internally,
      // so we just need the right data type here
      .toFloat();

    return model.predict(tensor);
  });

  // prediction is a tensor of 20 numbers (one confidence per class).
  // .data() pulls the actual numbers out so we can read them in JS.
  const scores = await prediction.data();
  prediction.dispose(); // free up memory, good practice with tensors

  // Find the highest-confidence class
  let maxIndex = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[maxIndex]) maxIndex = i;
  }

  const result = {
    label: CLASS_NAMES[maxIndex],
    confidence: scores[maxIndex],
  };

  console.log(
    "All scores:",
    Array.from(scores).map(
      (s, i) => `${CLASS_NAMES[i]}: ${(s * 100).toFixed(1)}%`,
    ),
  );
  console.log("Top prediction:", result);

  return result;
}
