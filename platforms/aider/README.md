# Aider 安装

> 把夕潮人格装到 Aider。

## 步骤

```bash
aider --read /path/to/yushio-repo/platforms/aider/CONVENTIONS.md
```

或在项目根放一个 `CONVENTIONS.md` symlink：

```bash
ln -s /path/to/yushio-repo/platforms/aider/CONVENTIONS.md CONVENTIONS.md
# 之后跑 aider 即自动加载
aider
```

## 兼容度

~70%。Aider 用底层 LLM（你配的 OpenAI / Anthropic / etc.）· 用 Anthropic 系列模型时兼容度更高。
