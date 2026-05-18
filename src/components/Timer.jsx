import { useState, useEffect, useRef } from 'react'

export default function Timer({ seconds, onExpire, paused = false }) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef(remaining)
  ref.current = remaining

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); onExpire?.(); return 0 }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [paused, onExpire])

  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  const urgent = remaining < 300
  const fmt = `${m}:${String(s).padStart(2,'0')}`

  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, fontVariantNumeric:'tabular-nums', fontWeight:600, fontSize:16, color: urgent ? 'var(--red)' : 'var(--text)', background: urgent ? 'var(--red-light)' : 'transparent', padding:'4px 10px', borderRadius:6, transition:'all 0.3s' }}>
      <span style={{ fontSize:14 }}>{urgent ? '⏰' : '⏱'}</span>
      {fmt}
    </div>
  )
}
