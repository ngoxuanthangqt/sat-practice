export default function NavigationBar({ questions, current, answers, flagged, onJump, tutorMode, sectionLabel }) {
  const groups = []
  for (let i = 0; i < questions.length; i += 10) {
    groups.push(questions.slice(i, i + 10))
  }

  return (
    <div style={{ padding:'16px', borderBottom:'1px solid var(--border)' }}>
      {sectionLabel && <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>{sectionLabel}</p>}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {questions.map((q, i) => {
          const isCurrent = q.id === (questions[current]?.id)
          const isAnswered = answers[q.id] !== undefined
          const isFlagged = flagged[q.id]
          const isCorrect = tutorMode && answers[q.id] === q.correct
          const isWrong = tutorMode && answers[q.id] && answers[q.id] !== q.correct

          let bg = '#f3f4f6', border = 'var(--border)', color = 'var(--text-muted)'
          if (isCurrent) { bg='var(--blue)'; border='var(--blue)'; color='white' }
          else if (isFlagged) { bg='var(--amber-light)'; border='var(--amber)'; color='var(--amber)' }
          else if (isCorrect) { bg='var(--green-light)'; border='var(--green)'; color='var(--green)' }
          else if (isWrong) { bg='var(--red-light)'; border='var(--red)'; color='var(--red)' }
          else if (isAnswered) { bg='var(--blue-light)'; border='var(--blue)'; color='var(--blue)' }

          return (
            <button key={q.id} onClick={() => onJump(i)}
              style={{ width:34, height:34, borderRadius:'50%', border:`2px solid ${border}`, background:bg, color, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.1s', position:'relative' }}>
              {i + 1}
              {isFlagged && !isCurrent && <span style={{ position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:'50%', background:'var(--amber)', border:'2px solid white' }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
