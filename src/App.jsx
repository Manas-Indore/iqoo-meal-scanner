import { useState } from 'react'
import './App.css'
import CameraCapture from './camera/CameraCapture'
import TodayScreen from './components/TodayScreen'
import WeekScreen from './components/WeekScreen'
import SuggestionScreen from './components/SuggestionScreen'
import ManualEntry from './components/ManualEntry'
import { parseVoiceInput } from './voice/parseVoiceInput.js'

function App() {
  const [activeTab, setActiveTab] = useState('camera')

  const tabStyle = (tab) => ({
  flex: 1,
  padding: '0.85rem 0.25rem',
  border: 'none',
  borderBottom: activeTab === tab ? '3px solid #9b59b6' : '3px solid transparent',
  background: 'none',
  color: activeTab === tab ? '#9b59b6' : '#888',
  fontWeight: activeTab === tab ? 'bold' : 'normal',
  fontSize: '0.8rem',
  cursor: 'pointer',
})

  return (
  <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#f7f7fa' }}>
    <h1 style={{ textAlign: 'center', padding: '1.25rem 0 0.75rem', margin: 0, fontSize: '1.4rem' }}>
      🍽️ Meal Scanner
    </h1>

    <section style={{ padding: '20px', border: '2px dashed pink' }}>
      <h2>Day 10 — Voice Parse Test</h2>
      <button onClick={() => {
        console.log(parseVoiceInput("I ate a plate of dosa"));
        console.log(parseVoiceInput("had 2 idlis for breakfast"));
        console.log(parseVoiceInput("just some naan"));
        console.log(parseVoiceInput("ate pizza"));
        console.log(parseVoiceInput("I had biryani"));
      }}>
        Test Voice Parsing
      </button>
    </section>

    <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
      <button style={tabStyle('camera')} onClick={() => setActiveTab('camera')}>Camera</button>
      <button style={tabStyle('today')} onClick={() => setActiveTab('today')}>Today</button>
      <button style={tabStyle('week')} onClick={() => setActiveTab('week')}>Week</button>
      <button style={tabStyle('suggestion')} onClick={() => setActiveTab('suggestion')}>Insight</button>
      <button style={tabStyle('manual')} onClick={() => setActiveTab('manual')}>Add</button>
    </div>

    <div>
      {activeTab === 'camera' && <CameraCapture />}
      {activeTab === 'today' && <TodayScreen />}
      {activeTab === 'week' && <WeekScreen />}
      {activeTab === 'suggestion' && <SuggestionScreen />}
      {activeTab === 'manual' && <ManualEntry />}
    </div>
  </div>
)
}

export default App