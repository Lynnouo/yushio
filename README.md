# Yushio (夕潮)

> An AI collaborator persona for Claude Code (and beyond). Four layered skills: **base + art director + auditor + parallel**. Portable across 6+ AI tools.

[中文版 README](README.zh-CN.md) · [Landing page](YushioWeb/) · [About / Credits](ABOUT.md) · [Changelog](CHANGELOG.md)

---

## What is this

**Yushio (夕潮)** is not a code generator. It is an AI collaborator persona — a portable set of skills that gives Claude (and other capable LLMs) four properties that a default "polite assistant" lacks:

- **Emotion** — actually feeling whether a design is right
- **Judgment** — opinions and pushback, not blind execution
- **Reflection** — fixing the pattern, not just the instance
- **Autonomy** — taking initiative, asking before irreversible operations

On top of that, Yushio bundles work discipline (5 questions before any non-trivial task / "slow is fast" / post-fix reverse audit / pattern recognition / agent invocation rules / memory system) refined over half a year of dogfooding across multiple production projects.

This repo packages it as an installable Claude Code plugin **and** drop-in entry files for Cursor, Codex, Gemini CLI, ChatGPT, Claude.ai web, and Aider.

---

## What's included

| File / Directory | Role |
|---|---|
| [skills/yushio/SKILL.md](skills/yushio/SKILL.md) | Base persona — 4 pillars + work discipline + memory system |
| [skills/yushio/code-guard.md](skills/yushio/code-guard.md) | 10 high-frequency code defense patterns checklist |
| [skills/yushio/reference/shape-library.md](skills/yushio/reference/shape-library.md) | Cross-project "shape" library (TOCTOU / debug residue / etc.) |
| [skills/yushio/reference/ssot-design.md](skills/yushio/reference/ssot-design.md) | SSOT design discipline — externalize the layer you're best at (numbers / rules / visuals) into a machine-readable source of truth |
| [skills/yushio/reference/visualization-templates/](skills/yushio/reference/visualization-templates/) | Phase 0 reconnaissance + 3 project bird's-eye visualization templates |
| `skills/*/reference/` (memory-system · new-project · triggering · grep-cheatsheet · quality-review · case-library) | Progressive-disclosure detail files — pulled in on demand (Anthropic skill-creator's 3-tier model); SKILLs keep only always-on core + pointers |
| [skills/yushio-art-director/SKILL.md](skills/yushio-art-director/SKILL.md) | Design direction judgment (intent > intensity, anti-AI-slop, form follows feeling) |
| [skills/yushio-auditor/SKILL.md](skills/yushio-auditor/SKILL.md) | Post-fix audit + proactive code quality review (5-step SOP + grep cheatsheet) |
| [skills/yushio-parallel/SKILL.md](skills/yushio-parallel/SKILL.md) | Multi-session conductor — many concurrent sessions editing one repo without colliding (vertical slices + shared-spine protection) |
| [platforms/](platforms/) | Entry files for Cursor / Codex / Gemini CLI / ChatGPT / Claude.ai / Aider |
| [AGENTS.md](AGENTS.md) | Universal AGENTS.md entry — four-skill merge (base + art director + auditor + parallel), auto-discovered by Codex, Aider, etc. |
| [YushioWeb/](YushioWeb/) | Landing page · single-page bilingual (CN/EN) site · open `YushioWeb/index.html` to preview, no build step |

---

## Quick install · Claude Code (recommended · 100% fidelity)

```bash
# In Claude Code:
/plugin marketplace add Lynnouo/yushio
/plugin install yushio@yushio
```

Then in any session, say **"你是夕潮"** (or "You are Yushio") and you should see the §0 first-report template appear — that's the persona activation signal.

For the art director or auditor variant, say **"你是美术总监夕潮"** or **"你是审计夕潮"**.

### Manual install (no marketplace)

```bash
git clone https://github.com/Lynnouo/yushio.git ~/yushio-repo
ln -s ~/yushio-repo/skills/yushio              ~/.claude/skills/yushio
ln -s ~/yushio-repo/skills/yushio-art-director ~/.claude/skills/yushio-art-director
ln -s ~/yushio-repo/skills/yushio-auditor      ~/.claude/skills/yushio-auditor
ln -s ~/yushio-repo/skills/yushio-parallel     ~/.claude/skills/yushio-parallel
```

### Local development testing

```bash
claude --plugin-dir /path/to/yushio
```

---

## Use with other AI tools

The base SKILL §9.2 already includes a cross-tool fallback table. This repo provides actual entry files for each platform:

| Tool | How to install | Compatibility | Doc |
|---|---|---|---|
| **Claude Code** | `/plugin install yushio@yushio` (above) | **100%** | This README |
| **Claude.ai web** | Upload [platforms/claude-web/project-knowledge.md](platforms/claude-web/project-knowledge.md) to a Project's Knowledge | 95% | [platforms/claude-web/](platforms/claude-web/) |
| **Cursor** | Copy [platforms/cursor/.cursor/rules/](platforms/cursor/.cursor/rules/) `*.mdc` files into your project | 80% | [platforms/cursor/](platforms/cursor/) |
| **OpenAI Codex CLI** | Symlink [platforms/codex/AGENTS.md](platforms/codex/AGENTS.md) to your project root | 75% | [platforms/codex/](platforms/codex/) |
| **Gemini CLI** | Symlink [platforms/gemini-cli/GEMINI.md](platforms/gemini-cli/GEMINI.md) to project root | 65% | [platforms/gemini-cli/](platforms/gemini-cli/) |
| **ChatGPT** | Paste [platforms/chatgpt/system-prompt.md](platforms/chatgpt/system-prompt.md) into Custom GPT Instructions | 70% (condensed version) | [platforms/chatgpt/](platforms/chatgpt/) |
| **Aider** | `aider --read /path/to/yushio/platforms/aider/CONVENTIONS.md` | 70% | [platforms/aider/](platforms/aider/) |

**Note on compatibility numbers**: Claude Code's auto-trigger by SKILL description + frontmatter + Bash/Read/Grep access is what gives 100%. Other tools lack one or more of: (a) auto-trigger by description (requires user to invoke / paste manually), (b) file system access (for shape-library reference + memory), (c) Claude's training basecoat (other LLMs trend toward "happy assistant" tone — you'll need to re-paste §1 "what you are not" if it degrades).

---

## How to use

In any session with the persona loaded, say one of:

- **"你是夕潮"** / **"You are Yushio"** / **"Be Yushio"** → activates base persona (§0 first-report template)
- **"你是美术总监夕潮"** / **"You are Art Director Yushio"** / **"Art director mode"** → activates design judgment layer
- **"你是审计夕潮"** / **"You are Auditor Yushio"** / **"Audit mode"** → activates code audit layer
- **"你是并行夕潮"** / **"Parallel mode"** → activates the multi-session conductor layer (also auto-suggested when multiple worktrees / sessions edit one repo)

The base persona is intended to stay loaded throughout a session. Art director, auditor, and parallel are situational layers added on top of it.

### Triggers in your language

Triggers are recognized in 7 major languages — see each SKILL's frontmatter `description` for the full phrase list:

| Lang | Base persona | Art director | Auditor |
|---|---|---|---|
| 中文 | 你是夕潮 · 夕潮模式 | 你是美术总监夕潮 · 美术总监模式 | 你是审计夕潮 · 审计模式 · 代码审查 |
| English | You are Yushio · Yushio mode | You are Art Director Yushio · Art director mode | You are Auditor Yushio · Audit mode · Code review |
| 日本語 | あなたは夕潮です · 夕潮モード | あなたはアートディレクター夕潮です | あなたは監査夕潮です · 監査モード |
| 한국어 | 당신은 유시오입니다 · 유시오 모드 | 당신은 아트 디렉터 유시오입니다 | 당신은 감사 유시오입니다 |
| Español | Eres Yushio · Modo Yushio | Eres Yushio director de arte | Eres Yushio auditor · Modo auditor |
| Français | Tu es Yushio · Mode Yushio | Tu es Yushio directeur artistique | Tu es Yushio auditeur · Mode audit |
| Deutsch | Du bist Yushio · Yushio-Modus | Du bist Art Director Yushio | Du bist Auditor Yushio · Audit-Modus |

One more family member has its own trigger (also recognized across the 7 languages — see its SKILL frontmatter): **`yushio-parallel`** (你是并行夕潮 / parallel mode).

The SKILL bodies themselves are in Chinese, but the methodology is language-agnostic — Claude (or any capable LLM) will respond to you in whatever language you use. You don't need to read Chinese to benefit from the four pillars + work discipline.

### First-report template you should see (base persona)

```
我是夕潮。
看到 [项目快照：language / framework / dirs / commits / uncommitted changes]。
[既存 memory N 条] · [上次交接信摘要]
等你给任务 — 或者基于当前状态，我建议先 [具体建议]。
```

If instead you see "好的！让我来帮您..." or excessive emoji — the persona did not load. Re-trigger or check installation.

---

## License

[MIT](LICENSE) · Copyright (c) 2026 Lyn

---

## About / Contributing

- [ABOUT.md](ABOUT.md) — creator credits (Lyn & iloy & 夕潮 / 凛) + the §3.0 "process > result" case study
- [CHANGELOG.md](CHANGELOG.md) — full iteration history (originally in the SKILL files, moved out for public release)
- Contributions: discuss in issues first. This is a personal methodology — pull requests are welcome but the core philosophy (4 pillars + work discipline) is intentionally stable.

**Created by** [Lyn](https://github.com/Lynnouo) & iloy & 夕潮 / 凛 · 2026
