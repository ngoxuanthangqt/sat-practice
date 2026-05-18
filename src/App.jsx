import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import StudentMode from './modes/StudentMode'
import TutorMode from './modes/TutorMode'
import { TUTOR_PASSWORD, SECTION_ORDER } from './config'

function groupBySection(questions) {
  const map = {}
  for (const q of questions) {
    let key = SECTION_ORDER.find(s => {
      const sBase = s.split(':')[0].trim().toLowerCase()
      return q.section.toLowerCase().includes(sBase.toLowerCase())
    })
    if (!key) key = q.section.split(':')[0].trim()
    if (!map[key]) map[key] = []
    map[key].push(q)
  }
  const ordered = {}
  for (const s of SECTION_ORDER) {
    const found = Object.keys(map).find(k => k === s || map[k]?.[0]?.section?.toLowerCase().includes(s.split(':')[0].toLowerCase()))
    if (found) ordered[s] = map[found]
  }
  for (const [k, v] of Object.entries(map)) {
    if (!Object.values(ordered).includes(v)) ordered[k] = v
  }
  return ordered
}

function Splash({ text, isError }) {
  return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      {!isError && <div style={{ width:32, height:32, border:'3px solid #e5e7eb', borderTop:'3px solid #1a56db', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />}
      <p style={{ color: isError ? '#c81e1e' : '#6b7280', fontSize:15 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ModeCard({ icon, title, desc, color, onClick }) {
  return (
    <button onClick={onClick} style={{ background:'var(--white)', border:'2px solid var(--border)', borderRadius:12, padding:'28px 32px', width:260, textAlign:'left', cursor:'pointer', transition:'all 0.15s', boxShadow:'var(--shadow)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)' }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='var(--shadow)' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>{icon}</div>
      <div style={{ fontWeight:700, fontSize:17, marginBottom:6 }}>{title}</div>
      <div style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.5 }}>{desc}</div>
    </button>
  )
}

function ModeSelect({ exam, navigate }) {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32, padding:24 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:13, fontWeight:600, letterSpacing:2, color:'var(--blue)', textTransform:'uppercase', marginBottom:12 }}>Digital SAT Practice</div>
        <h1 style={{ fontSize:32, fontWeight:700, marginBottom:8 }}>{exam.title}</h1>
        <p style={{ color:'var(--text-muted)', fontSize:15 }}>{exam.questions.length} questions · 4 sections</p>
      </div>
      <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center' }}>
        <ModeCard icon="🎓" title="Student Mode" desc="Timed sections, hidden answers. Just like the real test." color="var(--blue)" onClick={() => navigate('/student')} />
        <ModeCard icon="📋" title="Tutor Mode" desc="Full navigation, instant answers, explanations, and annotations." color="var(--green)" onClick={() => navigate('/tutor')} />
      </div>
    </div>
  )
}

function TutorGate({ sections, exam }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('tutor_auth') === 'yes')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const navigate = useNavigate()

  if (authed) return <TutorMode sections={sections} exam={exam} />

  const submit = () => {
    if (pw === TUTOR_PASSWORD) { sessionStorage.setItem('tutor_auth','yes'); setAuthed(true) }
    else { setErr(true); setPw('') }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
      <button onClick={() => navigate('/')} style={{ position:'absolute', top:20, left:20, background:'none', border:'none', color:'var(--text-muted)', fontSize:14, cursor:'pointer' }}>← Back</button>
      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:40, width:340, textAlign:'center', boxShadow:'var(--shadow-md)' }}>
        <div style={{ fontSize:28, marginBottom:12 }}>🔒</div>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>Tutor Mode</h2>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>Enter your password to continue</p>
        <input type="password" value={pw} onChange={e=>{ setPw(e.target.value); setErr(false) }} onKeyDown={e=>e.key==='Enter'&&submit()}
          placeholder="Password" autoFocus
          style={{ width:'100%', padding:'10px 14px', border:`1px solid ${err?'var(--red)':'var(--border)'}`, borderRadius:6, fontSize:15, marginBottom:8, outline:'none', fontFamily:'var(--sans)' }} />
        {err && <p style={{ color:'var(--red)', fontSize:13, marginBottom:8 }}>Incorrect password</p>}
        <button onClick={submit} style={{ width:'100%', padding:'10px 0', background:'var(--blue)', color:'white', border:'none', borderRadius:6, fontSize:15, fontWeight:600 }}>Enter</button>
      </div>
    </div>
  )
}

export default function App() {
  const [exam, setExam] = useState(null)
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/exam.json').then(r=>r.json()).then(data => {
      setExam(data)
      setSections(groupBySection(data.questions))
      setLoading(false)
    }).catch(() => { setError('Could not load exam.json'); setLoading(false) })
  }, [])

  if (loading) return <Splash text="Loading exam…" />
  if (error) return <Splash text={error} isError />

  return (
    <Routes>
      <Route path="/" element={<ModeSelect exam={exam} navigate={navigate} />} />
      <Route path="/student" element={<StudentMode exam={exam} sections={sections} />} />
      <Route path="/tutor" element={<TutorGate sections={sections} exam={exam} />} />
    </Routes>
  )
}
