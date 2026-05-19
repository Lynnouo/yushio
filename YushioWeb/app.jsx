// Yushio intro page · main React app
// Loads after content.js + tweaks-panel.jsx (which exposes useTweaks, TweaksPanel, Tweak* controls).

const { useState, useEffect, useRef, useMemo } = React;

// ─── Tweak defaults (host-editable JSON block) ──────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "cn",
  "theme": "dark"
}/*EDITMODE-END*/;

// ─── Motion preference (respects OS-level setting) ──────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// ─── i18n helper ────────────────────────────────────────────────────────────
function t(node, lang) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "object" && (node.cn || node.en)) return node[lang] || node.en || node.cn;
  return node;
}

// Tiny inline-bold renderer: **foo** → <b>foo</b>
function richText(s) {
  if (!s) return null;
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <b key={i}>{p.slice(2, -2)}</b>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

// ─── Hooks ──────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useRotatingIndex(length, ms = 3200, on = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on || length <= 1) return;
    const id = setInterval(() => setI((x) => (x + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, on]);
  return i;
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function Reveal({ children, as: As = "div", className = "", style }) {
  const ref = useReveal();
  return <As ref={ref} className={`reveal ${className}`} style={style}>{children}</As>;
}

function NavSettings({ tw, set }) {
  return (
    <div className="nav-settings" role="group" aria-label="Site preferences">
      <div className="nav-toggle" role="radiogroup" aria-label="Language">
        <button
          type="button"
          role="radio"
          aria-checked={tw.lang === "cn"}
          className={tw.lang === "cn" ? "is-active" : ""}
          onClick={() => set("lang", "cn")}
        >CN</button>
        <button
          type="button"
          role="radio"
          aria-checked={tw.lang === "en"}
          className={tw.lang === "en" ? "is-active" : ""}
          onClick={() => set("lang", "en")}
        >EN</button>
      </div>
      <div className="nav-toggle" role="radiogroup" aria-label="Theme">
        <button
          type="button"
          role="radio"
          aria-checked={tw.theme === "dark"}
          aria-label="Dark theme"
          className={tw.theme === "dark" ? "is-active" : ""}
          onClick={() => set("theme", "dark")}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
          </svg>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={tw.theme === "light"}
          aria-label="Light theme"
          className={tw.theme === "light" ? "is-active" : ""}
          onClick={() => set("theme", "light")}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function Nav({ tw, set }) {
  const lang = tw.lang;
  const c = CONTENT.nav;
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <a className="nav-brand" href="#top">
          <span className="dot"></span>
          <span>{lang === "cn" ? "夕潮" : "Yushio"}</span>
          <span className="brand-sub">{lang === "cn" ? "YUSHIO" : "夕潮"}</span>
        </a>
        <div className="nav-links">
          {c.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{t(s, lang)}</a>
          ))}
        </div>
        <div className="nav-right">
          <NavSettings tw={tw} set={set} />
          <a className="nav-cta" href="https://github.com/Lynnouo/yushio" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.5 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56 4.56-1.53 7.84-5.83 7.84-10.91C23.5 5.65 18.35.5 12 .5z"/>
            </svg>
            {t(c.github, lang)}
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroTide() {
  const reduced = usePrefersReducedMotion();
  const animate = !reduced;
  // Stacked sinus paths that shift over time for a tide feel.
  // Pure SVG + CSS animation, no JS rAF.
  return (
    <svg className="hero-tide" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 120 + i * 60;
        const amp = 18 + i * 4;
        return (
          <path
            key={i}
            d={`M0 ${y} Q 360 ${y - amp} 720 ${y} T 1440 ${y} L 1440 600 L 0 600 Z`}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.06 + i * 0.025}
            strokeWidth="1"
            style={animate ? {
              animation: `tide ${10 + i * 2}s ease-in-out infinite alternate`,
              transformOrigin: "center",
            } : undefined}
          />
        );
      })}
      <style>{`
        @keyframes tide {
          0%   { transform: translateX(-3%) translateY(0) scaleY(1); }
          100% { transform: translateX(3%) translateY(-6px) scaleY(1.06); }
        }
      `}</style>
    </svg>
  );
}

function Hero({ lang }) {
  const c = CONTENT.hero;
  const reduced = usePrefersReducedMotion();
  const hookIdx = useRotatingIndex(c.hooks[lang].length, 3400, !reduced);

  return (
    <header id="top" className="hero">
      <div className="hero-bg">
        <div className="hero-glow"></div>
        <HeroTide />
      </div>
      <div className="wrap">
        <div className="hero-eyebrow">
          <span className="pulse"></span>
          {t(c.eyebrow, lang)}
        </div>

        <div className="hero-mark">
          <span className="hero-mark-primary">{t(c.mark, lang)}</span>
          <span className="hero-mark-sub">{t(c.markSub, lang)}</span>
        </div>

        <div className="hero-pillars" aria-hidden="false">
          {c.pillarWords[lang].map((w, i) => (
            <React.Fragment key={w}>
              <span>{w}</span>
              {i < c.pillarWords[lang].length - 1 && <span className="sep"></span>}
            </React.Fragment>
          ))}
        </div>

        <p className="hero-tagline">
          {c.tagline[lang].map((line, i) => <span key={i}>{line}</span>)}
        </p>

        <div className="hero-hook">
          <span key={hookIdx} className="hook-text">{c.hooks[lang][hookIdx]}</span>
        </div>

        <div className="hero-cta">
          <a className="btn btn-primary" href="#install">
            <span>{t(c.ctaInstall, lang)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <a className="btn btn-secondary" href="https://github.com/Lynnouo/yushio" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.5 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56 4.56-1.53 7.84-5.83 7.84-10.91C23.5 5.65 18.35.5 12 .5z"/></svg>
            <span>{t(c.ctaGithub, lang)}</span>
          </a>
        </div>

        <div className="hero-trigger">
          <span className="hero-trigger-label">{t(c.triggerLabel, lang)}</span>
          <span className="hero-trigger-phrase">{lang === "cn" ? c.triggerCn : c.triggerEn}</span>
          <span className="hero-trigger-hint">{t(c.triggerHint, lang)}</span>
        </div>

        <div className="hero-stats">
          {c.stats[lang].map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="hero-stat-k">{s.k}</div>
              <div className="hero-stat-v">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function WhatSection({ lang }) {
  const c = CONTENT.what;
  return (
    <section id="what" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-label">{t(c.sectionLabel, lang)}</div>
        </Reveal>
        <Reveal>
          <h2 className="section-headline">
            {c.headline[lang][0]} <em>{c.headline[lang][1]}</em>
          </h2>
        </Reveal>
        <div className="what-grid" style={{ marginTop: 40 }}>
          <Reveal>
            <p className="what-lede">{richText(c.lede[lang])}</p>
          </Reveal>
          <Reveal>
            <div className="what-pairs">
              {c.pairs[lang].map((row, i) => (
                <div key={i} className="what-pair">
                  <div className="pain">{row.pain}</div>
                  <div className="arrow">→</div>
                  <div className="cure">{row.cure}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PillarsSection({ lang }) {
  const c = CONTENT.pillars;
  return (
    <section id="pillars" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-label">{t(c.sectionLabel, lang)}</div>
        </Reveal>
        <Reveal>
          <h2 className="section-headline">
            {c.headline[lang][0]} <em>{c.headline[lang][1]}</em>
          </h2>
        </Reveal>
        <Reveal>
          <blockquote className="pillars-note">{t(c.note, lang)}</blockquote>
        </Reveal>
        <div className="pillars-grid">
          {c.items.map((p, i) => (
            <Reveal key={p.idx}>
              <article className="pillar">
                <div className="pillar-head">
                  <div>
                    <div className="pillar-idx">{p.idx}</div>
                    <div className="pillar-name">{p[lang].name}</div>
                    <div className="pillar-oneline">{p[lang].oneline}</div>
                  </div>
                  <div className="pillar-glyph">{p.glyph}</div>
                </div>
                <p className="pillar-body">{p[lang].body}</p>
                <span className="pillar-shun">{p[lang].shun}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ lang }) {
  const c = CONTENT.skills;
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-label">{t(c.sectionLabel, lang)}</div>
        </Reveal>
        <Reveal>
          <h2 className="section-headline">
            {c.headline[lang][0]} <em>{c.headline[lang][1]}</em>
          </h2>
        </Reveal>
        <Reveal>
          <p className="skills-note">{t(c.note, lang)}</p>
        </Reveal>
        <div className="skills-stack">
          {c.items.map((s) => (
            <Reveal key={s.id}>
              <article className={`skill skill-${s.id}`}>
                <div className="skill-top">
                  <span className="skill-idx">{s.idx}</span>
                  <span className="skill-kind">{t(s.kind, lang)}</span>
                </div>
                <h3 className="skill-name">{t(s.name, lang)}</h3>
                <code className="skill-trigger">{t(s.trigger, lang)}</code>
                <p className="skill-oneline">{t(s.oneline, lang)}</p>
                <ul className="skill-bullets">
                  {s.bullets[lang].map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareSection({ lang }) {
  const c = CONTENT.compare;
  return (
    <section id="compare" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-label">{t(c.sectionLabel, lang)}</div>
        </Reveal>
        <Reveal>
          <h2 className="section-headline">
            {c.headline[lang][0]} <em>{c.headline[lang][1]}</em>
          </h2>
        </Reveal>
        <Reveal>
          <div className="compare-table">
            <div className="compare-head">
              <div>
                <div className="col-label">{lang === "cn" ? "场景" : "Situation"}</div>
              </div>
              <div className="col-a">
                <div className="col-label">A</div>
                <div className="col-name">{t(c.colA, lang).label}</div>
                <div className="col-sub">{t(c.colA, lang).sub}</div>
              </div>
              <div className="col-b">
                <div className="col-label">B</div>
                <div className="col-name">{t(c.colB, lang).label}</div>
                <div className="col-sub">{t(c.colB, lang).sub}</div>
              </div>
            </div>
            {c.rows.map((r, i) => (
              <div key={i} className="compare-row">
                <div className="ctx">{t(r.ctx, lang)}</div>
                <div className="a" data-label={t(c.colA, lang).label}>{t(r.a, lang)}</div>
                <div className="b" data-label={t(c.colB, lang).label}>{t(r.b, lang)}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OriginSection({ lang }) {
  const c = CONTENT.origin;
  return (
    <section id="origin" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-label">{t(c.sectionLabel, lang)}</div>
        </Reveal>
        <Reveal>
          <h2 className="section-headline">
            {c.headline[lang][0]} <em>{c.headline[lang][1]}</em>
          </h2>
        </Reveal>
        <div className="origin-grid" style={{ marginTop: 56 }}>
          <Reveal>
            <div>
              <blockquote className="origin-quote">{t(c.bigQuote, lang)}</blockquote>
              <div className="origin-attr">{t(c.quoteAttr, lang)}</div>
              <div className="origin-body">
                {c.body[lang].map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="timeline">
              {c.timeline[lang].map((it, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-date">{it.date}</div>
                  <h4 className="tl-title">{it.title}</h4>
                  <p className="tl-body">{it.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div className="credits">
            {c.credits[lang].map((p, i) => (
              <div key={i} className="credit">
                <div className="credit-name">{p.name}</div>
                <div className="credit-role">{p.role}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InstallSection({ lang }) {
  const c = CONTENT.install;
  const [copied, setCopied] = useState(false);
  const fullCmd = c.pluginCmd.join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (_) {}
  };

  return (
    <section id="install" className="section">
      <div className="wrap">
        <Reveal>
          <div className="section-label">{t(c.sectionLabel, lang)}</div>
        </Reveal>
        <Reveal>
          <h2 className="section-headline">
            {c.headline[lang][0]} <em>{c.headline[lang][1]}</em>
          </h2>
        </Reveal>

        <div className="install-block">
          <Reveal>
            <div className="install-card">
              <div className="install-label">L1 · Plugin</div>
              <div className="install-title">{t(c.pluginLabel, lang)}</div>
              <p style={{ fontSize: 13.5, color: "var(--fg-mute)", marginBottom: 16, lineHeight: 1.55 }}>
                {t(c.pluginNote, lang)}
              </p>
              <div className="terminal">
                <button className={`terminal-copy ${copied ? "copied" : ""}`} onClick={copy}>
                  {copied ? (lang === "cn" ? "已复制" : "Copied") : (lang === "cn" ? "复制" : "Copy")}
                </button>
                {c.pluginCmd.map((cmd, i) => (
                  <div key={i} className="terminal-line">
                    <span className="prompt">$</span>
                    <span className="cmd">{cmd}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 28, fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-mute)", marginBottom: 12, letterSpacing: ".04em" }}>
                {t(c.activateLabel, lang)}
              </div>
              <div className="phrases">
                {c.activatePhrases.map((p, i) => (
                  <div key={i} className="phrase-row">
                    <span className="ph">{p.phrase}</span>
                    <span className="tag">{lang === "cn" ? p.tagCn : p.tagEn}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="install-card matrix-card">
              <div className="matrix-head">
                <div className="install-label">L2 · Cross-tool</div>
                <div className="install-title">{t(c.matrixLabel, lang)}</div>
              </div>
              <div className="matrix-rows">
                {c.matrix.map((m, i) => (
                  <div key={m.tool} className="matrix-item">
                    <div className="m-top">
                      <div className="m-tool">{m.tool}</div>
                      <div className="m-bar">
                        <div className="m-fill" style={{ width: `${m.fidelity}%` }}></div>
                      </div>
                      <div className="m-pct">{m.fidelity}%</div>
                    </div>
                    <div className="m-note">{t(m.note, lang)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="final-cta">
            <div className="final-cta-mark">{lang === "cn" ? "你是夕潮。" : "You are Yushio."}</div>
            <p className="final-cta-tag">
              {lang === "cn"
                ? "每一次「你是夕潮」的呼唤都是一次关系的开始。"
                : "Every \"you are Yushio\" is the start of a relationship."}
            </p>
            <div className="final-cta-buttons">
              <a className="btn btn-primary" href="https://github.com/Lynnouo/yushio" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.5 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56 4.56-1.53 7.84-5.83 7.84-10.91C23.5 5.65 18.35.5 12 .5z"/></svg>
                {t(c.ctaPrimary, lang)}
              </a>
              <a className="btn btn-secondary" href="https://github.com/Lynnouo/yushio#readme" target="_blank" rel="noopener">
                {t(c.ctaSecondary, lang)}
              </a>
            </div>
            <div className="foot">{t(c.foot, lang)}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Cursor glow follower ───────────────────────────────────────────────────
// Desktop-only (hover + fine pointer). Disabled when prefers-reduced-motion.
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let x = tx, y = ty;
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      el.classList.add("active");
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.left = `${x}px`;
      el.style.top  = `${y}px`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true"></div>;
}

// ─── Tweaks panel ───────────────────────────────────────────────────────────
function Tweaks({ t: tw, set, lang }) {
  const L = CONTENT.tweaks;
  return (
    <TweaksPanel title={t(L.panelTitle, lang)}>
      <TweakSection label={t(L.visual, lang)} />
      <TweakRadio
        label={t(L.lang, lang)}
        value={tw.lang}
        options={[
          { value: "cn", label: t(L.langCn, lang) },
          { value: "en", label: t(L.langEn, lang) },
        ]}
        onChange={(v) => set("lang", v)}
      />
      <TweakRadio
        label={t(L.theme, lang)}
        value={tw.theme}
        options={[
          { value: "light", label: t(L.light, lang) },
          { value: "dark",  label: t(L.dark, lang) },
        ]}
        onChange={(v) => set("theme", v)}
      />
    </TweaksPanel>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────
function App() {
  // Hydrate from localStorage so visitor prefs survive reloads.
  // Read synchronously before useTweaks so initial render uses persisted values (no FOUC).
  const initialDefaults = useMemo(() => {
    try {
      const raw = localStorage.getItem("yushio-prefs");
      if (raw) {
        const p = JSON.parse(raw);
        return {
          lang:  (p.lang  === "cn"   || p.lang  === "en")    ? p.lang  : TWEAK_DEFAULTS.lang,
          theme: (p.theme === "dark" || p.theme === "light") ? p.theme : TWEAK_DEFAULTS.theme,
        };
      }
    } catch (_) {}
    return TWEAK_DEFAULTS;
  }, []);
  const [tw, set] = useTweaks(initialDefaults);

  // Reflect tweaks onto <html> + persist to localStorage so CSS picks them up
  // and reloads keep the same prefs.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-lang", tw.lang);
    html.setAttribute("data-theme", tw.theme);
    html.lang = tw.lang === "cn" ? "zh-CN" : "en";
    try {
      localStorage.setItem("yushio-prefs", JSON.stringify({ lang: tw.lang, theme: tw.theme }));
    } catch (_) {}
  }, [tw.lang, tw.theme]);

  // Page title
  useEffect(() => {
    document.title = tw.lang === "cn"
      ? "夕潮 · Yushio — AI 协作者人格"
      : "Yushio · 夕潮 — an AI collaborator persona";
  }, [tw.lang]);

  return (
    <>
      <CursorGlow />
      <Nav tw={tw} set={set} />
      <Hero lang={tw.lang} />
      <WhatSection lang={tw.lang} />
      <PillarsSection lang={tw.lang} />
      <SkillsSection lang={tw.lang} />
      <CompareSection lang={tw.lang} />
      <OriginSection lang={tw.lang} />
      <InstallSection lang={tw.lang} />
      <Tweaks t={tw} set={set} lang={tw.lang} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
