# audit-data.json 数据契约模板

> **用法**：任何鸟瞰站（01/02/03/兜底）的数据文件都遵循本契约
> **核心约束**：`lifecycle` 字段必填 + `orphans` 由 build script 计算（不要手填）
> **schema_version**：v1.0（2026-05-18 首版）· 升级时改本字段 + 改 README 迭代日志

---

## 顶层结构

```json
{
  "generated": "2026-05-18T12:34:56Z",
  "schema_version": "1.0",
  "project": "<项目名>",
  "primary_language": "<TypeScript / Python / Rust / ...>",

  "stats": {
    "<category>": <count>,
    ...
  },

  "<category_a>": [ ...entity objects... ],
  "<category_b>": [ ...entity objects... ],
  ...

  "orphans": {
    "no_source": [<id>, ...],
    "no_sink": [<id>, ...],
    "removed_with_refs": [<id>, ...],
    "modules_no_callers": [<id>, ...],
    "apis_no_callers": [<id>, ...],
    "external_deps_no_usage": [<name>, ...],
    "deprecated_with_refs": [<id>, ...]
  }
}
```

**`stats` 字段**：每个 category 的 count · 用于顶部 tabs 显示数量。

**`<category>` 数组**：按项目实际需要（heroes / items / modules / apis / docs / ...）· 每个 entity 必须含 lifecycle。

**`orphans`**：build script 自动计算 · 前端只展示不计算。

---

## Entity 字段（每个 category 通用）

```json
{
  "id": "<unique id · 跨项目稳定>",
  "nameCn": "<中文名 · 如有>",
  "nameEn": "<英文名 · 如有>",
  "category": "<分类 · 如 hero / item / module / api>",
  "rarity": "<N | R | SR | SSR | UR · 如适用>",

  "lifecycle": "active | deprecated | removed",
  "createdAt": "<YYYY-MM-DD · 可选>",

  "sources": [
    { "kind": "<source-kind>", "details": "<人类可读描述>", "refId": "<关联 entity id · 可选>" }
  ],
  "sinks": [
    { "kind": "<sink-kind>", "details": "<...>", "refId": "<...>" }
  ],

  "imageUrl": "<视觉资产 URL · 可选>",
  "tags": [<tag>, ...],
  "notes": "<其他 metadata · 可选>"
}
```

### lifecycle = deprecated 时必填

```json
{
  "lifecycle": "deprecated",
  "deprecatedAt": "2026-05-10",
  "deprecatedBy": "<commit hash / decision doc 引用>",
  "deprecationNote": "<人类可读 deprecation 原因 + 替代方案 + 删除计划>",
  "stale_references_count": <number>
}
```

### lifecycle = removed 时必填

```json
{
  "lifecycle": "removed",
  "removedAt": "2026-05-14",
  "removedBy": "<commit hash>",
  "removalNote": "<原因 + 上下文>",
  "lastReferencedIn": [
    {
      "file": "<file path>",
      "line": "<line number 或 grep context>",
      "note": "<如有特殊原因保留 · 说明>"
    }
  ]
}
```

**为什么 removed 也保留 entity**：扫历史 git log 找曾经存在的 entity · 然后 grep 当前代码看是否还有 stale 引用——这是 #DK 防御核心。**不能因为 entity 被删了就从 audit-data 丢掉**——丢掉就看不到 stale 残留。

---

## sources / sinks 的 kind 枚举（按项目类型扩展）

### 通用 kind

| kind | 含义 | 适用模板 |
|---|---|---|
| `default` | 默认配置 / 出厂存在 | 任意 |
| `craft-output` / `craft-input` | 合成产物 / 合成原料 | 01 |
| `shop-purchase` / `shop-cost` | 商店购买 / 商店消耗 | 01 |
| `drop-from-task` / `task-cost` | 任务奖励 / 任务消耗 | 01 |
| `gacha-pool` | 扭蛋抽取 | 01 |
| `mainline-reward` | 主线剧情奖励 | 01 |
| `equip-target` / `equip-use` | 装备目标 / 使用装备 | 01 |
| `module-import` / `module-export` | 模块依赖 / 模块导出 | 03 |
| `api-handler` / `api-caller` | API 处理 / API 调用方 | 03 |
| `db-write` / `db-read` | DB 写 / DB 读 | 03 + DATA-DB |
| `external-api` | 外部 API 调用 | 03 + DATA-API |
| `doc-reference` / `doc-referenced-by` | 文档引用 / 文档被引用 | 02 |

### 项目自定义 kind

项目可自定义新的 kind · 注明在 audit-data.json 顶部加 `kinds_glossary` 字段：

```json
{
  "kinds_glossary": {
    "intimacy-gift": "亲密度赠送（GO宝 收礼物加亲密度）",
    "wallpaper-applied": "壁纸已应用（桌面背景图）"
  }
}
```

让前端在显示时能展开人类可读说明。

---

## orphans 计算规则

build script 实现以下规则：

| orphan 类型 | 规则 |
|---|---|
| `no_source` | entity 没有 sources 数组 OR sources 为空 |
| `no_sink` | entity 没有 sinks 数组 OR sinks 为空 |
| `removed_with_refs` | lifecycle = removed AND lastReferencedIn 非空 |
| `modules_no_callers` | module entity AND depended_by 为空（无人 import） |
| `apis_no_callers` | api entity AND callers 为空 |
| `external_deps_no_usage` | external dep AND used_in 为空 |
| `deprecated_with_refs` | lifecycle = deprecated AND stale_references_count > 0 |

**孤儿 ≠ 必须删**：可能是有意保留的（如反向调教关键词 / debug 端点 / planned 但暂未接入功能）· UI 展示时让 user 看到判断 · 不强制删。

---

## 历史扫描（#DK 防御核心）

build script **必跑**以下步骤获得 removed entities：

```bash
# 1. 列出最近 180 天被删的文件
git log --since="180 days ago" --diff-filter=D --name-only --pretty=format: | sort -u

# 2. 对每个被删文件 · 找到删除时的 commit
git log --diff-filter=D --follow -- <deleted-file>

# 3. checkout 删除前一版 · 解析当时的 entity ID
git show <commit>~:<file> | <parser>

# 4. 把当时的 entity ID 加入 audit-data.json · lifecycle: removed
# 5. grep 当前代码 / docs 找 stale 引用 · 填 lastReferencedIn
grep -rn "<removed_id>" src/ docs/ public/ --exclude-dir={node_modules,.git,dist}
```

**注意**：grep stale 引用时排除变更日志 / commit message / handoff 信（这些天然含历史 entity ID · 不是 stale）。

---

## 字段命名约定

- `id`：英文 kebab-case 或项目原生（如 `gogo-bao` / `kanban-2` / `20003101`）· 不变
- `nameCn` / `nameEn`：人类可读名 · 跟项目语言习惯
- 时间戳：ISO 8601（`YYYY-MM-DD` 或 `YYYY-MM-DDTHH:MM:SSZ`）
- 布尔字段：JSON 标准 true/false · 不要 "yes"/"no" 字符串
- 数字：JSON number · 不要带引号

---

## 验证 audit-data.json 完整性（脚本）

每次 build 后跑：

```bash
# 1. JSON 语法 OK
jq . public/audit-data.json > /dev/null

# 2. 每个 entity 有 lifecycle 字段
jq -e '..|objects|select(has("id") and (has("lifecycle")|not))' public/audit-data.json && echo "FAIL" || echo "OK"

# 3. lifecycle: removed 的有 removedAt + lastReferencedIn
jq -e '..|objects|select(.lifecycle=="removed" and (has("removedAt")|not))' public/audit-data.json && echo "FAIL" || echo "OK"

# 4. orphans 字段存在
jq '.orphans' public/audit-data.json
```

build script 末尾应自动跑这些验证 · 失败时 exit 1。

---

## schema_version 升级路径

未来 schema 改动（增加新字段 / 改字段含义）：

1. `schema_version: "1.0" → "1.1"`（minor · 向后兼容）或 `"2.0"`（major · 不兼容）
2. README 迭代日志记录变更
3. 已有 audit-data.json 自动 migrate（build script 检测旧 version → 自动补字段）
4. 前端读时按 schema_version 处理（兼容 1.x · 拒绝 2.0+ 提示重生）
