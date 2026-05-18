const LETTERS = ['A','B','C','D']

export default function AnswerPanel({ question, selected, onSelect, submitted, tutorMode }) {
  if (!question) return null
  const { choices, correct } = question
  const choiceList = Object.entries(choices || {})
  if (choiceList.length === 0) {
    // Grid-in math
    return (
      <div style={{ padding:'16px 0' }}>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:8 }}>Free response — enter your answer:</p>
        {tutorMode && correct && (
          <div style={{ background:'var(--green-light)', border:'1px solid var(--green)', borderRadius:6, padding:'10px 14px', color:'var(--green)', fontWeight:600, fontSize:16 }}>
            Answer: {correct}
          </div>
        )}
        {!tutorMode && (
          <input type="text" placeholder="Your answer…" value={selected||''} onChange={e=>onSelect(e.target.value)}
            disabled={submitted}
            style={{ width:'100%', maxWidth:200, padding:'10px 14px', border:'2px solid var(--border)', borderRadius:6, fontSize:16, outline:'none', fontFamily:'var(--sans)' }} />
        )}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {choiceList.map(([letter, text]) => {
        const isSelected = selected === letter
        const isCorrect = letter === correct
        const isWrong = submitted && isSelected && !isCorrect

        let bg = 'var(--white)'
        let border = 'var(--border)'
        let textColor = 'var(--text)'
        let letterBg = '#f3f4f6'
        let letterColor = 'var(--text-muted)'

        if (tutorMode) {
          if (isCorrect) { bg='var(--green-light)'; border='var(--green)'; letterBg='var(--green)'; letterColor='white'; textColor='var(--green)' }
          else if (isSelected && !isCorrect) { bg='var(--red-light)'; border='var(--red)'; letterBg='var(--red)'; letterColor='white'; textColor='var(--red)' }
        } else {
          if (isSelected && !submitted) { bg='var(--blue-light)'; border='var(--blue)'; letterBg='var(--blue)'; letterColor='white'; textColor='var(--text)' }
          if (submitted && isCorrect) { bg='var(--green-light)'; border='var(--green)'; letterBg='var(--green)'; letterColor='white'; textColor='var(--green)' }
          if (isWrong) { bg='var(--red-light)'; border='var(--red)'; letterBg='var(--red)'; letterColor='white'; textColor='var(--red)' }
        }

        return (
          <button key={letter} onClick={() => !submitted && !tutorMode ? onSelect(letter) : tutorMode ? onSelect(letter) : null}
            style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 14px', background:bg, border:`2px solid ${border}`, borderRadius:6, textAlign:'left', cursor: submitted && !tutorMode ? 'default' : 'pointer', transition:'all 0.15s', width:'100%' }}>
            <span style={{ minWidth:28, height:28, borderRadius:'50%', background:letterBg, color:letterColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0, transition:'all 0.15s' }}>{letter}</span>
            <span style={{ fontSize:16, lineHeight:1.5, color:textColor, paddingTop:2 }}>{text}</span>
          </button>
        )
      })}
    </div>
  )
}
