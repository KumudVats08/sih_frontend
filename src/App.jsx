
import { useEffect, useState } from 'react'
import './App.css'
import { getDemand, getGaps, loginEmployer } from './api.js'

const skillData = [
  { name: 'Python', demand: 92, growth: '+31%' },
  { name: 'Data Analytics', demand: 87, growth: '+24%' },
  { name: 'Cloud Computing', demand: 78, growth: '+21%' },
  { name: 'Cybersecurity', demand: 71, growth: '+18%' },
  { name: 'Java', demand: 65, growth: '+14%' },
]

const districts = [
  {
    name: 'Delhi / NCR',
    learners: '1,240',
    priority: 'Python & Data Analysis',
    courses: '8 recommended courses',
  },
  {
    name: 'Bengaluru',
    learners: '980',
    priority: 'Cloud Computing',
    courses: '6 recommended courses',
  },
  {
    name: 'Pune',
    learners: '760',
    priority: 'Java & Backend',
    courses: '5 recommended courses',
  },
]

const courses = [
  {
    title: 'Python for Data Analytics',
    level: 'Intermediate',
    match: '94%',
    skills: 'Python · SQL · Data Analysis',
  },
  {
    title: 'Cloud Computing Foundations',
    level: 'Beginner',
    match: '88%',
    skills: 'AWS · Cloud · Networking',
  },
  {
    title: 'Cybersecurity Essentials',
    level: 'Intermediate',
    match: '82%',
    skills: 'Security · Networks · Linux',
  },
]

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [showLogin, setShowLogin] = useState(false)

  const goTo = (page) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <nav className="navbar">
        <button className="logo" onClick={() => goTo('dashboard')}>
          Skill<span>Sync</span>
        </button>

        <div className="nav-links">
          <button
            className={activePage === 'dashboard' ? 'active' : ''}
            onClick={() => goTo('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={activePage === 'curriculum' ? 'active' : ''}
            onClick={() => goTo('curriculum')}
          >
            Curriculum
          </button>

          <button
            className={activePage === 'district' ? 'active' : ''}
            onClick={() => goTo('district')}
          >
            District Planner
          </button>

          <button
            className={activePage === 'career' ? 'active' : ''}
            onClick={() => goTo('career')}
          >
            Career Guidance
          </button>
        </div>

        <button className="login-btn" onClick={() => setShowLogin(true)}>
          Login
        </button>
      </nav>

      <main>
        {activePage === 'dashboard' && (
          <Dashboard
            goTo={goTo}
            setShowLogin={setShowLogin}
          />
        )}

        {activePage === 'curriculum' && <Curriculum />}

        {activePage === 'district' && <DistrictPlanner />}

        {activePage === 'career' && <CareerGuidance />}
      </main>

      <footer>
        <div>
          <strong>Skill<span>Sync</span></strong>
          <p>Bridging the gap between skills and industry.</p>
        </div>

        <p>AI-powered labour market intelligence • SIH 2026</p>
      </footer>

      {showLogin && <LoginModal close={() => setShowLogin(false)} />}
    </div>
  )
}

function Dashboard({ goTo, setShowLogin }) {
  const [liveSkills, setLiveSkills] = useState(null) // null = use demo fallback
  const [liveGaps, setLiveGaps] = useState(null)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadLiveData() {
      try {
        const [demandRes, gapsRes] = await Promise.all([
          getDemand('Delhi / NCR', ''),
          getGaps('Delhi / NCR'),
        ])

        if (cancelled) return

        if (demandRes.demand?.length) {
          setLiveSkills(demandRes.demand.slice(0, 3))
        }
        if (gapsRes.gaps?.length) {
          setLiveGaps(gapsRes.gaps.slice(0, 4))
        }
      } catch (err) {
        // Backend not reachable / DB not seeded yet — keep showing demo data.
        if (!cancelled) setApiError(true)
        console.warn('Falling back to demo data:', err.message)
      }
    }

    loadLiveData()
    return () => {
      cancelled = true
    }
  }, [])

  const topSkills = liveSkills ?? skillData.slice(0, 3).map((s) => ({
    skill: s.name,
    openings: s.demand,
  }))

  const gapRows = liveGaps ?? [
    { skill: 'Python', severity: 'high', openings: 43 },
    { skill: 'SQL', severity: 'medium', openings: 62 },
    { skill: 'Cloud', severity: 'high', openings: 35 },
    { skill: 'Java', severity: 'low', openings: 74 },
  ]

  const severityLabel = { high: 'High Gap', medium: 'Medium', low: 'Low Gap' }
  const maxOpenings = Math.max(...gapRows.map((g) => g.openings), 1)

  return (
    <>
      {apiError && (
        <div className="api-banner">
          Showing demo data — couldn't reach the API at localhost:8000. Start
          the FastAPI backend to see live numbers.
        </div>
      )}

      <section className="hero">
        <div className="hero-text">
          <p className="tag">AI-POWERED LABOUR MARKET INTELLIGENCE</p>

          <h1>
            Bridge the gap between
            <span> skills and industry.</span>
          </h1>

          <p className="hero-description">
            Transform real-time industry demand into smarter training,
            better curricula, and stronger career opportunities.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => goTo('dashboard')}>
              Explore Dashboard →
            </button>

            <button className="secondary-btn" onClick={() => goTo('curriculum')}>
              View Skill Trends
            </button>
          </div>

          <div className="trust-line">
            <span>●</span> Powered by industry demand data
          </div>
        </div>

        <div className="hero-card">
          <p>TOP INDUSTRY SIGNAL</p>
          <h2>AI & Data Science</h2>

          <div className="demand-number">87%</div>

          <div className="progress">
            <div style={{ width: '87%' }}></div>
          </div>

          <p className="growth">↑ 24% demand growth</p>

          <div className="mini-stats">
            <div>
              <strong>4.8K</strong>
              <span>openings</span>
            </div>

            <div>
              <strong>340+</strong>
              <span>skills</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-icon">◉</div>
          <h2>12,480+</h2>
          <p>Jobs Analyzed</p>
          <span className="stat-growth">+18% this month</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">◇</div>
          <h2>340+</h2>
          <p>Skills Tracked</p>
          <span className="stat-growth">+42 emerging</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">↗</div>
          <h2>78%</h2>
          <p>Placement Rate</p>
          <span className="stat-growth">+7.4% improvement</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✦</div>
          <h2>42</h2>
          <p>Emerging Skills</p>
          <span className="stat-growth">AI identified</span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="tag">LIVE MARKET SIGNALS</p>
            <h2>What is the industry looking for?</h2>
          </div>

          <span className="live-badge">● LIVE DATA</span>
        </div>

        <div className="market-grid">
          {topSkills.map((item, i) => (
            <div className="market-card" key={item.skill}>
              <div className="card-top">
                <div>
                  <p className="muted">
                    {i === 0 ? 'TOP SKILL' : i === 1 ? 'FASTEST GROWING' : 'EMERGING'}
                  </p>
                  <h3>{item.skill}</h3>
                </div>
                <strong>{item.openings}</strong>
              </div>

              <div className="bar">
                <div
                  style={{
                    width: `${Math.min(100, (item.openings / (topSkills[0].openings || 1)) * 100)}%`,
                  }}
                ></div>
              </div>

              <p className="positive">{item.openings} openings tracked</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gap-section">
        <div className="gap-content">
          <p className="tag">AI SKILL GAP ANALYSIS</p>

          <h2>
            Find the skills that are
            <span> missing in the workforce.</span>
          </h2>

          <p>
            SkillSync compares workforce availability with actual employer
            demand to identify where training investment is needed most.
          </p>

          <button className="primary-btn" onClick={() => goTo('district')}>
            Explore District Gaps →
          </button>
        </div>

        <div className="gap-visual">
          {gapRows.map((gap) => (
            <div className="gap-row" key={gap.skill}>
              <span>{gap.skill}</span>
              <div className="gap-track">
                <div
                  className="available"
                  style={{ width: `${(gap.openings / maxOpenings) * 100}%` }}
                ></div>
              </div>
              <strong>{severityLabel[gap.severity] || gap.severity}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="tag">HOW IT WORKS</p>
          <h2>From industry demand to job readiness.</h2>
        </div>

        <div className="feature-grid">
          <Feature
            icon="01"
            title="Labour Market Intelligence"
            text="Analyze job postings, employer requirements and emerging technologies to identify real skill demand."
          />

          <Feature
            icon="02"
            title="Curriculum Alignment"
            text="Compare existing courses with industry requirements and identify missing or outdated skills."
          />

          <Feature
            icon="03"
            title="District Training Planner"
            text="Plan training capacity, trainers and infrastructure according to local industry demand."
          />

          <Feature
            icon="04"
            title="Career Guidance"
            text="Help candidates understand their skill gaps and follow a personalized path toward job readiness."
          />
        </div>
      </section>

      <section className="cta-section">
        <p className="tag">READY TO CLOSE THE GAP?</p>
        <h2>Turn data into better career outcomes.</h2>
        <p>
          Give educators, policymakers and learners the intelligence they need
          to make smarter decisions.
        </p>
        <button className="primary-btn" onClick={() => setShowLogin(true)}>
          Get Started →
        </button>
      </section>
    </>
  )
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-number">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="learn-more">Explore →</span>
    </div>
  )
}

function Curriculum() {
  return (
    <section className="page-section">
      <div className="page-header">
        <p className="tag">CURRICULUM INTELLIGENCE</p>
        <h1>Align learning with <span>industry demand.</span></h1>
        <p>
          Identify courses that match emerging skills and discover where the
          curriculum needs to evolve.
        </p>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.title}>
            <div className="course-top">
              <span className="course-level">{course.level}</span>
              <strong>{course.match} match</strong>
            </div>

            <h3>{course.title}</h3>

            <p>{course.skills}</p>

            <div className="course-progress">
              <div style={{ width: course.match }}></div>
            </div>

            <button>View Recommendation →</button>
          </div>
        ))}
      </div>

      <div className="ai-box">
        <div className="ai-symbol">✦</div>
        <div>
          <p className="tag">AI CURRICULUM ASSISTANT</p>
          <h2>Need a smarter course recommendation?</h2>
          <p>
            SkillSync can analyze a skill gap and suggest courses based on
            industry demand.
          </p>
        </div>
        <button className="primary-btn">Ask AI →</button>
      </div>
    </section>
  )
}

function DistrictPlanner() {
  return (
    <section className="page-section">
      <div className="page-header">
        <p className="tag">DISTRICT PLANNER</p>
        <h1>Train where the <span>gap is highest.</span></h1>
        <p>
          Use local workforce data to prioritize skills, learners and training
          programs.
        </p>
      </div>

      <div className="district-summary">
        <div>
          <span>Total districts</span>
          <strong>28</strong>
        </div>
        <div>
          <span>Learners targeted</span>
          <strong>4,860</strong>
        </div>
        <div>
          <span>High-priority skills</span>
          <strong>16</strong>
        </div>
      </div>

      <div className="district-grid">
        {districts.map((district) => (
          <div className="district-card" key={district.name}>
            <div className="district-icon">⌖</div>

            <p className="muted">DISTRICT</p>
            <h3>{district.name}</h3>

            <div className="district-info">
              <div>
                <span>Target learners</span>
                <strong>{district.learners}</strong>
              </div>

              <div>
                <span>Priority skill</span>
                <strong>{district.priority}</strong>
              </div>
            </div>

            <p className="course-count">{district.courses}</p>

            <button>View District Plan →</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function CareerGuidance() {
  return (
    <section className="page-section">
      <div className="career-hero">
        <div>
          <p className="tag">CAREER GUIDANCE</p>

          <h1>
            Your skills.
            <br />
            Your <span>next opportunity.</span>
          </h1>

          <p>
            Understand your current skill profile, identify gaps and discover
            the learning path most aligned with industry demand.
          </p>

          <button className="primary-btn">Build My Skill Profile →</button>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">GS</div>
            <div>
              <p className="muted">SAMPLE PROFILE</p>
              <h3>Data Analyst Path</h3>
            </div>
          </div>

          <div className="score">
            <div>
              <span>Job readiness</span>
              <strong>72%</strong>
            </div>

            <div className="score-bar">
              <div></div>
            </div>
          </div>

          <div className="skills-list">
            <span className="skill-done">✓ Python</span>
            <span className="skill-done">✓ Excel</span>
            <span className="skill-needed">+ SQL</span>
            <span className="skill-needed">+ Power BI</span>
          </div>
        </div>
      </div>

      <div className="career-grid">
        <div className="career-card">
          <span>01</span>
          <h3>Assess your skills</h3>
          <p>Build a profile based on your existing technical skills.</p>
        </div>

        <div className="career-card">
          <span>02</span>
          <h3>Find your gaps</h3>
          <p>Compare your profile against current employer requirements.</p>
        </div>

        <div className="career-card">
          <span>03</span>
          <h3>Follow your path</h3>
          <p>Get recommendations for skills and courses to become job ready.</p>
        </div>
      </div>
    </section>
  )
}

function LoginModal({ close }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginEmployer(email, password)
      close()
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>×</button>

        <p className="tag">WELCOME TO SKILLSYNC</p>
        <h2>Sign in to your workspace.</h2>
        <p className="modal-description">
          Access your dashboard, recommendations and personalized insights.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="primary-btn login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="demo-note">
          Employer accounts only — sign up via the /auth/register endpoint.
        </p>
      </div>
    </div>
  )
}

export default App
