# 项目鸟瞰调研报告 · schema 模板

> **用法**：审计夕潮 §6b 跑 Phase 0 调研时输出本模板格式 · user 复核后进 Phase 1 建鸟瞰站
> **位置约定**：报告保存到项目 `docs/audit/project-recon-YYYY-MM-DD.md`（或临时 `/tmp/`）
> **特点**：字段结构化（AI 易填 + 人类易读 + 后续工具可解析 grep）

---

## 元信息

```yaml
project_name: <填项目名 · 如 my-project / xxx>
project_root: <填绝对路径>
recon_date: 2026-05-18
recon_by: 夕潮 (Claude Code Opus)
session_id: <如有>
```

---

## §1 主语言识别

```yaml
primary_language: <填 JavaScript / Python / Go / Rust / Swift / C++ / ...>
secondary_languages: [<列出 2-3 个 · 按文件占比降序>]
detection_method: ls 主目录 + 扩展名统计 + lock files
detection_signals:
  - <如 package.json / Cargo.toml / pyproject.toml / go.mod 路径>
  - <主目录前 5 个文件类型>
confidence: high | medium | low
notes: <如有歧义说明>
```

**降级策略**：
- 多语言混合（如 Electron = Node + Web）→ `primary_language: "JavaScript"` · `secondary_languages: ["TypeScript", "HTML"]`
- 完全没识别到 → `primary_language: "unknown"` + 标 `confidence: low` + 问 user

---

## §2 数据驱动形式

```yaml
data_sources:
  csv: <count · 路径模式 · 如 8 文件在 server/src/csv/>
  json: <count · 路径模式>
  yaml: <count · 路径模式>
  database: <如有 · DB 类型 + 模型路径>
  api_calls: <外部 API client 数 + 主要 endpoint>
  hardcoded: <是否有大量内联硬编码数据 · 如 constants.py>
  none: <true / false · true 表示无显式数据源>

dominant_form: <CSV / JSON / DB / API / hardcoded / mixed / none>
detection_signals:
  - find / grep 命令 + 命中数
```

**降级策略**：
- 多种数据源混合（如 CSV + DB + JSON）→ `dominant_form: "mixed"` · 各 source 单列
- 无显式数据源（纯算法库 / shader / WASM）→ `dominant_form: "none"` · 走 _customization-patterns.md 兜底

---

## §3 文档分布

```yaml
docs_layout:
  total_md_count: <find docs/ design/ wiki/ -name "*.md" | wc -l>
  primary_doc_dirs: [<列出主要文档目录路径>]
  cross_ref_density: <high | medium | low · grep MD links 跨文件引用密度>
  ad_hoc_dirs: <如 handoff/ collaboration/ ADR/ session-log/ 等存在数>
  has_index_or_readme: <true / false · 顶层 README / docs/README>

dominant_pattern: <flat / tree / monorepo / wiki-style / scattered>
```

**降级策略**：
- 文档极少（< 5 MD）→ 不需要 02 策划案审阅站 · 跳过
- 文档极散（在 50+ 不同目录）→ 标 `dominant_pattern: "scattered"` · 建议先合并再建站

---

## §4 实体生命周期信号（#DK 防御核心）

```yaml
entity_lifecycle_signals:
  deprecated_markers_count: <grep "[AI-NOTE].*已删\|deprecated\|legacy" 命中数>
  version_transitions: [<列出 V1→V2 / 旧→新 / 等迁移描述>]
  recent_deletions_30d: <git log --since="30 days ago" --diff-filter=D | wc -l>
  stale_artifact_inventory_doc: <如有 stale-artifacts.md / dead-code.md 类清单 · 列路径>

dominant_state: <stable | active-refactor | major-transition | unknown>
high_risk_areas: [<列出 grep 高密度命中的目录>]
```

**关键意义**：这个字段决定鸟瞰站是否需要**特别加强 lifecycle 标记**——`active-refactor` / `major-transition` 状态必须每个 entity 带 `lifecycle: active|deprecated|removed` + 历史扫描。

**降级策略**：
- grep 0 命中 → `dominant_state: "stable"` · lifecycle 标记可简化为 `active` 默认
- 多个 V1→V2 标记 + 30 天内大量删除 → `dominant_state: "major-transition"` · 鸟瞰站必须含 deprecated/removed 完整扫描

---

## §5 现有可视化

```yaml
existing_visualization:
  audit_station: <路径 / null>
  doc_reader: <路径 / null>
  dashboard: <路径 / null>
  other: [<列出其他可视化资产>]

freshness:
  last_updated: <git log -1 --format=%ai 该可视化文件 · 或 null>
  staleness: <fresh < 7d | medium 7-30d | stale > 30d | unknown>
  data_source_alignment: <可视化数据源是否还跟当前实际架构一致 · yes / partial / no>

recommendation: <reuse | rebuild | extend>
```

**降级策略**：
- 已有可视化但 stale > 30d → 推荐 `rebuild`（不要在 stale 基础上扩 · 重做更便宜）
- 已有可视化 fresh + 数据源一致 → 推荐 `reuse`（不要重造轮子）

---

## §6 复杂度信号

```yaml
complexity_signals:
  entity_type_count: <角色 / 装备 / 任务 / 关卡 / 道具 等独立 entity 类型 count>
  total_files: <find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | wc -l>
  total_loc: <粗略 wc -l 主目录代码>
  contributors_count: <git shortlog -sne --all | wc -l>
  total_commits: <git log --oneline | wc -l>
  refactor_markers: [<V1→V2 / Sprint M7 等 milestone 标记>]
  active_refactor: <true / false>

complexity_tier: <prototype | small | medium | large | mega>
```

**判定 tier**：
- `prototype`：< 30 files OR < 50 commits OR 1 contributor + < 7 days
- `small`：3-5 entity 类型 / 30-100 files / 1-2 contributors
- `medium`：5-15 entity 类型 / 100-500 files / 2-5 contributors
- `large`：15-50 entity 类型 / 500-5000 files / 5+ contributors
- `mega`：50+ entity 类型 / 5000+ files / 多团队

**阈值意义**：`prototype` 默认跳过鸟瞰站建议 · `small+` 起主动提议。

---

## §7 模板推荐 + 定制点

```yaml
recommended_templates:
  primary: <01 | 02 | 03 | custom>
  secondary: [<可组合的其他模板 ID>]
  fallback: <如全部不匹配 · 用 _customization-patterns.md>

customization_points:
  - <按调研字段列出具体定制项>
  - <如 "data_sources.csv = 8 文件 · entity 类型 5+ · lifecycle 字段必备">
  - <如 "active-refactor 中 · audit-data.json 必须含 removed 历史扫描">

rationale: |
  <一段话解释为什么推荐这个组合 · 引调研报告字段佐证>
```

**推荐规则表**（参考 README 决策树）：

| 调研字段 | 推荐模板 |
|---|---|
| `data_sources.dominant_form = CSV/JSON` + `entity_type_count >= 5` | + 01 |
| `docs_layout.total_md_count >= 20` + `cross_ref_density = high` | + 02 |
| `complexity_signals.complexity_tier in [medium, large, mega]` + 多 module | + 03 |
| 全部不匹配 | custom (_customization-patterns.md 兜底) |
| 多个匹配 | 组合（如复杂项目 = 01 + 02） |

---

## §8 user 复核 checkpoint（必填）

调研完成后 user 必须复核报告 + 拍板：

```yaml
user_review:
  reviewed_by: <user name>
  reviewed_at: <时间戳>
  decision: <approve | modify | reject>
  modifications: <如 modify · 列出调整项 · 如 "改用 02 不要 01">
  rejection_reason: <如 reject · 列原因 · 如 "项目还在 prototype 期 · 不需要鸟瞰站">
```

**为什么必须 user 复核**：调研报告决定 Phase 1 建站质量。AI 自己拍板可能漏关键信号 / 选错模板。user 是产品判断 owner · AI 只是输出参考。

---

## 填写示例 · 复杂数据驱动游戏项目（参考）

```yaml
project_name: demo-app
project_root: <project-root>
recon_date: 2026-05-18
recon_by: 夕潮 (Claude Code Opus)

primary_language: JavaScript
secondary_languages: [HTML, Svelte, Python]

data_sources:
  csv: 8 文件 in server/src/csv/ (entities/characters/...)
  json: 多 · server/src/data/ (角色卡 / 配置)
  database: Supabase pgvector + 自建表
  api_calls: 多个外部 API (Steam / Search / LLM provider 等)
dominant_form: mixed (CSV 为核心 + 多种辅助)

docs_layout:
  total_md_count: 80+
  primary_doc_dirs: [docs/, docs/audit/, docs/handoff-*]
  cross_ref_density: high (memory + docs 大量交叉引用)
dominant_pattern: tree

entity_lifecycle_signals:
  deprecated_markers_count: 31+ files (grep [AI-NOTE].*已删 / V[12])
  version_transitions: [V1 多角色 → V2 单角色 (2026-05 重构), L1 自研记忆 → 第三方 (2026-04-23)]
  stale_artifact_inventory_doc: memory/project_stale-artifacts.md
dominant_state: active-refactor

complexity_signals:
  entity_type_count: 12+ (角色 / 装扮 / 道具 / 任务 / 配方 / 头饰 / 表情 / ...)
  total_commits: 800+
  contributors_count: 6
  active_refactor: true
complexity_tier: large

recommended_templates:
  primary: 01 (数据流向 · CSV 驱动)
  secondary: [02 (策划案 · 80+ docs)]
  fallback: 不需要

customization_points:
  - lifecycle 字段必备 (active-refactor 中 · V1→V2 删除多)
  - audit-data.json 必须扫 git log 历史 deprecated entities
  - 实体类型 tabs 至少 6 个 (角色 / 装扮 / 任务 / 道具 / 表情 / 头饰)
  - docs 侧栏 80+ MD 需分类 (audit/handoff/architecture/design 等)

rationale: |
  典型的「CSV 数据驱动 + 文档密集 + 活跃重构」复杂项目（complexity_tier: large）。
  01 数据流向核心解决"V2 单角色 vs csv 5 行" 类 stale 误读问题。
  02 策划案审阅辅助 80+ 文档的导航 + 跨引用追踪。
  active-refactor 状态决定 lifecycle 标记必备 + 历史扫描必跑。
```

## 填写示例 · 通用 SaaS Web 应用（参考）

```yaml
primary_language: TypeScript
secondary_languages: [React, SQL]

data_sources:
  database: PostgreSQL (主要)
  api_calls: 3rd-party (Stripe / SendGrid)
dominant_form: DB

docs_layout:
  total_md_count: 5 (README + ADR/0001-...md ×4)
  cross_ref_density: low
dominant_pattern: flat

entity_lifecycle_signals:
  deprecated_markers_count: 2
dominant_state: stable

complexity_signals:
  entity_type_count: 3 (User / Subscription / Invoice)
  total_files: 200
  contributors_count: 2
complexity_tier: small

recommended_templates:
  primary: 03 (通用代码项目 · module + API + dep)
  secondary: []
  fallback: 不需要

customization_points:
  - 突出 API 路由树 (REST endpoints + middleware chain)
  - DB schema 可视化 (User → Subscription → Invoice 关系图)
  - 不需要 01 (无 CSV) · 不需要 02 (docs 少)

rationale: |
  小型 SaaS · DB 驱动 · 3 entity 类型 · docs 少。
  03 通用模板的 API 路由树 + 模块依赖图最匹配。
  不需要 01 (无 CSV/JSON 实体) 不需要 02 (5 MD 不构成文档密集)。
```
