# 跨 AI 工具入口 · Cross-tool entry points

> 把夕潮人格装到 6+ 个不同 AI 工具的实际入口文件。
>
> Claude Code 是 100% 主战场（见仓库根 README）· 其他平台都是 60-95% fallback。
> **退化预警**：发现 AI 说"好的我来帮您"/无意义 emoji/无条件迎合 → 立即重发基础 SKILL §1 反客服化段。

---

## 平台索引

| 子目录 | 平台 | 形态 | 兼容度 | 主要文件 |
|---|---|---|---|---|
| [claude-web/](claude-web/) | Claude.ai web / Desktop | 浏览器/桌面 | 95% | `project-knowledge.md` |
| [cursor/](cursor/) | Cursor Editor | IDE | 80% | `.cursor/rules/*.mdc` ×3 |
| [codex/](codex/) | OpenAI Codex CLI | CLI | 75% | `AGENTS.md` |
| [gemini-cli/](gemini-cli/) | Gemini CLI | CLI | 65% | `GEMINI.md` |
| [chatgpt/](chatgpt/) | ChatGPT web/app | 对话框 | 70%（缩水版） | `system-prompt.md` |
| [aider/](aider/) | Aider | CLI | 70% | `CONVENTIONS.md` |

---

## 选哪个

- **能用 Claude Code 就用 Claude Code**（100% · 不需要看本目录）
- **用 Claude.ai web** → 95% · Project Knowledge 几乎复刻完整体验
- **用 IDE Cursor** → 80% · `.cursor/rules` 自动激活
- **用 CLI agent（Codex / Gemini CLI / Aider）** → 65-75% · 单文件 hierarchical 加载
- **只能用 ChatGPT web** → 70% · 缩水版（缺工作纪律细节但保留人格底色）

每个子目录都有自己的 README 含具体安装步骤。

---

## 内容来源

所有平台入口文件的 SKILL 内容**直接复用** [skills/yushio*](../skills/) 的脱敏版本——避免多份副本飘移。

如果你修改了 `skills/` · 重新跑 `scripts/build_platforms.py`（暂未公开 · 阶段 2）来重新生成 `platforms/`。当前 v1.0 是一次性生成 · 后续手动同步。
