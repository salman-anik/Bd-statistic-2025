import { useEffect, useRef, useState } from 'react'
import * as D from './data.js'

const fmt = (n) => n.toLocaleString('en-US')
const compact = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : String(n))

function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.15 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

function Reveal({ children, className = '' }) {
  const [ref, seen] = useInView()
  return <div ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}>{children}</div>
}

function CountUp({ to }) {
  const [ref, seen] = useInView()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    let raf, t0
    const step = (t) => {
      t0 ??= t
      const p = Math.min((t - t0) / 1200, 1)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{fmt(v)}</span>
}

function Section({ id, eyebrow, title, lead, children }) {
  return (
    <section id={id} className="section">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </Reveal>
      {children}
    </section>
  )
}

function Card({ title, sub, children, className = '' }) {
  return (
    <Reveal className={`card ${className}`}>
      {title && <h3>{title}</h3>}
      {sub && <p className="sub">{sub}</p>}
      {children}
    </Reveal>
  )
}

function LineChart({ labels, series, unit = '', min, max, fmtY = (v) => v }) {
  const [hover, setHover] = useState(null)
  const W = 640, H = 270, P = { l: 44, r: 16, t: 14, b: 28 }
  const all = series.flatMap((s) => s.values.filter((v) => v != null))
  const lo = min ?? Math.floor(Math.min(...all) * 0.97), hi = max ?? Math.ceil(Math.max(...all) * 1.03)
  const x = (i) => P.l + (i * (W - P.l - P.r)) / (labels.length - 1)
  const y = (v) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b)
  const ticks = [0, 1, 2, 3, 4].map((k) => lo + ((hi - lo) * k) / 4)
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    setHover(Math.max(0, Math.min(labels.length - 1, Math.round(((px - P.l) / (W - P.l - P.r)) * (labels.length - 1)))))
  }
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="grid" />
            <text x={P.l - 8} y={y(t) + 4} className="tick" textAnchor="end">{fmtY(Math.round(t * 10) / 10)}</text>
          </g>
        ))}
        {labels.map((l, i) => (i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1) && (
          <text key={l} x={x(i)} y={H - 8} className="tick" textAnchor="middle">{l}</text>
        ))}
        {series.map((s) => (
          <g key={s.name}>
            <path d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="draw" pathLength="1" />
            {hover != null && <circle cx={x(hover)} cy={y(s.values[hover])} r="4.5" fill={s.color} stroke="var(--bg)" strokeWidth="2" />}
          </g>
        ))}
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} className="cursor" />}
      </svg>
      <div className="legend">
        {series.map((s) => (
          <span key={s.name}><i style={{ background: s.color }} />{s.name}{hover != null && <b>{fmtY(s.values[hover])}{unit}</b>}</span>
        ))}
        {hover != null && <em>{labels[hover]}</em>}
      </div>
    </div>
  )
}

function Bars({ rows, unit = '', color = 'var(--accent)', max }) {
  const m = max ?? Math.max(...rows.map((r) => r[1]))
  return (
    <div className="bars">
      {rows.map(([l, v]) => (
        <div className="bar" key={l}>
          <span className="bl">{l}</span>
          <div className="track"><div className="fill" style={{ '--w': `${(v / m) * 100}%`, background: color }} /></div>
          <span className="bv">{fmt(v)}{unit}</span>
        </div>
      ))}
    </div>
  )
}

function Donut({ pct, label }) {
  const r = 38, c = 2 * Math.PI * r
  return (
    <div className="donut">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} className="d-bg" />
        <circle cx="50" cy="50" r={r} className="d-fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 50 50)" />
      </svg>
      <b>{pct}%</b><small>{label}</small>
    </div>
  )
}

const nav = [['overview', 'Overview'], ['levels', 'Levels'], ['growth', 'Growth'], ['gender', 'Gender'], ['primary', 'Primary'], ['finance', 'Finance'], ['results', 'Results'], ['facilities', 'Facilities'], ['climate', 'Climate']]

export default function App() {
  const [dark, setDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)
  const [lvl, setLvl] = useState(0)
  const [sort, setSort] = useState('students')
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [dark])
  const L = D.levels[lvl]
  const sorted = [...D.levels].sort((a, b) => b[sort] - a[sort])

  return (
    <>
      <header className="nav">
        <a href="#top" className="brand">BD<span>Edu</span> 2025</a>
        <nav>{nav.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}</nav>
        <button className="toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? '☀' : '☾'}</button>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">BANBEIS · Ministry of Education · June 2026</p>
          <h1>Bangladesh<br /><span>Education Statistics 2025</span></h1>
          <p className="lead">An interactive guide to the nation’s schools, colleges, madrasahs, universities and the people in them — drawn from the 596-page annual report.</p>
          <div className="kpis">
            {D.kpis.map((k) => (
              <div className="kpi" key={k.label}>
                <b><CountUp to={k.value} /></b><span>{k.label}</span><small>{k.note}</small>
              </div>
            ))}
          </div>
        </section>

        <Section id="overview" eyebrow="At a glance" title="Participation across levels" lead="Girls now outnumber boys in secondary and higher secondary enrolment, while tertiary participation remains the widest gap.">
          <div className="grid g3">
            <Card title="Secondary GER" sub="Boys 62.72 · Girls 78.28"><Donut pct={70.22} label="Gross enrolment" /></Card>
            <Card title="Higher secondary GER" sub="Boys 43.56 · Girls 50.69"><Donut pct={46.94} label="Gross enrolment" /></Card>
            <Card title="Tertiary GER" sub="Gender parity index 0.87"><Donut pct={19.8} label="Gross enrolment" /></Card>
          </div>
          <div className="grid g3 mt">
            <Card title="Secondary dropout" sub="2025"><div className="big">14.00%</div></Card>
            <Card title="Teacher–student ratio" sub="Junior & secondary"><div className="big">1 : 29</div></Card>
            <Card title="Trained teachers" sub="Junior & secondary"><div className="big">59.48%</div></Card>
          </div>
        </Section>

        <Section id="levels" eyebrow="The system" title="Every level, side by side" lead="Pick a level to see its scale, or sort the comparison by what matters to you.">
          <div className="grid g2">
            <Card>
              <div className="tabs">{D.levels.map((l, i) => <button key={l.name} className={i === lvl ? 'on' : ''} onClick={() => setLvl(i)}>{l.name}</button>)}</div>
              <h3 className="lv">{L.name}</h3>
              <div className="mini">
                <div><b>{fmt(L.inst)}</b><span>institutions</span></div>
                <div><b>{fmt(L.teachers)}</b><span>teachers · {L.fem}% female</span></div>
                <div><b>{fmt(L.students)}</b><span>students · {L.girls}% girls</span></div>
                <div><b>{Math.round(L.students / L.teachers)}</b><span>students per teacher</span></div>
              </div>
              <div className="split"><i style={{ width: `${L.girls}%` }} /><em>Girls {L.girls}%</em><em>Boys {(100 - L.girls).toFixed(2)}%</em></div>
            </Card>
            <Card title="Compare levels">
              <div className="tabs">{['students', 'teachers', 'inst'].map((k) => <button key={k} className={sort === k ? 'on' : ''} onClick={() => setSort(k)}>{k === 'inst' ? 'Institutions' : k[0].toUpperCase() + k.slice(1)}</button>)}</div>
              <Bars rows={sorted.map((l) => [l.name, l[sort]])} />
            </Card>
          </div>
        </Section>

        <Section id="growth" eyebrow="2010 → 2025" title="Growth of post-primary education" lead="Teachers kept growing even as enrolment dipped after 2023, and the share of women among teachers climbed from 19.5% to 29.9%.">
          <div className="grid g2">
            <Card title="Students (millions)"><LineChart labels={D.years} series={[{ name: 'Students', color: '#6366f1', values: D.students.map((v) => +(v / 1e6).toFixed(2)) }]} unit="M" /></Card>
            <Card title="Teachers (thousands)"><LineChart labels={D.years} series={[{ name: 'Teachers', color: '#0ea5e9', values: D.teachers.map((v) => Math.round(v / 1e3)) }]} unit="K" /></Card>
          </div>
          <Card className="mt" title="Female teachers (%)"><LineChart labels={D.years} series={[{ name: 'Female teachers', color: '#ec4899', values: D.femaleTeacherPct }]} unit="%" /></Card>
        </Section>

        <Section id="gender" eyebrow="Equity" title="Girls’ share of enrolment" lead="Girls’ share in higher secondary rose above 51% in 2025; SDG 4.5.1 parity indices are 1.21 (secondary), 1.08 (higher secondary) and 0.87 (tertiary).">
          <Card><LineChart labels={D.girlsYears} series={D.girlsByLevel} unit="%" min={40} max={58} /></Card>
        </Section>

        <Section id="primary" eyebrow="Primary · APSC 2024" title="Near-universal access" lead="Primary gross enrolment reached 106.37% and net enrolment 94.55% in 2024. Dropout fell from 39.80% to 16.25% since 2010.">
          <div className="grid g2">
            <Card title="GER vs NER (%)"><LineChart labels={D.primaryYears} series={[{ name: 'GER', color: '#10b981', values: D.GER }, { name: 'NER', color: '#f59e0b', values: D.NER }]} unit="%" min={90} max={120} /></Card>
            <Card title="Primary efficiency, 2010 → 2024">
              <Bars unit="%" max={100} color="linear-gradient(90deg,#10b981,#06b6d4)" rows={[['Coefficient of efficiency 2010', 62.3], ['Coefficient of efficiency 2024', 86.67], ['Girls’ survival 2010', 68.6], ['Girls’ survival 2024', 86.83], ['Boys’ survival 2010', 65.9], ['Boys’ survival 2024', 81.23]]} />
            </Card>
          </div>
        </Section>

        <Section id="finance" eyebrow="Budget" title="Education in the national budget" lead="Education took 12.52% of the national budget in 2025-26, up from 11.76% the year before; recurrent spending was Tk 41,231 crore in 2024-25.">
          <div className="grid g2">
            <Card title="Share of national budget (%)"><LineChart labels={D.budgetYears} series={[{ name: 'Education total', color: '#6366f1', values: D.budgetShare }, { name: 'Post-primary', color: '#0ea5e9', values: D.postPrimaryShare }, { name: 'Primary', color: '#f59e0b', values: D.primaryShare }]} unit="%" min={0} max={18} /></Card>
            <Card title="Support for students">
              <div className="mini one">
                <div><b>5,826,934</b><span>students receiving stipends (59.35% girls)</span></div>
                <div><b>Tk 20,369 M</b><span>stipends disbursed</span></div>
                <div><b>Tk 26,846</b><span>estimated cost per student, 2024-25</span></div>
              </div>
            </Card>
          </div>
        </Section>

        <Section id="results" eyebrow="Outcomes" title="Public examinations" lead="2025 pass rates were 57.12% for HSC (girls 61.45%), 68.09% for Dakhil and 75.61% for Alim.">
          <div className="grid g2">
            <Card title="HSC pass rate (%)" sub="2020 reflects the universal pass; 2023–24 not shown"><LineChart labels={D.hscYears} series={[{ name: 'HSC pass', color: '#ef4444', values: D.hscPass }]} unit="%" min={40} max={100} /></Card>
            <Card title="Examinees in 2025">
              <div className="mini one">
                <div><b>1,047,242</b><span>appeared in HSC · 598,166 passed</span></div>
                <div><b>125,018</b><span>achieved GPA 5 in SSC</span></div>
                <div><b>82,809</b><span>appeared in Alim · 286,572 madrasah candidates overall</span></div>
              </div>
            </Card>
          </div>
        </Section>

        <Section id="facilities" eyebrow="Infrastructure" title="What institutions have" lead="Electricity is almost universal; science labs, ramps and digital attendance are where gaps remain.">
          <div className="grid g2">
            {Object.entries(D.facilities).map(([k, rows]) => <Card key={k} title={k}><Bars rows={rows} unit="%" max={100} color="linear-gradient(90deg,#6366f1,#8b5cf6)" /></Card>)}
          </div>
        </Section>

        <Section id="climate" eyebrow="Resilience" title="Climate and disaster exposure" lead="5,631 institutions sit in disaster-prone areas; many have not recovered from the last event.">
          <div className="grid g2">
            <Card title="Institutions by hazard"><Bars rows={D.disasterAreas} color="linear-gradient(90deg,#06b6d4,#3b82f6)" /></Card>
            <Card title="Loss not yet recovered (%)"><Bars rows={D.unrecovered} unit="%" max={30} color="linear-gradient(90deg,#f59e0b,#ef4444)" /></Card>
          </div>
        </Section>
      </main>

      <footer>
        <p>Source: BANBEIS, <i>Bangladesh Education Statistics 2025</i> (Publication No. 520), Ministry of Education. Primary figures from DPE APSC 2024.</p>
      </footer>
    </>
  )
}
