import { useEffect, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Github, Linkedin, Menu, X,
  Check, Terminal, Download, Coffee, HeartPulse, Code2, Database, Globe2,
  BriefcaseBusiness, GraduationCap, Mail, MapPin,
} from 'lucide-react';

const API_BASE = typeof __API_BASE__ !== 'undefined' ? __API_BASE__ : '';
const CONTACT_EMAIL = 'kaindaperpetua@gmail.com';
const filters = ['All work', 'Data-driven projects'];
const projectIcons = { 'coffee-recommender': Coffee, healthre: HeartPulse, 'go-dashboard': Database };
const projectTones = { 'coffee-recommender': 'coffee', healthre: 'health', 'go-dashboard': 'coffee' };

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All work');
  const [api, setApi] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const projects = api?.projects || [];
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [formStatusType, setFormStatusType] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/portfolio`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('API unavailable'); return response.json(); })
      .then(data => { setApi(data); setApiError(false); })
      .catch(error => { if (error.name !== 'AbortError') setApiError(true); })
      .finally(() => { if (!controller.signal.aborted) setApiLoading(false); });
    return () => controller.abort();
  }, []);

  const visibleProjects = projects.filter(project =>
    filter === 'All work' || (filter === 'Data-driven projects' && ['coffee-recommender', 'go-dashboard'].includes(project.id))
  );
  const closeMenu = () => setMenuOpen(false);

  async function submitContact(event) {
    event.preventDefault();
    setBusy(true);
    setFormStatus('');
    setFormStatusType('');
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Please check your details and try again.');
      setFormStatus(result.message || 'Your message has been sent. Thank you!');
      setFormStatusType('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setFormStatus(error.message || `The form could not reach the server. Email ${CONTACT_EMAIL} directly.`);
      setFormStatusType('error');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <header className="site-header">
      <a className="brand" href="#top" onClick={closeMenu} aria-label="Perpetua Kilemi home">
        <span className="brand-mark">P<span>.</span></span>
        <span className="brand-name">PERPETUA KILEMI<small>FULL-STACK DEVELOPER · TECHNOLOGY · DATA · DIGITAL INNOVATION</small></span>
      </a>
      <button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#work" onClick={closeMenu}>Work</a><a href="#experience" onClick={closeMenu}>Experience</a><a href="#about" onClick={closeMenu}>About</a><a href="#stack" onClick={closeMenu}>Toolkit</a><a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15}/></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-content">
          <div className="eyebrow"><span className="status-dot"/> FULL-STACK DEVELOPER | TECHNOLOGY · DATA · DIGITAL INNOVATION</div>
          <h1>Building useful<br/><span>digital</span> experiences.</h1>
          <p className="hero-subline">Making technology work better.</p>
          <p className="hero-intro">I’m Perpetua Kilemi, an Information Technology and Business graduate with experience in digital content quality assurance and ICT support. I enjoy working with technology, structured information and practical digital solutions, with hands-on projects spanning web development, databases and data-driven applications.</p>
          <div className="hero-actions"><a href="#work" className="button button-lime">Explore my work <ArrowDownRight size={16}/></a><a className="quiet-link" href="/Perpetua-Kilemi-CV.pdf" download>Download CV <Download size={14}/></a></div>
          <div className="hero-meta"><span>NAIROBI, KENYA</span><span>OPEN TO REMOTE TECHNOLOGY & DATA OPPORTUNITIES <i className="status-dot"/></span></div>
        </div>
        <div className="hero-visual" role="img" aria-label="Abstract green artwork with Perpetua Kilemi initials"><div className="visual-grid"/><div className="visual-ring ring-a"/><div className="visual-ring ring-b"/><div className="visual-orb"><span>PK</span></div><div className="visual-cross cross-a">✳</div><div className="visual-cross cross-b">✳</div><div className="visual-code"><span>01</span> MAKE IT USEFUL</div><div className="visual-stamp">BUILT WITH<br/><b>INTENTION</b></div></div>
        <a className="hero-scroll" href="#work"><span>SCROLL TO EXPLORE</span><span className="scroll-line"/></a>
      </section>

      <div className="marquee" aria-hidden="true"><div className="marquee-track"><span>REACT.JS</span><i>✳</i><span>NODE.JS</span><i>✳</i><span>EXPRESS</span><i>✳</i><span>REST APIS</span><i>✳</i><span>SQL</span><i>✳</i><span>DATA & REPORTING</span><i>✳</i><span>REACT.JS</span><i>✳</i><span>NODE.JS</span><i>✳</i><span>EXPRESS</span><i>✳</i><span>REST APIS</span><i>✳</i><span>SQL</span><i>✳</i><span>DATA & REPORTING</span><i>✳</i></div></div>

      <section className="work-section section-wrap" id="work">
        <div className="section-heading"><div><div className="eyebrow">SELECTED PROJECTS <span className="lime">/ {String(projects.length).padStart(2, '0')}</span></div><h2>Selected <em>work.</em></h2></div><p>Projects across web development,<br/>data and digital product thinking.</p></div>
        <div className="filter-row" role="group" aria-label="Filter projects">{filters.map(item=><button key={item} className={filter===item?'filter active':'filter'} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}{filter===item&&<span className="filter-dot"/>}</button>)}</div>
        {apiLoading && <p className="api-loading" role="status">Loading projects from the portfolio API…</p>}
        {apiError && <p className="api-warning" role="status">Project details could not load. Please make sure the backend is running, then refresh this page.</p>}
        {!apiLoading && !apiError && visibleProjects.length === 0 && <p className="api-loading">No projects match this filter yet.</p>}
        <div className="project-grid">{visibleProjects.map((project,index)=>{const Icon=projectIcons[project.id] || Code2;return <article className="project-card" key={project.id}>
          <div className={'project-art '+(projectTones[project.id] || 'health')}><span className="project-index">{String(index+1).padStart(2,'0')} <i>—</i> PROJECT</span><div className="project-art-lines"/><div className="project-icon"><Icon size={35} strokeWidth={1.25}/></div><div className="project-art-title">{project.name.split(' ').slice(0,4).map((part,i)=><span key={i}>{part}</span>)}</div>{project.repository && <a className="project-open" href={project.repository} target="_blank" rel="noreferrer" aria-label={'Open '+project.name+' GitHub repository'}><ArrowUpRight size={18}/></a>}<span className="project-art-foot">PERPETUA KILEMI · SELECTED WORK</span></div>
          <div className="project-info"><div className="project-category">{project.category}</div><div className="project-title-row"><h3>{project.name}</h3><ArrowRight className="project-arrow" size={18}/></div><p>{project.description}</p>{project.problem && <div className="project-evidence"><b>PROBLEM & APPROACH</b><span>{project.problem}</span></div>}{project.contribution && <div className="project-evidence"><b>IMPLEMENTATION</b><span>{project.contribution}</span></div>}<div className="tech-tags">{project.technologies.map(tech=><span key={tech}>{tech}</span>)}</div>{project.repository ? <a className="case-link" href={project.repository} target="_blank" rel="noreferrer">VIEW PROJECT REPOSITORY <ArrowUpRight size={13}/></a> : <span className="case-link unavailable">DEDICATED REPOSITORY LINK NOT PROVIDED</span>}</div>
        </article>})}</div>
        <p className="project-note">Project descriptions summarise the work and technologies available in the supplied project information. Screenshots, measured outcomes and dataset details can be added when verified project evidence is available.</p>
      </section>

      <section className="experience-section" id="experience"><div className="section-wrap"><div className="section-heading"><div><div className="eyebrow">WHERE I’VE BEEN LEARNING & CONTRIBUTING</div><h2>Experience & <em>education.</em></h2></div><p>A foundation in information technology,<br/>business and digital operations.</p></div>
        <div className="timeline-grid">
          <article className="timeline-card"><div className="timeline-icon"><BriefcaseBusiness size={18}/></div><div className="timeline-body"><div className="timeline-meta">MAY 2025 — PRESENT <span>·</span> NAIROBI / KENYA</div><h3>External Content Digitizer</h3><h4>Open University of Kenya</h4><p>Support the quality and consistency of digital learning content in Moodle before release.</p><ul className="experience-points"><li>Conduct functional and layout quality checks on Moodle learning content.</li><li>Identify broken media links, configuration inconsistencies and access-permission issues.</li><li>Validate learning resources against content and technical guidelines.</li><li>Work with technical coordinators to resolve content and learner-flow issues.</li></ul><div className="tech-tags"><span>Moodle LMS</span><span>Content QA</span><span>Digital learning</span><span>Issue tracking</span></div></div></article>
          <article className="timeline-card"><div className="timeline-icon"><BriefcaseBusiness size={18}/></div><div className="timeline-body"><div className="timeline-meta">ICT ATTACHMENT</div><h3>ICT Support</h3><h4>Agricultural Finance Corporation</h4><p>Gained practical experience supporting day-to-day ICT operations and end users.</p><ul className="experience-points"><li>Assisted with Active Directory user accounts, access support and password resets.</li><li>Supported SQL queries and data-cleaning tasks.</li><li>Troubleshot printers, workstations and common user issues.</li><li>Assisted with systems maintenance and general user support.</li></ul><div className="tech-tags"><span>Active Directory</span><span>SQL</span><span>ICT support</span><span>Troubleshooting</span></div></div></article>
          <article className="timeline-card education-card"><div className="timeline-icon"><GraduationCap size={18}/></div><div className="timeline-body"><div className="timeline-meta">COMPLETED 2025</div><h3>Bachelor of Business Information Technology</h3><h4>Strathmore University</h4><p>Studied the intersection of information systems, technology and business, with project work spanning web applications, databases, analytics and digital solutions.</p><div className="tech-tags"><span>BBIT</span><span>Information systems</span><span>Business technology</span></div></div></article>
        </div>
      </div></section>

      <section className="about-section" id="about"><div className="section-wrap about-layout"><div className="about-side"><div className="eyebrow">A LITTLE ABOUT ME</div><div className="about-quote">Build with care.<br/><em>Ship with purpose.</em></div><div className="about-number">PK<span> / 26</span></div></div><div className="about-copy"><h2>Technology meets <em>business.</em></h2><p>I’m interested in how well-designed systems solve practical problems. My background spans information technology, business processes, digital learning operations and hands-on development projects.</p><p>I enjoy building interfaces, working with APIs and databases, and turning information into something people can use. I’m especially interested in junior opportunities across frontend/full-stack development, application support, data and digital operations.</p><div className="about-facts"><div><span>01</span><b>Practical problem-solving</b></div><div><span>02</span><b>Reliable digital experiences</b></div><div><span>03</span><b>Continuous learning</b></div></div></div></div></section>

      <section className="stack-section section-wrap" id="stack"><div className="section-heading"><div><div className="eyebrow">TOOLS I BUILD WITH</div><h2>My <em>toolkit.</em></h2></div><p>The right tool for the right layer.<br/>Keep the whole product in view.</p></div><div className="stack-grid"><div className="stack-card"><span className="stack-icon"><Code2 size={18}/></span><span className="stack-kicker">01 / PROGRAMMING</span><h3>Code & logic</h3><p>Programming foundations for web applications, data tasks and practical problem-solving.</p><div className="stack-pills"><i>Python</i><i>JavaScript</i><i>SQL</i></div></div><div className="stack-card"><span className="stack-icon"><Terminal size={18}/></span><span className="stack-kicker">02 / WEB DEVELOPMENT</span><h3>Build interfaces & APIs</h3><p>Responsive user interfaces, server-side logic, REST endpoints and API integration.</p><div className="stack-pills"><i>React</i><i>Node.js</i><i>Express</i></div></div><div className="stack-card"><span className="stack-icon"><Database size={18}/></span><span className="stack-kicker">03 / DATA & ANALYTICS</span><h3>Work with information</h3><p>Data preparation, relational queries, analysis workflows and visual reporting.</p><div className="stack-pills"><i>Pandas</i><i>KNIME</i><i>Data analysis</i></div></div><div className="stack-card"><span className="stack-icon"><Globe2 size={18}/></span><span className="stack-kicker">04 / DATABASES</span><h3>Structured data</h3><p>Database-backed applications, SQL queries and relational data concepts.</p><div className="stack-pills"><i>MySQL</i><i>PostgreSQL</i><i>SQLite</i></div></div><div className="stack-card"><span className="stack-icon"><BriefcaseBusiness size={18}/></span><span className="stack-kicker">05 / DIGITAL OPERATIONS</span><h3>Quality & support</h3><p>Digital learning content checks, data validation, user assistance and issue identification.</p><div className="stack-pills"><i>Moodle LMS</i><i>Content QA</i><i>ICT support</i></div></div><div className="stack-card"><span className="stack-icon"><Check size={18}/></span><span className="stack-kicker">06 / TOOLS & WORKFLOW</span><h3>Organise delivery</h3><p>Version control, development environments and practical project workflows.</p><div className="stack-pills"><i>Git</i><i>GitHub</i><i>VS Code</i></div></div></div><p className="skills-footnote">The toolkit reflects technologies and workflows represented in the supplied project and experience information. Add further tools as you gain project evidence you can confidently discuss.</p><div className="ai-interest"><div className="eyebrow">AI & DATA EVALUATION INTERESTS</div><h3>Careful review. Clear feedback. Reliable information.</h3><p>Transferable strengths relevant to AI-assisted and data-quality workflows: structured data review, content accuracy checks, following detailed evaluation guidelines, identifying inconsistencies and communicating clear written feedback. These are areas of applied interest alongside my documented content QA and ICT support experience.</p></div></section>

      <section className="api-section"><div className="section-wrap api-layout"><div className="api-copy"><div className="eyebrow">UNDER THE HOOD · REACT + EXPRESS</div><h2>React on the surface.<br/><em>Node underneath.</em></h2><p>This portfolio uses a real Express API to supply project data and handle contact-form submissions. The technical details are kept concise here so the projects and experience remain the focus.</p><a className="api-endpoint" href="#work"><span className="method">WORK</span> Explore selected projects <ArrowDownRight size={14}/><span className="endpoint-hint">VIEW PROJECTS</span></a></div><div className="api-detail-card"><div className="api-detail-top"><span>API STATUS</span><span className={apiLoading?'api-connecting':apiError?'api-off':'api-online'}><b/> {apiLoading?'CONNECTING':apiError?'OFFLINE':'LIVE'}</span></div><div className="api-detail-intro">The frontend fetches and displays all {projects.length} portfolio projects through the Express API. The raw JSON stays behind the scenes.</div><div className="api-route"><span className="method">GET</span><div><b>/api/portfolio</b><small>Returns project and portfolio data for the React interface.</small></div></div><div className="api-route"><span className="method post">POST</span><div><b>/api/contact</b><small>Validates contact submissions and sends email through Resend when configured.</small></div></div><div className="api-route"><span className="method">GET</span><div><b>/api/health</b><small>Checks whether the backend service is responding.</small></div></div><div className="api-detail-foot"><span><i className="status-dot"/> EXPRESS · REST · SERVER-SIDE VALIDATION</span><span>PROJECT DATA IS API-DRIVEN</span></div></div></div></section>

      <section className="contact-section section-wrap" id="contact"><div className="contact-heading"><div className="eyebrow">HAVE A ROLE, IDEA OR PROJECT IN MIND?</div><h2>Let’s build something<br/><em>considered.</em></h2><p>I’d love to hear about opportunities, collaborations or projects. Send a message directly through the form. Enquiries are routed to my inbox when email delivery is enabled.</p><a className="direct-email" href={`mailto:${CONTACT_EMAIL}`}><Mail size={15}/> {CONTACT_EMAIL} <ArrowUpRight size={13}/></a><div className="contact-location"><MapPin size={14}/> Nairobi, Kenya · Open to remote and hybrid opportunities</div></div>
        <form className="contact-form" onSubmit={submitContact}><div className="form-row"><label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" required minLength="2" maxLength="100" value={form.name} onChange={event=>setForm({...form,name:event.target.value})} placeholder="Name"/></label><label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength="254" value={form.email} onChange={event=>setForm({...form,email:event.target.value})} placeholder="you@example.com"/></label></div><label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength="10" maxLength="4000" rows="5" value={form.message} onChange={event=>setForm({...form,message:event.target.value})} placeholder="A little about the opportunity or project…"/></label><div className="form-bottom"><button className="button button-lime" type="submit" disabled={busy}>{busy?'Sending…':'Send a message'} <ArrowUpRight size={15}/></button><span className={`form-status ${formStatusType}`} role="status" aria-live="polite">{formStatus}</span></div><span className="form-note"><Check size={13}/> Your message is validated by the Node API. Email delivery is handled securely on the server.</span><p className="form-fallback">If the form is temporarily unavailable, email me directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p></form>
      </section>
    </main>

    <footer className="site-footer"><div className="section-wrap footer-content"><a className="brand footer-brand" href="#top"><span className="brand-mark">P<span>.</span></span><span className="brand-name">PERPETUA KILEMI<small>FULL-STACK DEVELOPER · TECHNOLOGY · DATA · DIGITAL INNOVATION</small></span></a><span>DESIGNED & BUILT WITH INTENTION · 2026</span><div className="footer-links"><a href="https://github.com/145449-kilemi" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a><a href="https://www.linkedin.com/in/perpetua-kilemi-78a353306/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a><a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email"><Mail size={17}/></a></div></div></footer>
  </>;
}

export default App;
