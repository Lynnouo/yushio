# 模板 02 · 策划案审阅站

> **适用项目**：文档密集（20+ MD）· 设计 / PRD / ADR / handoff 多 · 跨文档引用密度高
> **典型场景**：游戏策划文档库 · 产品 PRD 集合 · 学术研究 notes · runbook / wiki
> **本质**：本地侧栏导航 + 主区 Markdown 渲染 · 给制作人 / AI / 美工 / 程序员各方读

---

## 何时用本模板

调研报告满足：
- `docs_layout.total_md_count >= 20`
- `docs_layout.cross_ref_density = high`
- 文档分布 tree / monorepo / wiki-style

不适用：
- < 5 MD（DOC-MINIMAL pattern · 顶层 README 够用）
- 文档极散无组织（DOC-FLAT 需先合并整理 + 加 NN_ 编号前缀）

---

## 产出物（2 件 · 无构建步骤）

```
design/                       ← 所有策划 .md 集中放这里
├── 00_README.md              ← 总览/索引页（默认首页）
├── 01_world.md
├── 02_characters.md
├── ...
├── NN_roadmap.md
└── index.html                ← 单文件 SPA · CDN 引 marked.js · ~400 行
```

或者复用项目既有 `docs/` 目录：

```
docs/
├── ...所有现有 MD...
└── index.html               ← 新加 · 引 marked.js 渲染
```

---

## 目录约定（建议但不强制）

文件名格式 **`NN_topic.md`**（NN 是两位数字 · 方便排序）：

```
00_README.md       — 总览索引（默认首页）
01_vision.md       — 产品愿景
02_users.md        — 用户画像
03_world.md        — 世界观
04_characters.md   — 角色设定
05_systems.md      — 系统设计
...
98_handoff.md      — 当前进度交接
99_roadmap.md      — 路线图（让新接手 30s 知道剩什么没做）
```

**已有 docs/ 不带 NN 编号** → 不必硬重命名 · `index.html` 的 DOCS 数组允许任意排序 / 显示名 / 分组：

```js
const DOCS = [
  { group: '入门', file: 'README.md', title: '总览' },
  { group: '入门', file: 'SETUP-LOCAL.md', title: '本地搭建' },
  { group: '架构', file: 'architecture.md', title: '架构设计' },
  { group: '架构', file: 'ai-design.md', title: 'AI 系统设计' },
  { group: '审计', file: 'audit/_shape-library.md', title: '形状库' },
  // ...
];
```

---

## index.html 实现要点

### 布局
```
┌───────────────────────────────────────────────────┐
│ [侧栏 280px · sticky]  │  [主区 max-w 880px 居中]  │
│                        │                          │
│ • 入门                 │  # 标题                  │
│   ├─ 总览              │  正文...                 │
│   ├─ 本地搭建          │                          │
│ • 架构                 │  ## 章节                 │
│   ├─ 架构设计          │  ...                     │
│   ├─ AI 系统设计       │                          │
│ • 审计                 │  | 表格 | ... |          │
│   ├─ 形状库            │  | --- | --- |           │
│                        │                          │
└───────────────────────────────────────────────────┘
```

### 核心逻辑（~50 行 JS）
```js
const DOCS = [ ... ];  // hard-code list
const STORAGE_KEY = '<project>-design-last';

async function loadDoc(file) {
  const res = await fetch(file + '?t=' + Date.now());
  const md = await res.text();
  document.getElementById('main').innerHTML = marked.parse(md);
  localStorage.setItem(STORAGE_KEY, file);
  // 拦截内部 .md 链接
  document.querySelectorAll('#main a[href$=".md"]').forEach(a => {
    a.onclick = (e) => { e.preventDefault(); loadDoc(a.getAttribute('href')); };
  });
  highlightSidebar(file);
}

function highlightSidebar(file) { /* active 状态 */ }

window.addEventListener('DOMContentLoaded', () => {
  renderSidebar(DOCS);
  loadDoc(localStorage.getItem(STORAGE_KEY) || DOCS[0].file);
});
```

### 渲染特性
- **内部链接拦截**：`.md` 后缀 + 相对路径 → 走 `loadDoc()` · 不跳页
- **外部链接** (http/https) → 正常 target=_blank
- **localStorage 记忆最近打开**：刷新回原位
- **代码高亮**：可选 highlight.js（marked.js 配置 highlight callback）

---

## 暗色主题 CSS（精简版）

```css
:root {
  --bg: #18181b;
  --bg-side: #1f1f23;
  --bg-card: #27272a;
  --bd: oklch(0.32 0.01 250);
  --fg: oklch(0.92 0.01 250);
  --fg-dim: oklch(0.65 0.01 250);
  --accent: oklch(0.7 0.18 145);     /* 强调绿 */
  --link: oklch(0.78 0.12 230);
  --line-height: 1.7;
}

body {
  font-family: -apple-system, "Noto Sans SC", sans-serif;
  background: var(--bg);
  color: var(--fg);
  margin: 0;
  display: flex;
}

#sidebar { width: 280px; background: var(--bg-side); padding: 24px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
#main { max-width: 880px; margin: 0 auto; padding: 40px 32px; line-height: var(--line-height); }

#main h1 { border-bottom: 2px solid var(--accent); padding-bottom: 8px; }
#main h2 { border-left: 3px solid var(--accent); padding-left: 12px; }
#main code { font-family: "JetBrains Mono", monospace; background: var(--bg-card); padding: 2px 6px; border-radius: 4px; }
#main pre { background: var(--bg-card); padding: 16px; border-radius: 8px; overflow-x: auto; }
#main table { border-collapse: collapse; width: 100%; }
#main th, #main td { border: 1px solid var(--bd); padding: 8px 12px; }
#main blockquote { border-left: 3px solid var(--fg-dim); color: var(--fg-dim); padding-left: 16px; }
#main hr { border: none; border-top: 1px solid var(--bd); margin: 32px 0; }

@media (max-width: 768px) {
  body { flex-direction: column; }
  #sidebar { width: 100%; height: auto; position: static; }
  #main { padding: 24px 16px; }
}
```

---

## 起服务（3 种方式）

### 方式 A · 项目是 Vite

vite.config.ts 加自定义 middleware：

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'serve-design',
      configureServer(server) {
        server.middlewares.use('/design', (req, res, next) => {
          // 解析 /design/* 路径 → 读 design/ 下文件
          // .md → text/plain
          // .html → text/html
          // 略 (~15 行)
        });
      }
    }
  ]
});
```

`npm run dev` → `http://localhost:3000/design/`

### 方式 B · 项目是 Next.js / Nuxt / 其他 framework

把 `design/` 放 `public/design/` · 自动 serve 静态。访问 `http://localhost:<port>/design/`。

### 方式 C · 任何项目（最简）

```bash
cd design && python -m http.server 8000
# 或
npx serve design
```

访问 `http://localhost:8000`。

---

## 写策划案的约定

### 每篇 MD 头部 1 行定位

```md
# 02 角色设定

> 本篇定位：定义主角 + V1→V2 单角色架构演化 · 跟 01_vision 配套读
```

让任何来读的人 3 秒知道这是讲什么。

### 多用表格 · 少用长段落

✅ 表格：
| 属性 | 类型 | 默认 | 说明 |
|---|---|---|---|
| toxicity | int 0-100 | 50 | 毒舌度 · 👎 +5 |

❌ 长段落："角色有一个名为 toxicity 的属性 · 类型是 0-100 的整数 · 默认值 50 · 用户每次点踩会 +5..."

### 链接用相对路径 `./NN_xxx.md`

让 SPA 路由能拦截 · 别用绝对 URL。

### 第一篇 `00_README.md` 做总览索引

列全部章节 + 一句话摘要：

```md
# 项目名 · 策划案总览

| 篇 | 摘要 |
|---|---|
| [01_vision](./01_vision.md) | 产品愿景 + 三句话定义 |
| [02_users](./02_users.md) | 三种典型用户画像 |
| ... | ... |

## 当前实装状态
（指向 99_roadmap.md）
```

### 末篇放当前实装状态 + 路线图

让新接手的人 **30 秒**知道还剩什么没做。

---

## AI 协作钩子

审计夕潮 §6 修复审计 5 步 SOP 步骤 5 在文档型项目的版本：

```
改 MD commit 前：
1. 检查改动是否影响其他 MD 的引用（grep 当前文件名 在其他 MD 出现位置）
2. 改了顶层文件名 / 章节锚点 → 必须同步改所有 inbound 引用
3. 如有 deprecated 章节 → 标记 `> ⚠️ 已废弃 ...` 而不是直接删除（防 stale 引用）
4. commit message Review 段写：影响的引用文件清单 + 同步状态
```

---

## 跟 01 / 03 模板组合

文档密集项目通常 = 02 + 03 组合：
- 02 主导（80+ MD 是核心）
- 03 作为代码层（module / API / dep）一栏嵌入
- 单 `index.html` · 侧栏分组 "策划 / 代码模块 / API 路由"

复杂游戏 / 内容项目 = 01 + 02 组合（详见 01 文档底部）· 02 作为 "策划案" tab 嵌入 01 的主页面。
