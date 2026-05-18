import { useState, useRef, useEffect } from 'react'

const TOOLS = [
  { id:'highlight', label:'Highlight', icon:'🖊', color:'rgba(253,224,71,0.5)' },
  { id:'arrow', label:'Arrow', icon:'➡', color:'#ef4444' },
  { id:'note', label:'Note', icon:'📌', color:'#3b82f6' },
  { id:'clear', label:'Clear', icon:'🗑', color:null },
]

export default function AnnotationToolbar({ questionId }) {
  const [tool, setTool] = useState(null)
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(`notes_${questionId}`) || '[]') } catch { return [] }
  })
  const [noteInput, setNoteInput] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)

  useEffect(() => {
    setNotes(() => {
      try { return JSON.parse(sessionStorage.getItem(`notes_${questionId}`) || '[]') } catch { return [] }
    })
    setShowNoteInput(false)
    setNoteInput('')
  }, [questionId])

  const saveNotes = (n) => {
    setNotes(n)
    sessionStorage.setItem(`notes_${questionId}`, JSON.stringify(n))
  }

  const handleTool = (t) => {
    if (t.id === 'clear') { saveNotes([]); setTool(null); setShowNoteInput(false); return }
    if (t.id === 'note') { setShowNoteInput(v=>!v); setTool(t.id); return }
    setTool(t.id === tool ? null : t.id)
  }

  const addNote = () => {
    if (!noteInput.trim()) return
    saveNotes([...notes, { text: noteInput.trim(), id: Date.now() }])
    setNoteInput('')
    setShowNoteInput(false)
  }

  return (
    <div style={{ borderTop:'1px solid var(--border)', paddingTop:12, marginTop:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: showNoteInput || notes.length ? 10 : 0 }}>
        <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>ANNOTATE</span>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => handleTool(t)} title={t.label}
            style={{ padding:'4px 10px', fontSize:13, borderRadius:4, border:`1px solid ${tool===t.id ? 'var(--blue)':'var(--border)'}`, background: tool===t.id ? 'var(--blue-light)':'var(--white)', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
            {t.icon} <span style={{ fontSize:11, color:'var(--text-muted)' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {showNoteInput && (
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <input value={noteInput} onChange={e=>setNoteInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNote()}
            placeholder="Type a sticky note…" autoFocus
            style={{ flex:1, padding:'6px 10px', border:'1px solid var(--border)', borderRadius:4, fontSize:13, outline:'none', fontFamily:'var(--sans)' }} />
          <button onClick={addNote} style={{ padding:'6px 12px', background:'var(--blue)', color:'white', border:'none', borderRadius:4, fontSize:13, cursor:'pointer' }}>Add</button>
        </div>
      )}

      {notes.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {notes.map(n => (
            <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:8, background:'#fefce8', border:'1px solid #fde047', borderRadius:4, padding:'6px 10px' }}>
              <span style={{ fontSize:12 }}>📌</span>
              <span style={{ fontSize:13, lineHeight:1.5, flex:1 }}>{n.text}</span>
              <button onClick={() => saveNotes(notes.filter(x=>x.id!==n.id))} style={{ background:'none', border:'none', fontSize:12, color:'var(--text-muted)', cursor:'pointer', padding:0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
