# 鸟瞰站定制 Pattern 库（按调研字段索引）

> **用法**：调研报告 `recommended_templates.primary = custom` 时 · 按本文件索引拼组合
> **设计哲学**：不堆模板 4 / 5 / 6 · 而是把"具体定制点"按调研字段索引化 · 让 AI 按字段值拼出鸟瞰站
> **本质**：audit-data.json 数据契约不变（见 `_schema-template.md`）· 实现层 + 可视化层按项目实际定制

---

## 索引：按字段值找 pattern

| 调研字段 | 字段值 | 定制 pattern ID |
|---|---|---|
| `primary_language` | JavaScript / TypeScript | [LANG-JS](#lang-js) |
| | Python | [LANG-PY](#lang-py) |
| | Rust | [LANG-RUST](#lang-rust) |
| | Go | [LANG-GO](#lang-go) |
| | Swift / Objective-C | [LANG-IOS](#lang-ios) |
| | C / C++ | [LANG-C](#lang-c) |
| | Solidity | [LANG-SOL](#lang-sol) |
| | GDScript / Godot | [LANG-GDSCRIPT](#lang-gdscript) |
| `data_sources.dominant_form` | CSV/JSON | 直接用模板 01 |
| | DB | [DATA-DB](#data-db) |
| | API | [DATA-API](#data-api) |
| | hardcoded | [DATA-HARDCODED](#data-hardcoded) |
| | none | [DATA-NONE](#data-none)（最难场景 · 兜底重点） |
| `docs_layout.dominant_pattern` | tree / monorepo | 直接用模板 02 |
| | flat / scattered | [DOC-FLAT](#doc-flat) |
| | wiki-style | [DOC-WIKI](#doc-wiki) |
| | minimal (< 5 MD) | [DOC-MINIMAL](#doc-minimal) |
| `entity_lifecycle_signals.dominant_state` | stable | [LIFE-STABLE](#life-stable) |
| | active-refactor | [LIFE-REFACTOR](#life-refactor) ← 重点 |
| | major-transition | [LIFE-TRANSITION](#life-transition) ← 最重点 |
| `complexity_tier` | prototype | 跳过建站 |
| | small | [TIER-SMALL](#tier-small) |
| | medium / large | 推荐用模板 01/02/03 |
| | mega | [TIER-MEGA](#tier-mega) |

---

## 语言层 Pattern

### LANG-JS (JavaScript / TypeScript)
- **build script**：用 `_build-script-templates/build_audit_data.mjs`（Node ES Modules）
- **依赖扫描**：`package.json` deps + `npm ls` 输出
- **模块图来源**：`ast-grep` 扫 import / require · 或简易 grep
- **API 路由提取**：Express `router.get/post` · Next.js `pages/api/` · Fastify routes
- **常见 stale 信号**：未使用 deps（用 `depcheck`）· `// TODO` `// FIXME` `// DEPRECATED`

### LANG-PY (Python)
- **build script**：用 `build_audit_data.py`
- **依赖扫描**：`pyproject.toml` + `pip list` · 或 poetry/uv lock
- **模块图**：`ast` 模块扫 import · 或 `pydeps`
- **API 路由**：FastAPI `@app.get/post` · Flask `@app.route` · Django `urls.py`
- **常见 stale 信号**：未用 import（用 `pyflakes` / `vulture`）· `# TODO` 注释 · `__deprecated__` decorators

### LANG-RUST
- **build script**：建议 Rust 自己写 `cargo run --bin build-audit-data`（或外挂 Python 简化）
- **依赖**：`Cargo.toml` + `cargo tree`
- **模块图**：`cargo modules` crate · 或扫 `mod.rs` 树
- **API**：actix-web / axum / rocket macros
- **常见 stale**：`#[deprecated]` attribute · `cargo udeps` 未用 deps

### LANG-GO
- **build script**：Go 自己写 `go run cmd/build-audit/main.go` · 或外挂 Python
- **依赖**：`go.mod` + `go mod graph`
- **模块图**：`go list -deps` · `go-callvis` 调用图
- **API**：net/http handlers · gin / echo / chi routes
- **常见 stale**：`// Deprecated:` godoc 注释 · `go-mod-tidy` 检查

### LANG-IOS (Swift / Objective-C)
- **build script**：Python 外挂跑（解 Xcode project / SPM Package.swift）
- **模块图**：扫 `import` + SPM dependencies
- **API**：URLSession + 自定义 router 模式
- **常见 stale**：`@available(*, deprecated)` · 未用 storyboard segues

### LANG-C (C / C++)
- **build script**：Python 外挂
- **依赖**：`#include` 扫描 + CMake / Bazel 解析
- **模块图**：cflow / clang AST
- **常见 stale**：`__attribute__((deprecated))` · `// TODO`

### LANG-SOL (Solidity / 智能合约)
- **特殊场景**：链上合约一旦部署不可改 · 鸟瞰站应展示**合约升级历史 + proxy pattern + 已 frozen 接口**
- **build script**：用 `solidity-parser` 扫 contract / interface
- **关键展示**：upgrade chain · onlyOwner 权限 · ABI 兼容性矩阵
- **常见 stale**：未用 import · `selfdestruct` 风险点

### LANG-GDSCRIPT (Godot)
- **场景**：Godot 等代码项目
- **build script**：Python 外挂扫 `.tscn` `.tres` `.gd` + `project.godot`
- **模块图**：场景树 + autoload + signal 流
- **API**：signal connect / RPC（多人）
- **常见 stale**：未引用 scene · `# DEPRECATED` 注释

---

## 数据层 Pattern

### DATA-DB
- audit-data.json 加 `db_schema` 字段：表 + 关系 + 列 lifecycle
- 鸟瞰站加 ER 图（Mermaid `erDiagram`）
- 数据源：从 migration 文件解析（如 Supabase `supabase/migrations/`）+ ORM model 文件
- **特别注意**：DB 列的 deprecated 通常用 nullable + 注释 · 不删 column · 鸟瞰站要展示

### DATA-API
- audit-data.json 加 `external_apis` 字段：endpoint / 用途 / 调用频率 / 替换计划
- 可视化：API 调用图（哪个模块调哪个外部 API）
- **stale 信号**：弃用的 API endpoint 还在调（如 Bocha old API 已迁 AI Search · 留旧调用 = stale）

### DATA-HARDCODED
- 项目把数据写死在 constants / config 里
- audit-data.json 从 constants 文件解析（如 `src/constants/heroes.ts`）
- **特别警示**：硬编码数据最易 stale 但难发现 · 鸟瞰站要强调 last_updated 时间戳

### DATA-NONE
- 纯算法库 / pure FP / shader / WASM module 类项目
- 没有显式实体数据源 → 鸟瞰对象变成 **API 表面 + module 拓扑 + test 覆盖图**
- 用模板 03 + `_customization-patterns.md` 的 LANG-* pattern 拼接
- audit-data.json 退化为 `modules + apis + tests` 三段

---

## 文档层 Pattern

### DOC-FLAT
- 所有 docs 在一个目录平铺 · 无子分类
- 鸟瞰站不需要侧栏树 · 简单列表 + 搜索即可
- 用模板 02 的简化版

### DOC-WIKI
- 文档跨引用密度高 · 类 wiki 双向链接
- 鸟瞰站加**引用图谱**（哪些 doc 互相引用）· 类似 Obsidian Graph View
- 用模板 02 + Mermaid graph 扩展

### DOC-MINIMAL
- < 5 MD · 只有 README + 几个 ADR
- 不需要 02 策划案审阅站 · 鸟瞰站把 docs 作为模板 03 的一个 sidebar tab 即可

---

## 实体生命周期层 Pattern

### LIFE-STABLE
- 6 个月没大重构 · 实体增删少
- audit-data.json `lifecycle` 字段可简化为默认 `active`
- 历史扫描可降级为每月跑一次（不必每 commit）

### LIFE-REFACTOR ← 重点
- 当前在主动重构（如 V1→V2 等版本切换期）
- audit-data.json **必须**含 `lifecycle: active|deprecated|removed` 完整 3 态
- build script **必须**扫 git log 历史 deleted entities
- 鸟瞰站 UI 突出 deprecated/removed entity 的 `lastReferencedIn` 字段（找漏删引用）
- 审计夕潮 §6 SOP 步骤 5 钩子**必跑**

### LIFE-TRANSITION ← 最重点
- 大版本迁移（V1 → V2 整体重写 / 旧 stack → 新 stack 渐进切）
- audit-data.json 加 `migration_status` 字段：每 entity 标 "in V1" / "in V2" / "both" / "removed in V2"
- 鸟瞰站加专属 dashboard：迁移进度（V2 覆盖率 / V1 残留率）
- pre-commit hook 强制跑 + 报告新增 V1 引用（防回流）

---

## 复杂度层 Pattern

### TIER-SMALL
- 3-5 entity 类型 / 30-100 files / 1-2 contributors
- 鸟瞰站可以**轻量化**：单 HTML 文件 · 所有数据内联（不必拆 audit-data.json）
- 不需要 build script · 手写 audit-data.json 也可接受（< 100 entities）

### TIER-MEGA
- 50+ entity 类型 / 5000+ files / 多团队
- 单页站可能性能受限（Mermaid 图节点过多）
- 拆分策略：按 domain 分多个鸟瞰站（如 `audit/billing.html` / `audit/auth.html` / `audit/inventory.html`）
- 或加分页 / 折叠 / 异步加载
- audit-data.json 按 domain 拆多文件
- 考虑用 D3.js（违反默认 "只用 Mermaid" 约定 · 但 mega 项目必要）

---

## 兜底原则（任何项目都适用的最低保证）

无论项目多冷门 · 鸟瞰站至少包含以下 3 个核心元素：

1. **Project Overview**（项目骨架）：主语言 / 主入口 / module 树 / 最近活跃
2. **Stale Inventory**（陈旧产物清单）：deprecated 标记 + 历史删除 + 当前仍被引用的"幽灵"
3. **Change Surface**（改动面）：最近 30 天活跃的文件 / entity / 模块 · 哪些区域热

这 3 个元素**任何项目都能产出** · 无论是 ML training repo / Rust shader / Solidity / Godot mod / 学术研究脚本——只要项目有 git 历史 + 文件就能算。

---

## 如何调用本文件

调研报告 `recommended_templates.primary = custom` 时：

```
1. 按 recommended_templates.customization_points 找对应 pattern ID
2. 串联 LANG-* + DATA-* + DOC-* + LIFE-* + TIER-* pattern
3. 拼出项目专属 build script + audit-data.json schema + 可视化 HTML
4. 最低保证 3 核心元素（Overview / Stale Inventory / Change Surface）
5. 完工后回填 README.md 的「项目实例」表
```

**示例**：纯 Rust shader 项目
- LANG-RUST + DATA-NONE + DOC-MINIMAL + LIFE-STABLE + TIER-SMALL
- 拼出：cargo modules 模块图 + `cargo udeps` 报告 + shader API 表面（`shaders/*.wgsl` 扫描）+ test coverage tree
- 单 HTML · 数据内联 · 无 build script

**示例**：Solidity 智能合约项目
- LANG-SOL + DATA-NONE + DOC-FLAT + LIFE-TRANSITION + TIER-MEDIUM
- 拼出：upgrade chain 图 + ABI 兼容矩阵 + proxy pattern 可视化 + 已 frozen 接口列表 + migration_status dashboard
- pre-commit hook 必跑（链上合约不可逆 · stale 引用风险极大）
