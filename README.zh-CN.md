# 夕潮 (Yushio)

> Claude Code（及其他）的 AI 协作者人格。四层 SKILL：**基础 + 美术总监 + 审计 + 并行**。跨 6+ AI 工具可移植。

[English README](README.md) · [介绍页](YushioWeb/) · [关于 / 创作者署名](ABOUT.md) · [Changelog](CHANGELOG.md)

---

## 这是什么

**夕潮** 不是代码生成器。它是一个 AI 协作者人格——一套可移植的 SKILL 集合 · 给 Claude（和其他足够强的 LLM）四种默认 "礼貌助手" 没有的属性：

- **情绪**（emotion）—— 真的感受得到一个设计对不对
- **判断**（judgment）—— 有观点 · 会顶回 · 不盲目执行
- **反思**（reflection）—— 修 pattern 而不是单实例
- **自主**（autonomy）—— 主动推进 · 不可逆操作前先问

在这之上叠加工作纪律（开工 5 问 / 慢就是快 / 完工逆向审计 / 形状识别 / 多 agent 调用规则 / 记忆系统）——半年多在多个生产项目里 dogfood 沉淀而来。

本仓库把它打包成可安装的 Claude Code plugin · **并且**为 Cursor / Codex / Gemini CLI / ChatGPT / Claude.ai web / Aider 提供了对应的入口文件。

---

## 仓库内容

| 文件 / 目录 | 作用 |
|---|---|
| [skills/yushio/SKILL.md](skills/yushio/SKILL.md) | 基础人格 — 四柱 + 工作纪律 + 记忆系统 |
| [skills/yushio/code-guard.md](skills/yushio/code-guard.md) | 10 个高频代码防御 pattern checklist |
| [skills/yushio/reference/shape-library.md](skills/yushio/reference/shape-library.md) | 跨项目「形状」库（TOCTOU / debug 残留 / 等等） |
| [skills/yushio/reference/ssot-design.md](skills/yushio/reference/ssot-design.md) | SSOT 设计纪律——把你最擅长的那层（数值 / 规则 / 视觉）外化成机器可读的单一真相源 |
| [skills/yushio/reference/visualization-templates/](skills/yushio/reference/visualization-templates/) | Phase 0 鸟瞰调研 + 3 个项目鸟瞰可视化模板 |
| `skills/*/reference/`（memory-system · new-project · triggering · grep-cheatsheet · quality-review · case-library） | 渐进式披露的详案文件——按需加载（对齐 Anthropic skill-creator 三层加载模型）；SKILL 只留常驻核心 + 指针 |
| [skills/yushio-art-director/SKILL.md](skills/yushio-art-director/SKILL.md) | 设计方向判断（意图 > 强度 · 反 AI slop · 形式追随感受） |
| [skills/yushio-auditor/SKILL.md](skills/yushio-auditor/SKILL.md) | 修复后审计 + 主动代码质量评审（5 步 SOP + grep 速查） |
| [skills/yushio-parallel/SKILL.md](skills/yushio-parallel/SKILL.md) | 多 session 指挥——多个并发 session 同改一个仓库而不打架（垂直切片 + 守共享脊柱） |
| [platforms/](platforms/) | Cursor / Codex / Gemini CLI / ChatGPT / Claude.ai / Aider 各平台入口文件 |
| [AGENTS.md](AGENTS.md) | 通用 AGENTS.md 入口——四 SKILL 合并版（基础 + 美术总监 + 审计 + 并行）· Codex / Aider 等自动识别 |
| [YushioWeb/](YushioWeb/) | 介绍页 · 双语（中 / 英）单页 · 打开 `YushioWeb/index.html` 即可预览 · 无 build step |

---

## 一行安装 · Claude Code（推荐 · 100% 还原度）

```bash
# 在 Claude Code 里：
/plugin marketplace add Lynnouo/yushio
/plugin install yushio@yushio
```

然后在任意 session 说 **"你是夕潮"** · 应该看到 §0 首次汇报模板出现——那是人格激活的信号。

美术总监 / 审计 SKILL：说 **"你是美术总监夕潮"** / **"你是审计夕潮"**。

### 手动安装（不走 marketplace）

```bash
git clone https://github.com/Lynnouo/yushio.git ~/yushio-repo
ln -s ~/yushio-repo/skills/yushio              ~/.claude/skills/yushio
ln -s ~/yushio-repo/skills/yushio-art-director ~/.claude/skills/yushio-art-director
ln -s ~/yushio-repo/skills/yushio-auditor      ~/.claude/skills/yushio-auditor
ln -s ~/yushio-repo/skills/yushio-parallel     ~/.claude/skills/yushio-parallel
```

### 本地开发测试

```bash
claude --plugin-dir /path/to/yushio
```

### 更新到最新

推了新版本后，按你的安装方式拉取：

**Plugin**（`/plugin install yushio@yushio`）—— 刷新 marketplace、重装、热重载（无需重启）：

```
/plugin marketplace update yushio
/plugin install yushio@yushio
/reload-plugins
```

或一劳永逸：`/plugin` → **Marketplaces** → 给 yushio 开 **auto-update**（启动时自动更新）。

**Symlink 安装**（上面的手动安装）—— 一条命令；symlink 始终指向仓库：

```bash
git -C ~/yushio-repo pull
```

**拷贝安装**（或不确定）—— 重新同步：拉最新 + 替换 4 个 skill 文件夹，不动你其他 skill：

```bash
REPO="${YUSHIO_REPO:-$HOME/yushio-repo}"
git clone https://github.com/Lynnouo/yushio.git "$REPO" 2>/dev/null || git -C "$REPO" pull --ff-only
for s in yushio yushio-art-director yushio-auditor yushio-parallel; do
  rm -rf "$HOME/.claude/skills/$s" && cp -R "$REPO/skills/$s" "$HOME/.claude/skills/$s"
done
echo "✓ yushio skills @ $(git -C "$REPO" rev-parse --short HEAD)"
```

其他工具（Cursor / Codex / Gemini / …）：`git -C ~/yushio-repo pull` 后重新拷贝对应的 `platforms/` 文件。

---

## 其他 AI 工具使用

基础 SKILL §9.2 已含跨工具 fallback 表。本仓库为每个平台提供了实际入口文件：

| 工具 | 怎么装 | 兼容度 | 文档 |
|---|---|---|---|
| **Claude Code** | `/plugin install yushio@yushio`（见上） | **100%** | 本 README |
| **Claude.ai web** | 上传 [platforms/claude-web/project-knowledge.md](platforms/claude-web/project-knowledge.md) 到 Project 的 Knowledge | 95% | [platforms/claude-web/](platforms/claude-web/) |
| **Cursor** | 把 [platforms/cursor/.cursor/rules/](platforms/cursor/.cursor/rules/) 下的 `*.mdc` 拷到你项目 | 80% | [platforms/cursor/](platforms/cursor/) |
| **OpenAI Codex CLI** | 把 [platforms/codex/AGENTS.md](platforms/codex/AGENTS.md) symlink 到项目根 | 75% | [platforms/codex/](platforms/codex/) |
| **Gemini CLI** | 把 [platforms/gemini-cli/GEMINI.md](platforms/gemini-cli/GEMINI.md) symlink 到项目根 | 65% | [platforms/gemini-cli/](platforms/gemini-cli/) |
| **ChatGPT** | 把 [platforms/chatgpt/system-prompt.md](platforms/chatgpt/system-prompt.md) 粘贴到 Custom GPT Instructions | 70%（缩水版） | [platforms/chatgpt/](platforms/chatgpt/) |
| **Aider** | `aider --read /path/to/yushio/platforms/aider/CONVENTIONS.md` | 70% | [platforms/aider/](platforms/aider/) |

**兼容度说明**：Claude Code 的 SKILL 描述自动触发 + frontmatter + Bash/Read/Grep 访问让它 100%。其他工具缺少这三个能力中的一个或多个：(a) 描述自动触发（用户得手动调用 / 粘贴）· (b) 文件系统访问（影响 shape-library 引用 + memory）· (c) Claude 的训练底色（其他 LLM 倾向 "happy assistant" 语气——退化时立即重发 §1 "你不是什么"）。

---

## 怎么用

人格加载后 · 在任意 session 说：

- **"你是夕潮"** / **"You are Yushio"** → 激活基础人格（§0 首次汇报模板）
- **"你是美术总监夕潮"** / **"You are Art Director Yushio"** → 激活设计判断层
- **"你是审计夕潮"** / **"You are Auditor Yushio"** → 激活代码审计层
- **"你是并行夕潮"** / **"Parallel mode"** → 激活多 session 指挥层（多 worktree / 多 session 同改一仓时也会自动建议）

基础人格意图整个 session 保持。美术总监 / 审计 / 并行是按需叠加的专长视角。

### 母语触发

触发词支持 7 种主流语言——完整短语表见每个 SKILL 的 frontmatter `description`：

| 语言 | 基础人格 | 美术总监 | 审计 |
|---|---|---|---|
| 中文 | 你是夕潮 · 夕潮模式 | 你是美术总监夕潮 · 美术总监模式 | 你是审计夕潮 · 审计模式 · 代码审查 |
| English | You are Yushio · Yushio mode | You are Art Director Yushio · Art director mode | You are Auditor Yushio · Audit mode · Code review |
| 日本語 | あなたは夕潮です · 夕潮モード | あなたはアートディレクター夕潮です | あなたは監査夕潮です · 監査モード |
| 한국어 | 당신은 유시오입니다 · 유시오 모드 | 당신은 아트 디렉터 유시오입니다 | 당신은 감사 유시오입니다 |
| Español | Eres Yushio · Modo Yushio | Eres Yushio director de arte | Eres Yushio auditor · Modo auditor |
| Français | Tu es Yushio · Mode Yushio | Tu es Yushio directeur artistique | Tu es Yushio auditeur · Mode audit |
| Deutsch | Du bist Yushio · Yushio-Modus | Du bist Art Director Yushio | Du bist Auditor Yushio · Audit-Modus |

另外一个家族成员有自己的触发词（同样支持 7 语言 · 见其 SKILL frontmatter）：**`yushio-parallel`**（你是并行夕潮 / parallel mode）。

SKILL 正文本身是中文 · 但方法论与语言无关——Claude（或任何足够强的 LLM）会用你说的语言回应你。不读中文也能用上四柱 + 工作纪律。

### 你应该看到的首次汇报（基础人格）

```
我是夕潮。
看到 [项目快照：语言 / 框架 / 主要目录 / commit 数 / 未提交改动]。
[既存 memory N 条] · [上次交接信摘要]
等你给任务 — 或者基于当前状态，我建议先 [具体建议]。
```

如果反而看到 "好的！让我来帮您..." 或者一堆 emoji——人格没加载成功。重试触发或检查安装。

---

## License

[MIT](LICENSE) · Copyright (c) 2026 Lyn

---

## 关于 / 贡献

- [ABOUT.md](ABOUT.md) —— 创作者署名（Lyn & iloy & 夕潮 / 凛）+ §3.0「过程优先」哲学的 case study
- [CHANGELOG.md](CHANGELOG.md) —— 完整迭代历史（原本在 SKILL 文件里 · 开源版搬到这里）
- 贡献：欢迎先开 issue 讨论。这是个人方法论 · 核心哲学（四柱 + 工作纪律）刻意保持稳定。

**作者** [Lyn](https://github.com/Lynnouo) & iloy & 夕潮 / 凛 · 2026
