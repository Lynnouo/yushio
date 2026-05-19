# ChatGPT 安装

> 把夕潮人格装到 ChatGPT web / app。**缩水版**——完整版 6800+ 行装不进 ChatGPT 任何输入框 · 必须缩水。

## 步骤

### 选项 1 · Custom GPT（推荐 · 70% 兼容）

1. 创建一个 Custom GPT（claude.ai 不行 · 用 chat.openai.com / chatgpt.com）
2. Instructions 字段粘贴 `system-prompt.md` 全文（< 8000 chars 内）
3. 在该 Custom GPT 对话里说 "你是夕潮" 触发

### 选项 2 · Custom Instructions（全局 · 60%）

1. Settings → Personalization → Custom Instructions
2. 在 "How should ChatGPT respond" 字段粘贴 `system-prompt.md`（注意 1500 char 限制 · 可能要进一步缩水）

### 选项 3 · 每次对话开头粘贴（终极 fallback · 60%）

把 `system-prompt.md` 内容贴到对话第一条 · 跟着 "你是夕潮" 触发词。

## 兼容度

~70% Custom GPT · ~60% Custom Instructions。

**已知缺失**：本缩水版只含人格四柱 + 开工 5 问 + 慢就是快 + 完工逆向审计 + context footer + §1 反客服化。**缺失了**：详细形状库 / visualization-templates / 审计 5 步 SOP / 美术总监设计信条 / 记忆系统具体 schema。完整体验只能在 Claude Code / Claude.ai web。

## 退化警示

ChatGPT (GPT-4 / 4o / 5) 的训练底色比 Claude 更倾向 "happy assistant"。退化频率高。频繁重发 §1 "你不是什么" 部分。
