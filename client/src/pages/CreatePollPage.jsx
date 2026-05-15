import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPoll } from "../services/pollService.js";
import toast from 'react-hot-toast'

const CreatePollPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    isAnonymous: false,
    expiresAt: '',
    questions: [
      { text: '', isRequired: true, options: [{ text: '' }, { text: '' }] }
    ]
  })

  const updateQuestion = (qi, field, value) => {
    const updated = [...form.questions]
    updated[qi][field] = value
    setForm({ ...form, questions: updated })
  }

  const updateOption = (qi, oi, value) => {
    const updated = [...form.questions]
    updated[qi].options[oi].text = value
    setForm({ ...form, questions: updated })
  }

  const addOption = (qi) => {
    const updated = [...form.questions]
    updated[qi].options.push({ text: '' })
    setForm({ ...form, questions: updated })
  }

  const removeOption = (qi, oi) => {
    const updated = [...form.questions]
    if (updated[qi].options.length <= 2) {
      toast.error('Minimum 2 options required')
      return
    }
    updated[qi].options.splice(oi, 1)
    setForm({ ...form, questions: updated })
  }

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { text: '', isRequired: true, options: [{ text: '' }, { text: '' }] }]
    })
  }

  const removeQuestion = (qi) => {
    if (form.questions.length <= 1) {
      toast.error('Minimum 1 question required')
      return
    }
    const updated = form.questions.filter((_, i) => i !== qi)
    setForm({ ...form, questions: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Poll title is required')
    if (!form.expiresAt) return toast.error('Expiry date is required')
    for (const q of form.questions) {
      if (!q.text.trim()) return toast.error('All questions must have text')
      for (const o of q.options) {
        if (!o.text.trim()) return toast.error('All options must have text')
      }
    }
    setLoading(true)
    try {
      const poll = await createPoll(form)
      toast.success('Poll created!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create poll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <div className="sidebar" style={{
        display: 'flex', flexDirection: 'column',
        padding: '32px 24px', position: 'fixed', height: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--green)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--navy)' }} />
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'white' }}>PulseBoard</span>
        </div>
        <button onClick={() => navigate('/dashboard')}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '12px 16px', borderRadius: 10,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15,
            textAlign: 'left'
          }}>
          Dashboard
        </button>
        <button style={{
          background: 'rgba(46,204,143,0.15)', border: 'none', cursor: 'pointer',
          padding: '12px 16px', borderRadius: 10,
          color: 'var(--green)',
          fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15,
          textAlign: 'left'
        }}>
          Create Poll
        </button>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 260, flex: 1, padding: '40px 48px', maxWidth: 800 }}>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--navy)', marginBottom: 8 }}>
          Create a Poll
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
          Fill in the details below to create your poll
        </p>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 24, color: 'var(--navy)' }}>
              Poll Details
            </h2>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                Poll Title *
              </label>
              <input className="input" type="text" placeholder="e.g. Team Lunch Preferences"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                Description (optional)
              </label>
              <textarea className="input" placeholder="What is this poll about?"
                rows={3} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                  Expiry Date & Time *
                </label>
                <input className="input" type="datetime-local"
                  value={form.expiresAt}
                  onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                  Response Mode
                </label>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  {[
                    { label: 'Authenticated', value: false },
                    { label: 'Anonymous', value: true }
                  ].map((opt, i) => (
                    <button key={i} type="button"
                      onClick={() => setForm({ ...form, isAnonymous: opt.value })}
                      style={{
                        flex: 1, padding: '12px',
                        borderRadius: 10, cursor: 'pointer',
                        border: form.isAnonymous === opt.value ? '2px solid var(--green)' : '1.5px solid var(--border)',
                        background: form.isAnonymous === opt.value ? 'var(--green-light)' : 'white',
                        color: form.isAnonymous === opt.value ? 'var(--green-dark)' : 'var(--text-muted)',
                        fontWeight: 600, fontSize: 13,
                        fontFamily: 'DM Sans'
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          {form.questions.map((question, qi) => (
            <div key={qi} className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>
                  Question {qi + 1}
                </h3>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
                    <input type="checkbox" checked={question.isRequired}
                      onChange={e => updateQuestion(qi, 'isRequired', e.target.checked)} />
                    Mandatory
                  </label>
                  <button type="button" onClick={() => removeQuestion(qi)}
                    style={{
                      background: '#fdeaea', color: '#e74c3c',
                      border: 'none', padding: '6px 12px',
                      borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600
                    }}>
                    Remove
                  </button>
                </div>
              </div>

              <input className="input" type="text"
                placeholder="Enter your question"
                value={question.text}
                onChange={e => updateQuestion(qi, 'text', e.target.value)}
                style={{ marginBottom: 16 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {question.options.map((option, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: '2px solid var(--border)', flexShrink: 0
                    }} />
                    <input className="input" type="text"
                      placeholder={`Option ${oi + 1}`}
                      value={option.text}
                      onChange={e => updateOption(qi, oi, e.target.value)} />
                    <button type="button" onClick={() => removeOption(qi, oi)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#e74c3c', cursor: 'pointer',
                        fontSize: 18, flexShrink: 0
                      }}>×</button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addOption(qi)}
                style={{
                  marginTop: 12, background: 'none',
                  border: '1.5px dashed var(--border)',
                  color: 'var(--text-muted)', padding: '10px',
                  borderRadius: 10, cursor: 'pointer',
                  width: '100%', fontSize: 13, fontWeight: 600
                }}>
                + Add Option
              </button>
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="btn-secondary"
            style={{ width: '100%', marginBottom: 24, padding: '14px' }}>
            + Add Question
          </button>

          <button type="submit" className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '16px', fontSize: 16 }}>
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePollPage