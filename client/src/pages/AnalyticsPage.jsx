import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnalytics, publishPoll } from "../services/pollService.js"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const AnalyticsPage = () => {
const { pollId } = useParams()
const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()

    const socket = io('http://localhost:5001')
    socket.emit('joinPoll', pollId)
    socket.on('newResponse', (data) => {
      fetchAnalytics()
    })
    return () => socket.disconnect()
  }, [pollId])

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics(pollId)
      setAnalytics(data)
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!window.confirm('Publish results publicly?')) return
    try {
      await publishPoll(pollId)
      toast.success('Results published!')
      fetchAnalytics()
    } catch (error) {
      toast.error('Failed to publish')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
    </div>
  )

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
      </div>

      {/* Main */}
      <div style={{ marginLeft: 260, flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--navy)' }}>
              Analytics
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
              Live response tracking
              <span style={{
                display: 'inline-block', marginLeft: 10,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--green)',
                boxShadow: '0 0 0 3px rgba(46,204,143,0.3)',
                verticalAlign: 'middle'
              }} />
            </p>
          </div>
          {!analytics?.isPublished && (
            <button className="btn-primary" onClick={handlePublish}>
              Publish Results
            </button>
          )}
          {analytics?.isPublished && (
            <span style={{
              background: 'var(--green-light)', color: 'var(--green-dark)',
              padding: '8px 18px', borderRadius: 8,
              fontWeight: 700, fontSize: 13
            }}>Results Published</span>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Responses', value: analytics?.totalResponses || 0 },
            { label: 'Questions', value: analytics?.questions?.length || 0 },
            { label: 'Status', value: analytics?.isActive ? 'Active' : 'Closed' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 36, color: 'var(--navy)' }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Question Charts */}
        {analytics?.questions?.map((question, i) => (
          <div key={i} className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>
              {question.questionText}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
              {question.totalAnswers} responses
            </p>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={question.options.map(o => ({ name: o.text, count: o.count }))}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5a6a85' }} />
                <YAxis tick={{ fontSize: 12, fill: '#5a6a85' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {question.options.map((_, j) => (
                    <Cell key={j} fill={j === 0 ? '#2ecc8f' : j === 1 ? '#0f1f3d' : '#5a6a85'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Option breakdown */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {question.options.map((opt, j) => (
                <div key={j}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                    <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{opt.text}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{opt.percentage}% · {opt.count} votes</span>
                  </div>
                  <div style={{ background: 'var(--border)', borderRadius: 6, height: 8 }}>
                    <div style={{
                      width: `${opt.percentage}%`, height: '100%',
                      background: 'var(--green)', borderRadius: 6,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsPage