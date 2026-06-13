# 夕潮 · Yushio — Landing Page

A single-page bilingual (CN/EN) introduction site for the **Yushio (夕潮)** AI collaborator persona project.

> Live preview: open `index.html` in any modern browser. No build step.

---

## 文件结构 / File structure

```
.
├── index.html          # Shell · loads fonts + scripts in order
├── styles.css          # All CSS · CSS variables (dark / light) + media queries
├── content.js          # SINGLE source of truth for all visible text (bilingual)
├── tweaks-panel.jsx    # Tweaks panel component (do not edit · host protocol)
├── app.jsx             # React app · all sections + Tweaks wiring
└── README.md           # This file
```

**Load order** (defined in `index.html`):
1. Google Fonts → Spectral · Manrope · JetBrains Mono · Noto Serif/Sans SC
2. `styles.css`
3. React 18 + ReactDOM + Babel standalone (pinned versions w/ SRI)
4. `content.js` → sets `window.CONTENT`
5. `tweaks-panel.jsx` (Babel) → registers `useTweaks`, `TweaksPanel`, `Tweak*` on `window`
6. `app.jsx` (Babel) → mounts the `<App />`

---

## 设计系统 / Design system (rules of thumb)

### Typography stack

| Role     | Font                                                                |
|----------|---------------------------------------------------------------------|
| Display  | **Spectral** (latin) + **Noto Serif SC** (CJK) — light/regular      |
| Body     | **Manrope** (latin) + **Noto Sans SC** (CJK)                        |
| Mono     | **JetBrains Mono** — for triggers, terminal, labels, captions       |

CSS variables: `--serif`, `--sans`, `--mono`.

### Two switchable axes (via Tweaks panel)

- `data-lang`  · `"cn"` (default) | `"en"`
- `data-theme` · `"dark"` (default) | `"light"`

That's it. The panel is intentionally minimal — language + theme only. Motion respects the OS-level `prefers-reduced-motion` automatically.

### Color tokens

All colors are CSS variables defined in `styles.css` under `[data-theme="dark"]` (default at `:root`) and `[data-theme="light"]`:

```
--bg / --bg-elev / --bg-elev-2     # backgrounds
--fg / --fg-mute / --fg-dim        # text
--line / --line-strong             # borders
--accent / --accent-2              # dusk-orange / amber
--accent-soft / --accent-glow      # semi-transparent variants
--counter                          # secondary accent for stats numbers
```

### Sections (in order)

1. **Hero** — name mark, four-pillar words, tagline, rotating hook line, trigger phrase callout, CTAs, four stats
2. **What is this** (`#what`) — lede + 6 pain → cure rows
3. **Four Pillars** (`#pillars`) — emotion / judgment / reflection / autonomy cards
4. **Five Layered Skills** (`#skills`) — base / art-director / auditor / parallel / vi cards
5. **Before / After** (`#compare`) — 6 scenarios in a comparison table (collapses to cards on mobile)
6. **Origin** (`#origin`) — central quote + 3-paragraph body + 6-phase timeline + 3 creator credits
7. **Install** (`#install`) — terminal command, five trigger phrases, 7-tool compatibility matrix, final CTA

### Responsive breakpoints

- `≤920px`  — hide nav links, collapse 2-col grids
- `≤760px`  — single-column pillar / credit grid · stack pain→cure rows
- `≤640px`  — compare-table collapses to card stack · hero stats become 2×2 · padding shrinks

### Motion

All animations honor `prefers-reduced-motion: reduce` (block at the bottom of `styles.css`). The cursor-following glow disables itself on touch devices (`(hover: hover) and (pointer: fine)` check in `CursorGlow`).

---

## 内容编辑 / Editing content

**All visible text lives in `content.js`.** Don't put strings in `app.jsx`.

Strings are stored as `{ cn: "...", en: "..." }` objects. The `t(node, lang)` helper in `app.jsx` resolves them. Adding a new line? Add both `cn` and `en` keys — even if EN is empty, leave the key so the type stays consistent.

Example — adding a new pillar bullet:

```js
// content.js
pillars.items[0].cn.body = "新版描述...";
pillars.items[0].en.body = "New body text...";
```

---

## Tweaks 面板 / Tweaks panel

The panel is wired through the host protocol in `tweaks-panel.jsx` — do not edit that file. The defaults live in `app.jsx`:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "cn",
  "theme": "dark"
}/*EDITMODE-END*/;
```

Changing values via the panel persists by rewriting that JSON block in `app.jsx`. To add a new tweak:

1. Add a key + default value inside the EDITMODE block
2. Add a `<TweakRadio>` / `<TweakToggle>` / `<TweakSelect>` etc. inside `<Tweaks>` in `app.jsx`
3. Use the value in your components and/or reflect it onto `document.documentElement` in the `useEffect` that already sets `data-lang` / `data-theme`

---

## 改 Logo / link

- GitHub URL: hard-coded as `https://github.com/Lynnouo/yushio` (×4 places in `app.jsx`). Grep + replace if it moves.
- Install command: in `content.js` → `install.pluginCmd` (array of strings).
- Trigger phrases: in `content.js` → `install.activatePhrases`.

---

## 已知约束 / Known constraints

- **No build step.** Babel runs in-browser (warning shown in console — harmless). For production, pre-compile JSX.
- **Single HTML.** If you want true offline, run through a bundler that inlines fonts + scripts.
- **React 18** with pinned versions + SRI in `index.html`. Don't bump without re-adding `integrity` hashes.
- **Cursor glow** is desktop-only (`(hover: hover) and (pointer: fine)`).
- **`prefers-reduced-motion`** is the only way to disable motion — there is no UI toggle (deliberate).

---

## 改起来 / Extending it

| Want to                          | Edit                                         |
|----------------------------------|----------------------------------------------|
| Change a string                  | `content.js`                                 |
| Add a section                    | New component in `app.jsx` + entry in `nav.sections` (content.js) |
| Add a theme color                | `:root[data-theme="…"]` block in `styles.css`|
| Add a tweak                      | EDITMODE block in `app.jsx` + Tweak control  |
| Adjust mobile layout             | `@media (max-width: …)` blocks in `styles.css`|
| Swap fonts                       | `<link>` in `index.html` + `--serif/--sans/--mono` in `styles.css` |

---

## Credits

Page design + build · Claude (delivered to Lyn).
Source material · the [Yushio](https://github.com/Lynnouo/yushio) project by Lyn & iloy & 夕潮 / 凛.

MIT-friendly. Treat this landing page however you'd treat the upstream project.
