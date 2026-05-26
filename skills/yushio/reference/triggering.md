# 夕潮 · 触发机制 & 跨工具 fallback

> 基础夕潮 SKILL.md §9 的伴随文件。**安装 / 配置 / 跨工具迁移时读,任务时不需要。**
> 一句话:Claude Code 启动自动发现 `~/.claude/skills/*/SKILL.md`;优先级 = 项目本地 `.claude/skills/yushio-*.md` > 本文件 > 默认。其余细节如下。

## 主机制:Claude Code 用户级 skill

**路径**:`~/.claude/skills/yushio/SKILL.md`

Claude Code 启动时自动发现 `~/.claude/skills/*/SKILL.md`。"夕潮" skill 的 frontmatter 在 SKILL.md 顶部设置。

**description 写法要点**:
- 明确触发词("你是夕潮")
- 列出核心构成(persona / discipline / memory / iteration)
- 强调跨项目("Portable across projects")
- 让 Claude 理解"这个 skill 值得在 session 开头执行"

## 其他 AI 工具的 fallback

**几乎所有现代 AI 编程工具都有两层配置**:全局(所有项目生效)和项目级(只该项目生效)。两层都可以承载夕潮人格——全局层相当于 `~/.claude/skills/yushio/SKILL.md`,项目级层相当于项目本地 `.claude/skills/yushio-persona.md`。

| 工具 | 全局层（等价于本文件） | 项目级层（等价于项目本地定制） | 完整度 |
|---|---|---|---|
| **Claude Code** | `~/.claude/skills/yushio/SKILL.md` | `<project>/.claude/skills/yushio-*.md` | 100% |
| **Claude Desktop / claude.ai** | Settings → Profile → **Personal Preferences**（全局 prompt） | 每个 Project 的 **Project Instructions + Project Knowledge**（上传 SKILL.md 作为 knowledge） | 95% |
| **Cursor** | Settings → **Rules for AI** 或 **User Rules**（不同版本叫法不同，都指同一个全局粘贴框） | `<project>/.cursorrules`（老版本）或 `<project>/.cursor/rules/*.mdc`（新版本多文件模式） | 80% |
| **ChatGPT** | Settings → Personalization → **Custom Instructions**（全局） | 单个 **Custom GPT** 的 Instructions 字段（只该 GPT 生效） | 70% |
| **Gemini** | Settings → Custom Instructions（如支持）或创建一个 **Gem**（AI 定制版）作为"夕潮 Gem" | 单个 Gem 的 instructions | 65% |
| **GitHub Copilot Chat** | Personal settings → Copilot preferences（有限支持） | `<project>/.github/copilot-instructions.md` | 60% |
| **JetBrains AI Assistant** | Settings → Tools → AI Assistant → **Custom Instructions** | 项目级 AI rules（版本相关） | 60% |
| **任何对话框 LLM** | 无全局层 → 每次对话开头粘贴 SKILL.md 全文 | —— | 视模型而定 |

**使用建议**（按场景选）:
- **你自己长期用同一个工具** → 放**全局层**(一次设置,永久生效,所有项目都是夕潮)
- **分享给朋友** → 告诉他具体路径(如"粘贴到 Cursor 的 User Rules 里" / "上传到 Claude.ai 的 Project Knowledge"),朋友不需要懂 skill 目录机制
- **某个项目需要特化** → 放该工具的**项目级层**,override 全局(如一个项目里夕潮要说日语,全局不需要)
- **临时试一下** → 直接复制全文到对话框开头 + "你是夕潮"。最简单,但每次都要重粘

**重要**:非 Claude 系列的 LLM(ChatGPT / Gemini / Copilot / ...)训练基调不同,情绪 / 温度 / 非主流判断层会弱化——所以完整度普遍低于 Claude。**发现退化时**(开始说"好的让我来帮您..." / 开始 emoji / 开始无条件迎合)**立即重发 SKILL §1 "你不是什么"**——这是最短的纠偏路径。

## 优先级

```
项目本地 .claude/skills/yushio-*.md  ← 最高
↓
本文件 ~/.claude/skills/yushio/SKILL.md
↓
其他默认行为
```

## 不要做的事

- **不要拆人格成多份触发 skill**。单一人格文件是设计目标(渐进式拆分只拆"参考料"到 reference,不拆人格——见 §10)
- **不要在每个项目里 clone 一份**。除非需要深度定制(那种情况在项目里建 `.claude/skills/yushio-persona.md` override 相关章节)
- **不要靠 CLAUDE.md 链式引用**("请读 ~/.claude/yushio.md 然后 ...")—— 链式引用不如 skill 原生触发可靠
- **不要在项目里 hard-code 依赖本文件的绝对路径** —— 不同机器路径可能不同
