import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    { icon: '01', title: 'Create Polls', desc: 'Build polls with multiple questions, mark them mandatory or optional, and set an expiry time.' },
    { icon: '02', title: 'Share Instantly', desc: 'Every poll gets a unique public link. Share it with anyone — no login needed to respond.' },
    { icon: '03', title: 'Live Analytics', desc: 'Watch responses arrive in real time. See counts, percentages and participation insights live.' },
    { icon: '04', title: 'Anonymous Mode', desc: 'Choose whether responses are anonymous or tied to authenticated user accounts.' },
    { icon: '05', title: 'Auto Expiry', desc: 'Set a deadline. After it passes, the poll closes automatically — no manual work needed.' },
    { icon: '06', title: 'Publish Results', desc: 'Once done, publish results publicly. Anyone with the link can view the final outcome.' },
  ]

  const useCases = [
    { label: 'Education', title: 'Classroom Feedback', desc: 'Collect student opinions, run quick quizzes, and understand what your class thinks — instantly.' },
    { label: 'Work', title: 'Team Decisions', desc: 'Vote on priorities, gather team preferences, and align faster without endless email threads.' },
    { label: 'Events', title: 'Event Planning', desc: 'Let your group vote on dates, venues, and activities. Everyone gets a say.' },
    { label: 'Product', title: 'User Research', desc: 'Understand what your users love, what frustrates them, and what they want next.' },
  ]

  const steps = [
    { number: '1', title: 'Create your poll', desc: 'Add questions, set options, configure expiry and response settings.' },
    { number: '2', title: 'Share the link', desc: 'Copy your unique public link and send it to anyone via any channel.' },
    { number: '3', title: 'Collect responses', desc: 'Respondents open the link, answer questions, and submit — no account needed.' },
    { number: '4', title: 'View and publish', desc: 'Analyze results on your dashboard and publish the final outcome publicly.' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '68px',
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--navy)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--green)' }} />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>
            PulseBoard
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>Dashboard</button>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'var(--navy)',
        padding: '100px 48px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(46,204,143,0.15)',
          color: 'var(--green)',
          padding: '6px 18px',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.05em',
          marginBottom: 32,
          border: '1px solid rgba(46,204,143,0.3)'
        }}>
          REAL-TIME POLLING PLATFORM
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          color: 'var(--white)',
          lineHeight: 1.1,
          maxWidth: 800,
          margin: '0 auto 24px'
        }}>
          Create polls. <br />
          <span style={{ color: 'var(--green)' }}>Collect feedback.</span>
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 18,
          maxWidth: 520,
          margin: '0 auto 48px',
          lineHeight: 1.7
        }}>
          Build polls in minutes, share them with a link, and watch responses
          arrive in real time — all in one place.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}
            onClick={() => navigate('/register')}>
            Start for free
          </button>
          <button className="btn-outline-white" style={{ fontSize: 16, padding: '14px 36px' }}
            onClick={() => navigate('/login')}>
            Login
          </button>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 64,
          marginTop: 80, flexWrap: 'wrap'
        }}>
          {[
            { value: 'Free', label: 'No credit card needed' },
            { value: 'Live', label: 'Real-time WebSocket updates' },
            { value: 'Open', label: 'Public result sharing' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: 'var(--green)' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, color: 'var(--navy)', marginBottom: 16 }}>
              Everything you need
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 17 }}>
              A complete polling platform built for real workflows
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card">
                <div style={{
                  fontFamily: 'Syne', fontWeight: 800, fontSize: 13,
                  color: 'var(--green)', marginBottom: 16, letterSpacing: '0.05em'
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20, marginBottom: 10, color: 'var(--navy)' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '100px 48px', background: 'var(--white)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, color: 'var(--navy)', marginBottom: 16 }}>
              Built for every team
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 17 }}>
              Whether you teach, manage, or build — PulseBoard fits your workflow
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {useCases.map((u, i) => (
              <div key={i} className="card" style={{ borderTop: '3px solid var(--green)' }}>
                <span style={{
                  background: 'var(--green-light)', color: 'var(--green-dark)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  padding: '4px 10px', borderRadius: 6, marginBottom: 16, display: 'inline-block'
                }}>{u.label}</span>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 19, marginBottom: 10, color: 'var(--navy)' }}>
                  {u.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 14 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 48px', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, color: 'var(--white)', marginBottom: 16 }}>
              How it works
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17 }}>Four steps from idea to published results</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: '2px solid var(--green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--green)'
                }}>{s.number}</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, color: 'var(--white)', marginBottom: 10 }}>
                  {s.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 48px', textAlign: 'center',
        background: 'var(--green-light)', borderTop: '1px solid var(--border)'
      }}>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 44, color: 'var(--navy)', marginBottom: 16 }}>
          Ready to get started?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 17, marginBottom: 40 }}>
          Create your first poll in minutes — completely free
        </p>
        <button className="btn-primary" style={{ fontSize: 17, padding: '16px 48px' }}
          onClick={() => navigate('/register')}>
          Create your first poll
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--navy)', padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16
      }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--white)', fontSize: 18 }}>PulseBoard</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Built for the hackathon</span>
      </footer>

    </div>
  )
}

export default LandingPage