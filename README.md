# MealScanner

An on-device AI meal scanner for Indian home food. Scans your plate, identifies 
food using a fine-tuned TensorFlow.js model running fully offline on your 
phone's Snapdragon NPU/GPU, tracks weekly eating patterns, and proactively 
suggests what to eat next.

Built for iQOO Hackathon 2026.

🔗 Live demo: https://beamish-granita-706f91.netlify.app/

## Features
- Real-time camera-based food scanning (on-device AI, works offline)
- Meal categorization (breakfast/lunch/dinner)
- Weekly pattern tracking with progress visualization
- Rule-based proactive suggestions with deep-link ordering
- Voice input for hands-free logging
- Manual entry fallback
- Installable PWA, fully offline-capable for core features

## Tech Stack
- React + Vite (PWA)
- TensorFlow.js (on-device inference, fine-tuned MobileNet)
- IndexedDB (Dexie.js) for local storage
- Web Speech API for voice input
- Deployed on Netlify

## Team
- Manas — App architecture, camera, storage, UI, PWA
- Hazel — AI model training, TensorFlow.js integration, voice parsing

## Project Structure
- `src/camera/` — camera capture
- `src/ai/` — model inference (predictFood.js) + nutrition data
- `src/voice/` — voice input parsing
- `src/storage/` — IndexedDB layer
- `src/suggestions/` — rule-based suggestion engine
- `src/components/` — UI screens
- `model/` — training scripts, converted TF.js model files
