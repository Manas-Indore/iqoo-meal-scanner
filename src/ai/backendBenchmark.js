// src/ai/backendBenchmark.js
//
// Day 5-6 — compare WebGL vs WebGPU inference speed on this device.

import * as tf from "@tensorflow/tfjs";
import { predictFood } from "./predictFood.js";
import "@tensorflow/tfjs-backend-webgpu";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function runNTimes(imgElement, n = 5) {
  const times = [];
  for (let i = 0; i < n; i++) {
    const start = performance.now();
    await predictFood(imgElement);
    const end = performance.now();
    times.push(end - start);
  }
  const warmRuns = times.slice(1);
  const avg = warmRuns.reduce((a, b) => a + b, 0) / warmRuns.length;
  return { times, avg };
}

export async function runBackendBenchmark() {
  const img = await loadImage("/test-photo.jpg");
  const results = {};

  console.log("Current default backend:", tf.getBackend());

  try {
    await tf.setBackend("webgl");
    await tf.ready();
    console.log("Testing WebGL...");
    const webglResult = await runNTimes(img, 5);
    results.webgl = webglResult;
    console.log(
      "WebGL average (excluding first run):",
      webglResult.avg.toFixed(1),
      "ms",
    );
    console.log(
      "WebGL all times:",
      webglResult.times.map((t) => t.toFixed(0) + "ms"),
    );
  } catch (err) {
    console.error("WebGL failed:", err);
    results.webgl = { error: err.message };
  }

  try {
    await tf.setBackend("webgpu");
    await tf.ready();
    console.log("Testing WebGPU...");
    const webgpuResult = await runNTimes(img, 5);
    results.webgpu = webgpuResult;
    console.log(
      "WebGPU average (excluding first run):",
      webgpuResult.avg.toFixed(1),
      "ms",
    );
    console.log(
      "WebGPU all times:",
      webgpuResult.times.map((t) => t.toFixed(0) + "ms"),
    );
  } catch (err) {
    console.error("WebGPU not available or failed:", err.message);
    results.webgpu = { error: err.message };
  }

  console.log("--- Benchmark summary ---");
  console.table({
    WebGL: results.webgl.avg ? results.webgl.avg.toFixed(1) + "ms" : "failed",
    WebGPU: results.webgpu.avg
      ? results.webgpu.avg.toFixed(1) + "ms"
      : "failed",
  });

  return results;
}
