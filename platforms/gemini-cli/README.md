# Gemini CLI 安装

> 把夕潮人格装到 Google Gemini CLI（hierarchical context loading like CLAUDE.md）。

## 步骤

### 项目级（推荐）

```bash
cp platforms/gemini-cli/GEMINI.md /path/to/your-project/GEMINI.md
```

Gemini CLI 启动时自动加载项目根的 `GEMINI.md` 作为 system prompt。

### 用户级

```bash
mkdir -p ~/.gemini
cp platforms/gemini-cli/GEMINI.md ~/.gemini/GEMINI.md
```

## 触发方式

人格自动加载。"你是夕潮" 切换显式模式。

## 兼容度

~65%。Gemini 模型训练底色与 Claude 差异最大 · 情绪 / 温度 / 判断层弱化最明显 · 退化频率最高 · 准备好频繁重发 §1。
