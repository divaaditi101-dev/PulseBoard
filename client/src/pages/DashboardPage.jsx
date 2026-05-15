import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyPolls, deletePoll, publishPoll } from "../services/pollService.js";
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const data = await getMyPolls()
      setPolls(data)
    } catch (error) {
      toast.error('Failed to load polls')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pollId) => {
    if (!window.confirm('Delete this poll?')) return
    try {
      await deletePoll(pollId)
      setPolls(polls.filter(p => p._id !== pollId))
      toast.success('Poll deleted')
    } catch (error) {
      toast.error('Failed to delete poll')
    }
  }

  const handlePublish = async (pollId) => {
    if (!window.confirm('Publish results? This will close the poll.')) return
    try {
      await publishPoll(pollId)
      toast.success('Poll published!')
      fetchPolls()
    } catch (error) {
      toast.error('Failed to publish poll')
    }
  }

  const copyLink = (token) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${token}`)
    toast.success('Link copied!')
  }

  const isExpired = (expiresAt) => new Date() > new Date(expiresAt)

  const getStatus = (poll) => {
    if (poll.isPublished) return { label: 'Published', color: '#2ecc8f', bg: '#e8faf3' }
    if (isExpired(poll.expiresAt)) return { label: 'Expired', color: '#e74c3c', bg: '#fdeaea' }
    if (poll.isActive) return { label: 'Active', color: '#3498db', bg: '#eaf3fb' }
    return { label: 'Inactive', color: '#888', bg: '#f0f0f0' }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <div className="sidebar" style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '32px 24px',
        position: 'fixed', height: '100vh'
      }}>
        <div>
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

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Dashboard', active: true },
              { label: 'Create Poll', action: () => navigate('/create-poll') },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                style={{
                  background: item.active ? 'rgba(46,204,143,0.15)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  padding: '12px 16px', borderRadius: 10,
                  color: item.active ? 'var(--green)' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'DM Sans', fontWeight: 600, fontSize: 15,
                  textAlign: 'left', transition: 'all 0.2s'
                }}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 12
          }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{user?.email}</div>
          </div>
          <button onClick={() => { logout(); navigate('/') }}
            style={{
              width: '100%', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)', padding: '10px',
              borderRadius: 10, cursor: 'pointer',
              fontFamily: 'DM Sans', fontSize: 14
            }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 260, flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--navy)' }}>
              Your Polls
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
              Manage and track all your polls
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/create-poll')}>
            Create New Poll
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Polls', value: polls.length },
            { label: 'Active Polls', value: polls.filter(p => p.isActive && !p.isPublished).length },
            { label: 'Total Responses', value: polls.reduce((sum, p) => sum + (p.totalResponses || 0), 0) },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 36, color: 'var(--navy)' }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Polls List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 60 }}>Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>No polls yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Create your first poll to get started</p>
            <button className="btn-primary" onClick={() => navigate('/create-poll')}>Create Poll</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {polls.map(poll => {
              const status = getStatus(poll)
              return (
                <div key={poll._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--navy)' }}>
                        {poll.title}
                      </h3>
                      <span style={{
                        background: status.bg, color: status.color,
                        fontSize: 11, fontWeight: 700, padding: '3px 10px',
                        borderRadius: 6, letterSpacing: '0.05em'
                      }}>{status.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                      <span>{poll.questions?.length} questions</span>
                      <span>{poll.totalResponses || 0} responses</span>
                      <span>Expires {new Date(poll.expiresAt).toLocaleDateString()}</span>
                      <span>{poll.isAnonymous ? 'Anonymous' : 'Authenticated'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginLeft: 24 }}>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}
                      onClick={() => copyLink(poll.shareToken)}>
                      Copy Link
                    </button>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}
                      onClick={() => navigate(`/analytics/${poll._id}`)}>
                      Analytics
                    </button>
                    {!poll.isPublished && (
                      <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}
                        onClick={() => handlePublish(poll._id)}>
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(poll._id)}
                      style={{
                        background: '#fdeaea', color: '#e74c3c',
                        border: 'none', padding: '8px 16px',
                        borderRadius: 10, cursor: 'pointer',
                        fontWeight: 600, fontSize: 13
                      }}>
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage