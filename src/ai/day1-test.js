// src/ai/day1-test.js
//
// Day 1 scratchpad — proving the TF.js + MobileNet pipeline works
// end to end before we build the real predictFood() function later.

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export async function runDay1Test() {
  // 1. Log which backend TF.js picked (WebGL, WebGPU, or CPU fallback).
  //    This tells us what our device/browser actually supports.
  console.log('TF.js backend in use:', tf.getBackend());

  // 2. Load the pretrained MobileNet model.
  //    First time this runs, it downloads the model files (few MB)
  //    from a CDN. After that, the browser caches them.
  console.log('Loading MobileNet model...');
  const model = await mobilenet.load();
  console.log('Model loaded.');

  // 3. Grab our test image from the page.
  //    We expect an <img> element with id="testImage" to already
  //    exist on the page, pointing at /test-photo.jpg
  const imgElement = document.getElementById('testImage');

  if (!imgElement) {
    console.error('No <img id="testImage"> found on the page.');
    return;
  }

  // 4. Run inference — ask the model "what is this image?"
  const predictions = await model.classify(imgElement);

  // 5. Log the results. This is an array of guesses ranked by confidence,
  //    e.g. [{ className: "bagel", probability: 0.62 }, ...]
  console.log('Predictions:', predictions);

  return predictions;
}