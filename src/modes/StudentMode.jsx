import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionView from '../components/QuestionView'
import AnswerPanel from '../components/AnswerPanel'
import ExplanationPanel from '../components/ExplanationPanel'
import NavigationBar from '../components/NavigationBar'
import Timer from '../components/Timer'
import { SECTION_TIMES } from '../config'

function getTime(sectionLabel) {
  if (sectionLabel.toLowerCase().includes('math')) return SECTION_TIMES['Math']
  return SECTION_TIMES['Reading and Writing']
}

function ScoreScreen({ questions, answers, sectionLabel, onNext, isLast }) {
  const mc = questions.filter(q => q.choices && Object.keys(q.choices).length > 0)
  const correct = mc.filter(q => answers[q.id] === q.correct).length
  const pct = mc.length ? Math.round((correct/mc.length)*100) : 0
  const [showing, setShowing] = useState(null)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 24px', gap:32 }}>
      <div style={{ background:'var(--white)', borderRadius:12, padding:'40px 48px', textAlign:'center', boxShadow:'var(--shadow-md)', maxWidth:480, width:'100%' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
        <h2 style={{ fontSize:24, fontWeight:700, marginBottom:6 }}>Section Complete</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:24, fontSize:14 }}>{sectionLabel}</p>
        <div style={{ fontSize:64, fontWeight:800, color: pct>=80?'var(--green)':pct>=60?'var(--amber)':'var(--red)', marginBottom:8 }}>{pct}%</div>
        <p style={{ color:'var(--text-muted)', fontSize:15 }}>{correct} / {mc.length} correct</p>
      </div>

      <div style={{ width:'100%', maxWidth:720 }}>
        <h3 style={{ fontWeight:700, marginBottom:16, fontSize:16 }}>Review answers</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {questions.map((q, i) => {
            const userAns = answers[q.id]
            const isRight = userAns === q.correct
            const hasMC = Object.keys(q.choices||{}).length > 0
            return (
              <div key={q.id} style={{ background:'var(--white)', border:`1px solid ${isRight?'var(--green)':'var(--red)'}`, borderRadius:8, overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background: isRight?'var(--green-light)':'var(--red-light)', cursor:'pointer' }}
                  onClick={()=>setShowing(showing===q.id?null:q.id)}>
                  <span style={{ fontSize:16 }}>{isRight?'✅':'❌'}</span>
                  <span style={{ fontWeight:600, fontSize:14 }}>Q{i+1}</span>
                  <span style={{ flex:1, fontSize:13, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.stem.slice(0,80)}…</span>
                  <span style={{ fontSize:13, fontWeight:600, color: isRight?'var(--green)':'var(--red)' }}>
                    {hasMC ? (userAns ? `You: ${userAns} · Correct: ${q.correct}` : `Unanswered · Correct: ${q.correct}`) : `Answer: ${q.correct}`}
                  </span>
                  <span style={{ color:'var(--text-muted)', fontSize:12 }}>{showing===q.id?'▲':'▼'}</span>
                </div>
                {showing === q.id && (
                  <div style={{ padding:'16px' }}>
                    <ExplanationPanel question={q} alwaysOpen={false} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={onNext} style={{ padding:'12px 32px', background:'var(--blue)', color:'white', border:'none', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer' }}>
        {isLast ? '🏁 Finish exam' : 'Next section →'}
      </button>
    </div>
  )
}

export default function StudentMode({ exam, sections }) {
  const navigate = useNavigate()
  const sectionKeys = Object.keys(sections)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [timerPaused, setTimerPaused] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [finished, setFinished] = useState(false)

  const currentSection = sectionKeys[sectionIdx]
  const questions = sections[currentSection] || []
  const question = questions[qIdx]
  const isLastSection = sectionIdx === sectionKeys.length - 1

  const handleExpire = useCallback(() => {
    setTimeUp(true)
    setSubmitted(true)
  }, [])

  const handleSubmitSection = () => {
    setSubmitted(true)
  }

  const handleNextSection = () => {
    if (isLastSection) { setFinished(true); return }
    setSectionIdx(s => s + 1)
    setQIdx(0)
    setSubmitted(false)
    setTimeUp(false)
  }

  if (finished) {
    const allQ = Object.values(sections).flat()
    const mc = allQ.filter(q => Object.keys(q.choices||{}).length > 0)
    const correct = mc.filter(q => answers[q.id] === q.correct).length
    const pct = mc.length ? Math.round((correct/mc.length)*100) : 0
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:32 }}>
        <div style={{ background:'var(--white)', borderRadius:16, padding:'48px 56px', textAlign:'center', boxShadow:'var(--shadow-md)' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🏆</div>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>Exam Complete!</h1>
          <div style={{ fontSize:72, fontWeight:900, color: pct>=80?'var(--green)':pct>=60?'var(--amber)':'var(--red)', margin:'16px 0' }}>{pct}%</div>
          <p style={{ color:'var(--text-muted)', fontSize:16 }}>{correct} / {mc.length} questions correct</p>
        </div>
        <button onClick={()=>navigate('/')} style={{ padding:'12px 32px', background:'var(--blue)', color:'white', border:'none', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer' }}>← Back to home</button>
      </div>
    )
  }

  if (submitted) {
    return <ScoreScreen questions={questions} answers={answers} sectionLabel={currentSection} onNext={handleNextSection} isLast={isLastSection} />
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined)
  const answered = questions.filter(q => answers[q.id] !== undefined).length

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ height:56, background:'var(--white)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', paddingLeft:20, paddingRight:20, gap:16, position:'sticky', top:0, zIndex:10, boxShadow:'var(--shadow)' }}>
        <button onClick={()=>navigate('/')} style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:13, cursor:'pointer' }}>← Home</button>
        <div style={{ width:1, height:24, background:'var(--border)' }} />
        <span style={{ fontWeight:700, fontSize:14, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentSection}</span>
        <Timer key={currentSection} seconds={getTime(currentSection)} onExpire={handleExpire} paused={timerPaused} />
        <button onClick={()=>setShowNav(v=>!v)} style={{ fontSize:12, color:'var(--text-muted)', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:4, padding:'4px 8px', cursor:'pointer' }}>
          {showNav?'Hide nav':'Nav'}
        </button>
        <div style={{ fontSize:13, color:'var(--text-muted)' }}>{answered}/{questions.length}</div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {showNav && (
          <div style={{ width:260, borderRight:'1px solid var(--border)', background:'var(--white)', overflowY:'auto', flexShrink:0 }}>
            <NavigationBar
              questions={questions} current={qIdx}
              answers={answers} flagged={flagged}
              onJump={i => setQIdx(i)}
              tutorMode={false}
            />
          </div>
        )}

        <div style={{ flex:1, overflowY:'auto', padding:'24px 0' }}>
          <div style={{ maxWidth:980, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:12 }}>
                Question {qIdx+1} of {questions.length}
              </div>
              <QuestionView question={question} />
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'var(--text-muted)' }}>Select one answer</span>
                <button onClick={() => setFlagged(f => ({ ...f, [question?.id]: !f[question?.id] }))}
                  style={{ fontSize:13, padding:'4px 10px', borderRadius:4, border:'1px solid var(--border)', background: flagged[question?.id]?'var(--amber-light)':'var(--white)', color: flagged[question?.id]?'var(--amber)':'var(--text-muted)', cursor:'pointer' }}>
                  {flagged[question?.id]?'🚩 Flagged':'⚑ Flag'}
                </button>
              </div>

              <AnswerPanel
                question={question}
                selected={answers[question?.id]}
                onSelect={v => setAnswers(a => ({ ...a, [question?.id]: v }))}
                submitted={false}
                tutorMode={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ height:64, background:'var(--white)', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', boxShadow:'0 -1px 4px rgba(0,0,0,0.06)' }}>
        <button onClick={()=>qIdx>0&&setQIdx(q=>q-1)} disabled={qIdx===0}
          style={{ padding:'8px 20px', border:'1px solid var(--border)', borderRadius:6, background:'var(--white)', fontSize:14, cursor: qIdx===0?'not-allowed':'pointer', color:'var(--text)', opacity: qIdx===0?0.4:1 }}>
          ← Previous
        </button>

        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {!allAnswered && <span style={{ fontSize:13, color:'var(--text-muted)' }}>{questions.length-answered} unanswered</span>}
          <button onClick={handleSubmitSection}
            style={{ padding:'9px 24px', border:'none', borderRadius:6, background: allAnswered?'var(--green)':'var(--blue)', color:'white', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            {allAnswered ? '✓ Submit section' : 'Submit section'}
          </button>
        </div>

        <button onClick={()=>qIdx<questions.length-1&&setQIdx(q=>q+1)} disabled={qIdx===questions.length-1}
          style={{ padding:'8px 20px', border:'none', borderRadius:6, background:'var(--blue)', color:'white', fontSize:14, fontWeight:600, cursor: qIdx===questions.length-1?'not-allowed':'pointer', opacity: qIdx===questions.length-1?0.4:1 }}>
          Next →
        </button>
      </div>
    </div>
  )
}
