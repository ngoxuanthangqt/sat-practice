import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionView from '../components/QuestionView'
import AnswerPanel from '../components/AnswerPanel'
import ExplanationPanel from '../components/ExplanationPanel'
import NavigationBar from '../components/NavigationBar'
import AnnotationToolbar from '../components/AnnotationToolbar'
import { SECTION_ORDER } from '../config'

export default function TutorMode({ sections, exam }) {
  const navigate = useNavigate()
  const sectionKeys = Object.keys(sections)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState({})
  const [flagged, setFlagged] = useState({})
  const [showNav, setShowNav] = useState(true)

  const currentSection = sectionKeys[sectionIdx]
  const questions = sections[currentSection] || []
  const question = questions[qIdx]

  const headerStyle = {
    height: 56, background: 'var(--white)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', paddingLeft: 20, paddingRight: 20,
    gap: 16, position: 'sticky', top: 0, zIndex: 10, boxShadow: 'var(--shadow)'
  }

  const tabStyle = (active) => ({
    padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'var(--blue-light)' : 'transparent',
    color: active ? 'var(--blue)' : 'var(--text-muted)',
    border: `1px solid ${active ? 'var(--blue)' : 'transparent'}`,
    cursor: 'pointer'
  })

  const shortLabel = (s) => s.replace('Section 1, Module 1:', 'S1M1').replace('Section 1, Module 2:', 'S1M2').replace('Section 2, Module 1:', 'S2M1').replace('Section 2, Module 2:', 'S2M2').replace('Reading and Writing','R&W').replace('Math','Math').trim()

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={headerStyle}>
        <button onClick={()=>navigate('/')} style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:13, cursor:'pointer', padding:'4px 8px' }}>← Home</button>
        <div style={{ width:1, height:24, background:'var(--border)' }} />
        <span style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>Tutor Mode</span>
        <div style={{ display:'flex', gap:4, overflowX:'auto', flex:1 }}>
          {sectionKeys.map((s,i) => (
            <button key={s} style={tabStyle(i===sectionIdx)} onClick={()=>{ setSectionIdx(i); setQIdx(0) }}>
              {shortLabel(s)} ({sections[s].length})
            </button>
          ))}
        </div>
        <button onClick={()=>setShowNav(v=>!v)} style={{ fontSize:12, color:'var(--text-muted)', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:4, padding:'4px 8px', cursor:'pointer' }}>
          {showNav ? 'Hide nav' : 'Show nav'}
        </button>
        <div style={{ fontWeight:700, fontSize:14, color:'var(--blue)', background:'var(--blue-light)', padding:'4px 10px', borderRadius:6 }}>
          Q {qIdx+1} / {questions.length}
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Sidebar nav */}
        {showNav && (
          <div style={{ width:280, borderRight:'1px solid var(--border)', background:'var(--white)', overflowY:'auto', flexShrink:0 }}>
            <NavigationBar
              questions={questions} current={qIdx}
              answers={selected} flagged={flagged}
              onJump={i => setQIdx(i)}
              tutorMode={true}
              sectionLabel={currentSection}
            />
          </div>
        )}

        {/* Main content */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px 0' }}>
          <div style={{ maxWidth:980, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>
            {/* Left: question */}
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:12 }}>
                Question {qIdx + 1} · {question?.section}
              </div>
              <QuestionView question={question} />
            </div>

            {/* Right: answers + explanation + annotations */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Flag button */}
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button onClick={() => setFlagged(f => ({ ...f, [question?.id]: !f[question?.id] }))}
                  style={{ fontSize:13, padding:'4px 12px', borderRadius:4, border:'1px solid var(--border)', background: flagged[question?.id] ? 'var(--amber-light)' : 'var(--white)', color: flagged[question?.id] ? 'var(--amber)' : 'var(--text-muted)', cursor:'pointer' }}>
                  {flagged[question?.id] ? '🚩 Flagged' : '⚑ Flag'}
                </button>
              </div>

              <AnswerPanel
                question={question}
                selected={selected[question?.id]}
                onSelect={v => setSelected(s => ({ ...s, [question?.id]: v }))}
                submitted={true}
                tutorMode={true}
              />

              <ExplanationPanel question={question} alwaysOpen={true} />
              <AnnotationToolbar questionId={question?.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ height:56, background:'var(--white)', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', boxShadow:'0 -1px 4px rgba(0,0,0,0.06)' }}>
        <button onClick={()=>{ if(qIdx>0) setQIdx(q=>q-1); else if(sectionIdx>0){ setSectionIdx(s=>s-1); setQIdx(sections[sectionKeys[sectionIdx-1]].length-1) } }}
          disabled={qIdx===0 && sectionIdx===0}
          style={{ padding:'8px 20px', border:'1px solid var(--border)', borderRadius:6, background:'var(--white)', fontSize:14, cursor:'pointer', color:'var(--text)', fontWeight:500 }}>
          ← Previous
        </button>
        <button onClick={()=>{ if(qIdx<questions.length-1) setQIdx(q=>q+1); else if(sectionIdx<sectionKeys.length-1){ setSectionIdx(s=>s+1); setQIdx(0) } }}
          disabled={qIdx===questions.length-1 && sectionIdx===sectionKeys.length-1}
          style={{ padding:'8px 20px', border:'none', borderRadius:6, background:'var(--blue)', color:'white', fontSize:14, cursor:'pointer', fontWeight:600 }}>
          Next →
        </button>
      </div>
    </div>
  )
}
