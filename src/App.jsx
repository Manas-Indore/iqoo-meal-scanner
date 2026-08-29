import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { runDay1Test } from './ai/day1-test.js'
import CameraCapture from './camera/CameraCapture'
import { addScan, getAllScans } from "./storage/db";
import { runDay4Test } from './ai/day4-test.js'
import { generateSuggestion } from "./suggestions/suggestionEngine";
import { getLast7DaysScans } from "./storage/db";
import { predictFood } from './ai/predictFood.js';

function App() {
  const [count, setCount] = useState(0)
  const [result, setResult] = useState('')
  const [result4, setResult4] = useState('')
  const [finalResult, setFinalResult] = useState('')

  return (
    <>
      <section style={{ padding: '20px', border: '2px dashed orange' }}>
      <h2>Day 1 AI Test</h2>
      <img id="testImage" src="/test-photo.jpg" width="300" alt="test food" />
      <br />
      <button
        onClick={async () => {
        setResult('Running...')
        const predictions = await runDay1Test()
        setResult(JSON.stringify(predictions, null, 2))
      }}
      >
    Run MobileNet Test
  </button>
  <pre>{result}</pre>
</section>
      <section style={{ padding: '20px', border: '2px dashed lime' }}>
  <h2>Day 4 — Custom Model Test</h2>
  <button
    onClick={async () => {
      setResult4('Running...')
      const prediction = await runDay4Test()
      setResult4(JSON.stringify(prediction, null, 2))
    }}
  >
    Run Custom Model Test
  </button>
  <pre>{result4}</pre>
</section>
    <section style={{ padding: '20px', border: '2px dashed cyan' }}>
  <h2>Final predictFood() Test</h2>
  <button
    onClick={async () => {
      setFinalResult('Running...')
      const imgElement = document.getElementById('testImage')
      const result = await predictFood(imgElement)
      setFinalResult(JSON.stringify(result, null, 2))
    }}
  >
    Run predictFood()
  </button>
  <pre>{finalResult}</pre>
</section>
      <CameraCapture />
        <button
        onClick={async () => {
          await addScan({
            label: "dal_tadka",
            nutrition: { protein_g: 8, carbs_g: 20, sugar_g: 1, calories: 180 },
          });
          const all = await getAllScans();
          console.log("All scans:", all);
        }}
        >
        Test Add Scan
        </button>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

        <button
  onClick={async () => {
    const scans = await getLast7DaysScans();
    const suggestion = generateSuggestion(scans);
    console.log("Suggestion:", suggestion);
  }}
>
  Test Suggestion
</button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
