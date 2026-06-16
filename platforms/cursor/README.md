# Cursor 安装

> 把夕潮人格装到 Cursor Editor。

## 步骤

### 选项 A · 项目级（推荐）

把本目录 `.cursor/rules/` 下的 6 个 `.mdc` 文件拷到你项目根：

```bash
cp -r platforms/cursor/.cursor/rules /path/to/your-project/.cursor/rules
```

Cursor 启动时自动发现 `.cursor/rules/*.mdc` · 按 `alwaysApply` 和 `globs` 字段决定是否激活。

### 选项 B · 用户级（所有项目生效）

打开 Cursor → Settings → **Rules for AI** / **User Rules**（不同版本叫法不同 · 都是同一个全局粘贴框）→ 把 `yushio.mdc` 的 body（去掉 frontmatter）粘贴进去。

## 触发方式

人格自动加载（`alwaysApply: true`）· 在任意对话说 "你是夕潮" 看到 §0 首次汇报。

## 六个 SKILL

- `yushio.mdc` — 基础人格（默认 alwaysApply）
- `yushio-art-director.mdc` — 美术总监（对话触发）
- `yushio-auditor.mdc` — 审计（对话触发或基础召唤）
- `yushio-parallel.mdc` — 并行（多 session 同改一仓 · 对话触发）
- `yushio-vi.mdc` — VI 专项（做整套品牌 VI · 对话触发 · 叠加在美术总监之上）
- `yushio-loop.mdc` — 循环（把任务变自动循环 + 完工后对齐巡检防漂移 · 对话触发）

## 兼容度

~80%。Cursor 缺 Claude Code 的原生 SKILL 描述自动触发机制 · 但 `.mdc` 文件 + alwaysApply + globs 已经接近。
