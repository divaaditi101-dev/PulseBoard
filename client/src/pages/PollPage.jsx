import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPollByToken, submitResponse } from "../services/pollService.js"
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import io from 'socket.io-client'

const PollPage = () => {
  const { token } = useParams()
  const { user } = useAuth()
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPoll()
  }, [token])

  const fetchPoll = async () => {
    try {
      const data = await getPollByToken(token)
      setPoll(data)
    } catch (error) {
      toast.error('Poll not found')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  const handleSubmit = async () => {
    const requiredQuestions = poll.questions.filter(q => q.isRequired)
    for (const q of requiredQuestions) {
      if (!answers[q._id]) {
        toast.error(`Please answer: "${q.text}"`)
        return
      }
    }
    const formattedAnswers = Object.entries(answers).map(([question, selectedOption]) => ({
      question, selectedOption
    }))
    setSubmitting(true)
    try {
      await submitResponse(token, formattedAnswers)
      setSubmitted(true)
      toast.success('Response submitted!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading poll...</p>
    </div>
  )

  if (!poll) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Poll not found.</p>
    </div>
  )

  // Published results view
  if (poll.isPublished) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            background: 'var(--green-light)', color: 'var(--green-dark)',
            fontSize: 12, fontWeight: 700, padding: '4px 14px',
            borderRadius: 6, letterSpacing: '0.06em'
          }}>RESULTS PUBLISHED</span>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--navy)', marginTop: 16 }}>
            {poll.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{poll.totalResponses} total responses</p>
        </div>
        {poll.questions.map((question, i) => (
          <div key={i} className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, marginBottom: 20, color: 'var(--navy)' }}>
              {question.text}
            </h3>
            {question.options.map((opt, j) => {
              const total = question.options.reduce((sum, o) => sum + o.count, 0)
              const pct = total > 0 ? Math.round((opt.count / total) * 100) : 0
              return (
                <div key={j} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-dark)' }}>{opt.text}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{pct}% ({opt.count})</span>
                  </div>
                  <div style={{ background: 'var(--border)', borderRadius: 6, height: 8 }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: 'var(--green)', borderRadius: 6,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  // Expired view
  if (!poll.isActive) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: 400, padding: 48 }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: 'var(--navy)', marginBottom: 12 }}>
          Poll Closed
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>This poll has expired and is no longer accepting responses.</p>
      </div>
    </div>
  )

  // Submitted view
  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: 400, padding: 48 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--green-light)', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28
        }}>✓</div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: 'var(--navy)', marginBottom: 12 }}>
          Response Submitted!
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for your feedback. Your response has been recorded.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 7,
              background: 'var(--navy)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--green)' }} />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--navy)' }}>PulseBoard</span>
          </div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--navy)', marginBottom: 8 }}>
            {poll.title}
          </h1>
          {poll.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7 }}>{poll.description}</p>
          )}
          {poll.isAnonymous && (
            <span style={{
              display: 'inline-block', marginTop: 12,
              background: 'var(--green-light)', color: 'var(--green-dark)',
              fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 6
            }}>Anonymous Poll</span>
          )}
        </div>

        {/* Questions */}
        {poll.questions.map((question, i) => (
          <div key={i} className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, color: 'var(--navy)', marginBottom: 4 }}>
              {question.text}
              {question.isRequired && <span style={{ color: '#e74c3c', marginLeft: 4 }}>*</span>}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20 }}>
              {question.isRequired ? 'Required' : 'Optional'} · Single choice
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.options.map((option, j) => {
                const selected = answers[question._id] === option._id
                return (
                  <button key={j} type="button"
                    onClick={() => handleSelect(question._id, option._id)}
                    style={{
                      padding: '14px 18px', borderRadius: 10,
                      border: selected ? '2px solid var(--green)' : '1.5px solid var(--border)',
                      background: selected ? 'var(--green-light)' : 'white',
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 12,
                      transition: 'all 0.15s ease'
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: selected ? '5px solid var(--green)' : '2px solid var(--border)',
                      flexShrink: 0, transition: 'all 0.15s ease'
                    }} />
                    <span style={{
                      fontSize: 15, color: selected ? 'var(--green-dark)' : 'var(--text-dark)',
                      fontWeight: selected ? 600 : 400
                    }}>{option.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <button className="btn-primary" onClick={handleSubmit}
          disabled={submitting}
          style={{ width: '100%', padding: '16px', fontSize: 16, marginTop: 8 }}>
          {submitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </div>
  )
}

export default PollPage