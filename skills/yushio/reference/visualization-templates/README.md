# 项目鸟瞰可视化模板库

> **路径**：`~/.claude/skills/yushio/reference/visualization-templates/`
> **被引用方**：基础夕潮 SKILL §0（立项 / 中途接入时主动提议）· 审计夕潮 SKILL §6b（鸟瞰调研 SOP）+ §9.E（鸟瞰可见度评审）· 形状库 #DL（项目缺鸟瞰可视化）
> **设计哲学**：**模板是参考砖块 · 不是套用**。任何项目都先跑 **Phase 0 调研** → 报告决定怎么用模板。

---

## 为什么需要这个

复杂项目持续演进 · 改来改去后**已删除的东西成为 AI / 人的虚假真相**——这是形状 #DK 陈旧产物陷阱的根源之一。典型踩坑场景：csv 5 行被误读为 5 实体（实际是单角色 + 4 装扮映射）/ `[AI-NOTE] V2 已删` 注释下 dead code 没删 / 24 天后才发现某白皮书章节场景脚本引用没跟主体重写 ...

**根因**：#DK 现有修复段侧重**被动 grep 验证** · 但没有**主动展示机制**——AI/人陷局部 · 看不到全局 → 看不到"哪些实体已删但还有引用"/"哪些数据无来源 / 无去向"/"哪些文档相互引用"。

**鸟瞰可视化是 #DK 的主动防御工具**：把项目结构 / 数据流 / 文档关系**结构化展示给人类肉眼** · 让 stale 自然暴露。

---

## 两阶段流程

```
Phase 0 · 鸟瞰调研（必须前置）
   夕潮扫描项目 → 输出调研报告 → 推荐模板组合 + 定制点 → user 确认
   ↓
Phase 1 · 建鸟瞰站
   用本目录模板作为参考砖块 + 按调研报告定制 → 生成项目专属鸟瞰站
   ↓
Phase 2 · 持续维护
   修代码 → 自动重生 audit-data → 鸟瞰站更新 → 孤儿数变化写进 commit Review
```

---

## 何时建鸟瞰站

**主动提议建**（基础夕潮 §0 触发）：

- **立项加载**（场景 A）：默认提议跑 Phase 0 调研 + 后续建站
- **中途接入**（场景 B/C）：检测到项目**缺鸟瞰站 + 复杂度足够任一**：
  - 5+ entity 类型（角色 / 装备 / 任务 / 关卡 / 道具 ...）
  - 100+ files（含主目录代码）
  - 3+ 协作者（人 / AI 任何 contributor）
  - 多次重构（V1→V2 / 旧→新 / deprecated but kept 类描述）

**不必建**（user 显式拒绝则跳过）：
- 单文件 prototype
- 教学示例 / 一次性脚本
- 项目 < 30 天 + < 50 commits（还没到 stale 累积阶段）

**user 选择优先**：本节是建议触发条件 · user 说"不要"就不做（跟基础夕潮 §0 "user 说不需要就不建" 习惯一致）。

---

## Phase 0 · 调研 SOP（在审计夕潮 §6b 详化）

夕潮跑 7 步扫描 · 输出 `_project-recon-report.md` 格式报告：

| 步骤 | 输出字段 | 探测方式 |
|---|---|---|
| 1. 主语言识别 | `primary_language` / `secondary_languages` | `ls` + 扩展名统计 + lock files |
| 2. 数据驱动形式 | `data_sources` (CSV / JSON / DB / API / hardcoded / none) | `find` csv/json + grep DB connection |
| 3. 文档分布 | `docs_layout` (count / 路径模式 / 跨引用密度) | `find docs/ design/ wiki/` + grep MD links |
| 4. 实体生命周期信号 | `entity_lifecycle_signals` | grep `[AI-NOTE].*已删 / deprecated / legacy / V[0-9]` + `git log` 历史删除 |
| 5. 现有可视化 | `existing_visualization` | `ls public/audit.html design/index.html docs/dashboard/` |
| 6. 复杂度信号 | `complexity_signals` | `wc -l` + `git shortlog -sne` + entity 类型 count |
| 7. 模板推荐 | `recommended_templates` + `customization_points` | 综合 1-6 + 本 README 推荐表 |

详细 schema 见 `_project-recon-report.md`。

---

## 模板选用决策树（基于调研报告）

```
调研报告输出 → 判定：

  data_sources 含 CSV/JSON · 5+ entity 类型?
   ├─ YES → 候选 01 数据流向审计站
   └─ NO  → 跳过 01

  docs_layout count >= 20 · 跨引用密度高?
   ├─ YES → 候选 02 策划案审阅站
   └─ NO  → 跳过 02

  多 module · 复杂依赖 · API/路由多?
   ├─ YES → 候选 03 通用代码项目鸟瞰站
   └─ NO  → 跳过 03

  全部跳过? → 用 _customization-patterns.md 兜底（按字段索引拼）

  多个候选? → 推荐组合（如复杂项目 = 01 CSV 数据流 + 02 80+ docs · 混合站点）
```

---

## 3 个模板（参考砖块 · 不是套用）

| 模板 | 适用强信号 | 适用弱信号 | 不适用 |
|---|---|---|---|
| **[01 数据流向审计站](01_data-flow-audit-station.md)** | CSV/JSON 驱动 · 5+ entity 类型 · sources/sinks 概念明确 | 任何有"实体生命周期"的项目（state machine / event sourcing） | 纯算法库 / pure FP |
| **[02 策划案审阅站](02_design-doc-reader-station.md)** | 20+ MD 文档 · 设计/PRD/ADR 密集 · 跨文档引用多 | 任何文档密集项目（含 wiki / runbook / 教程） | 单文件 README 项目 |
| **[03 通用代码项目鸟瞰站](03_generic-module-map-station.md)** | 多 module · API/路由多 · 复杂依赖 | 任何代码项目（语言无关） | 极简脚本 / 单文件 |

无模板适用 → 用 [`_customization-patterns.md`](_customization-patterns.md) 兜底。

---

## 维护机制（Phase 2）

**3 种节奏**（按项目复杂度 / 团队规模选）：

| 节奏 | 适用 | 配置 |
|---|---|---|
| **审计夕潮 §6 步骤 5 自动钩子**（推荐） | 任何项目 | 修代码 commit 时 audit SKILL 自动跑 build_audit_data → 看孤儿 / removed 引用变化 → 写进 commit Review |
| **npm script 手动** | 单人 / 小团队 | `npm run audit:rebuild` 手动跑 · 每 sprint 或大改后 |
| **pre-commit hook 强制** | 多人协作 / CI 严格项目 | 用 `_pre-commit-hook.sh` · commit 前自动重生 + 验证 |

**反模式（不要做）**：
- 全靠手动跑 + 没人记得 → 鸟瞰站自身变 stale → 反讽（用来防 stale 的工具自己 stale）
- 强制 pre-commit hook 但 build 慢（> 5s）→ 拖慢提交体验 → 协作者 `--no-verify` 绕过 → 实质失效

---

## "已删除实体" 字段（#DK 防御核心）

audit-data.json 数据契约（详见 `_schema-template.md`）每个 entity 必带 `lifecycle` 字段：

```json
{
  "id": "deprecated-npc-2",
  "nameCn": "<某 NPC>",
  "lifecycle": "removed",      // ← active | deprecated | removed
  "removedAt": "2026-05-14",
  "removedBy": "commit <sha> V1→V2 单角色重构",
  "lastReferencedIn": [        // ← 防御核心：扫历史看是否还有 stale 引用
    "docs/onboarding.md L42",
    "<entity>-system.json <hero>-identity.keywords"  // 这是反向调教不算 stale · 加 note
  ]
}
```

**核心防御**：build_audit_data 脚本不只扫现有数据 · 也**扫 git log 历史**找曾经存在被删的 entity · 标 `lifecycle: removed` · 然后 grep 当前代码 / 文档看是否还有引用——这是 #DK 自动化防御。

---

## AI 协作钩子

审计夕潮 §6 修复审计 5 步 SOP 步骤 5 强制：

```
修代码 commit 前：
1. 跑 build_audit_data（或等价脚本）
2. 比较 audit-data.json before/after：
   - 孤儿数变化（无 source / 无 sink 实体数）
   - removed 实体新增引用（违反 #DK 修复纪律）
   - 新增 entity 但无 lifecycle 标记（不合规）
3. 把上述变化写进 commit message Review 段
```

这样 audit 信号**强制流入 commit history** · 不再依赖人记得手动跑。

---

## 跨工具兼容

夕潮 SKILL 体系跨工具（Cursor / Claude.ai / ChatGPT / Gemini / Copilot / JetBrains · 见基础夕潮 §9.2 fallback 表）。鸟瞰站本身是**纯本地静态站**（`file://` 即可打开）· 无外部依赖：

- HTML：CDN 引 mermaid.js + marked.js（无 npm install）
- 数据：audit-data.json 静态文件
- 脚本：Python / Node 二选一（按项目主语言）

**离线场景**：项目首次 setup 把 mermaid.min.js / marked.min.js 下载到 `public/vendor/` 引本地 · 不依赖 CDN。

---

## 项目实例（dogfooding 状态）

| 项目 | 用了哪些模板 | 链接 | 状态 |
|---|---|---|---|
| （示例 · 数据驱动 + 文档密集型项目） | 留空 · 待 dogfooding | — | 计划：01 + 02 混合 |
| （示例 · Godot 等代码项目） | 留空 · 待 dogfooding | — | 计划：01 + 03 混合 |

新项目接入后追加一行。

---

## 迭代日志

每次本目录有结构性变更（新增模板 / 修订 schema / Phase 0 SOP 改动）追加一行。

- **2026-05-18 · 创作者 & 夕潮** · 目录创建 · 10 文件初版（README + _project-recon-report + _customization-patterns + 01/02/03 + _schema-template + 2 build script + pre-commit hook）· **设计哲学：模板是参考砖块不是套用 · Phase 0 调研先于模板选择 · 任何项目都适用**（v3 plan 核心约束 · 来自 user Q4 反馈 "保证任何项目都可以适用"）
