import { useState } from 'react'
import './App.css'

function App() {
  const [command, setCommand] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!command.trim()) return
    setLoading(true)
    setStatus('')

    try {
      const response = await fetch('http://localhost:3001/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })
      const data = await response.json()
      setStatus(`Status: ${data.status} — file: ${data.filename || ''}`)
    } catch {
      setStatus('Error: could not reach the server')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="container">
      <h1>AI Screen Recorder</h1>
      <p className="subtitle">Type a command to start recording</p>

      <div className="input-row">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. record my screen for 10 seconds"
          className="command-input"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="record-btn"
        >
          {loading ? 'Sending...' : 'Record'}
        </button>
      </div>

      {status && <p className="status">{status}</p>}
    </div>
  )
}

export default App