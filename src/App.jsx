import { useState } from 'react'
import './App.css'
import CameraCapture from './camera/CameraCapture'
import TodayScreen from './components/TodayScreen'
import WeekScreen from './components/WeekScreen'
import SuggestionScreen from './components/SuggestionScreen'
import ManualEntry from './components/ManualEntry'

function App() {
  const [activeTab, setActiveTab] = useState('camera')

  const tabStyle = (tab) => ({
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #333' : '3px solid transparent',
    background: 'none',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    cursor: 'pointer',
  })

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
        Meal Scanner
      </h1>

      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button style={tabStyle('camera')} onClick={() => setActiveTab('camera')}>
          Camera
        </button>
        <button style={tabStyle('today')} onClick={() => setActiveTab('today')}>
          Today
        </button>
        <button style={tabStyle('week')} onClick={() => setActiveTab('week')}>
          Week
        </button>
        <button style={tabStyle('suggestion')} onClick={() => setActiveTab('suggestion')}>
          Suggestion
        </button>
        <button style={tabStyle('manual')} onClick={() => setActiveTab('manual')}>
          Add Manually
        </button>
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