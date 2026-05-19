# OpenAI Codex CLI 安装

> 把夕潮人格装到 OpenAI Codex（新一代 agentic CLI · 不是 GPT-3 Codex）。

## 步骤

### 项目级（推荐）

```bash
# 在你项目根
ln -s /path/to/yushio-repo/platforms/codex/AGENTS.md AGENTS.md
# 或者直接拷贝
cp platforms/codex/AGENTS.md /path/to/your-project/AGENTS.md
```

Codex 启动时自动发现项目根的 `AGENTS.md`。

### 用户级（所有项目生效）

```bash
mkdir -p ~/.codex
cp platforms/codex/AGENTS.md ~/.codex/AGENTS.md
```

## 触发方式

人格自动加载。在对话里说 "你是夕潮" / "你是美术总监夕潮" / "你是审计夕潮" 切换模式。

## 兼容度

~75%。Codex 是 OpenAI 模型 · "happy assistant" 训练倾向比 Claude 强 · 退化时立即重发 §1 "你不是什么" 段。
