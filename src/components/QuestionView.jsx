export default function QuestionView({ question }) {
  if (!question) return null
  const { stem } = question

  // Detect if there's a passage (long text) before the actual question prompt.
  // Question prompts typically start with "Which", "What", "How", "The", "According", etc.
  const questionStarters = /\n(Which |What |How |According |Based on |The (author|narrator|text|passage)|As used|Select|Choose|Complete|In (line|the text))/
  const match = stem.match(questionStarters)
  
  let passage = null
  let questionPart = stem

  if (match && match.index > 200) {
    passage = stem.slice(0, match.index).trim()
    questionPart = stem.slice(match.index).trim()
  }

  const renderText = (text) => {
    // Convert _____blank to an underline span
    const processed = text.replace(/_____blank/g, '<span style="display:inline-block;min-width:80px;border-bottom:2px solid #374151;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')
    return <div className="passage-text" dangerouslySetInnerHTML={{ __html: processed.replace(/\n/g,'<br/>') }} />
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {passage && (
        <div style={{ background:'#fafafa', border:'1px solid var(--border)', borderRadius:6, padding:'20px 24px' }}>
          {renderText(passage)}
        </div>
      )}
      <div>
        {renderText(questionPart)}
      </div>
    </div>
  )
}
