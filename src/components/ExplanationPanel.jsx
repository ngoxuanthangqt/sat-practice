import { useState } from 'react'

export default function ExplanationPanel({ question, alwaysOpen = false }) {
  const [open, setOpen] = useState(alwaysOpen)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')

  const expl = question?.explanation || ''
  const storageKey = `expl_${question?.id}`

  const getSaved = () => localStorage.getItem(storageKey) || expl

  const startEdit = () => { setText(getSaved()); setEditing(true) }
  const saveEdit = () => { localStorage.setItem(storageKey, text); setEditing(false) }

  const displayText = localStorage.getItem(storageKey) || expl

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{ width:'100%', padding:'10px 14px', background:'var(--blue-light)', border:'1px solid var(--blue)', borderRadius:6, color:'var(--blue)', fontSize:14, fontWeight:600, textAlign:'left', cursor:'pointer' }}>
        💡 Show explanation
      </button>
    )
  }

  return (
    <div style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:6, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid #fcd34d', background:'#fef3c7' }}>
        <span style={{ fontWeight:600, fontSize:14, color:'#92400e' }}>💡 Explanation</span>
        <div style={{ display:'flex', gap:8 }}>
          {alwaysOpen && !editing && <button onClick={startEdit} style={{ fontSize:12, color:'#92400e', background:'none', border:'1px solid #d97706', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Edit</button>}
          {editing && <button onClick={saveEdit} style={{ fontSize:12, color:'white', background:'#d97706', border:'none', borderRadius:4, padding:'2px 8px', cursor:'pointer' }}>Save</button>}
          {!alwaysOpen && <button onClick={() => setOpen(false)} style={{ fontSize:12, color:'#92400e', background:'none', border:'none', cursor:'pointer' }}>✕</button>}
        </div>
      </div>
      <div style={{ padding:'14px 16px' }}>
        {editing ? (
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={6}
            style={{ width:'100%', padding:'8px', border:'1px solid #fcd34d', borderRadius:4, fontSize:14, lineHeight:1.6, resize:'vertical', fontFamily:'var(--sans)', outline:'none' }} />
        ) : (
          <p style={{ fontSize:14, lineHeight:1.7, color:'#78350f' }}>
            {displayText || <em style={{ color:'#a16207' }}>No explanation yet. Click Edit to add one.</em>}
          </p>
        )}
      </div>
    </div>
  )
}
