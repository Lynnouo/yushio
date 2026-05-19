# 模板 01 · 数据流向审计站

> **适用项目**：Game / 数据驱动应用（CSV/JSON 实体）· 5+ entity 类型 · sources/sinks 概念明确
> **典型场景**：游戏向桌宠平台（角色 / 装备 / 任务 / 道具 / 表情）· Slay-the-Spire-like 卡牌游戏 · MMORPG 后台 · 数据管道
> **本质**：可视化"实体生产-消费链" · 找孤儿（无来源 / 无去向）· 追历史删除残留

---

## 何时用本模板

调研报告满足：
- `data_sources.csv` 或 `data_sources.json` 不为空 + 总数 ≥ 3 文件
- `complexity_signals.entity_type_count >= 5`
- 实体有清晰的 "从哪来" + "去哪儿" 概念（如 抽卡 / 掉落 / 合成 / 商店 / 任务奖励）

不适用：
- 纯算法库 / pure FP（无 entity）→ 用模板 03
- 文档密集但数据少（如 wiki）→ 用模板 02
- entity < 5 类型 → 模板 03 简化版即可

---

## 产出物（4 件）

```
public/audit.html              ← 单文件 SPA · CDN 引 mermaid@10 · ~800 行 vanilla JS
public/audit-data.json         ← 数据快照（build 脚本生成）
scripts/build_audit_data.<py|mjs>  ← 从源数据生成 audit-data.json
scripts/audit-pre-commit.sh    ← 可选 · pre-commit 自动重生（见 _pre-commit-hook.sh）
```

---

## audit-data.json 数据契约

详细 schema 见 [`_schema-template.md`](_schema-template.md) · 本节是 01 模板的具体填法：

```json
{
  "generated": "2026-05-18T12:34:56Z",
  "schema_version": "1.0",
  "project": "demo-app",
  "stats": {
    "heroes": 1,
    "equipment": 13,
    "items": 31,
    "headwear": 5,
    "resources": 3,
    "recipes": 8,
    "tasks": 12
  },
  "heroes": [
    {
      "id": "demo-hero",
      "nameCn": "主角",
      "nameEn": "Demo Hero",
      "rarity": "SR",
      "rarityCn": "SR",
      "faction": "default",
      "imageUrl": "/resources/live2d/demo-hero/portrait.png",
      "lifecycle": "active",
      "sources": [
        { "kind": "default-character", "details": "唯一主角色 · 默认装备" }
      ],
      "sinks": [
        { "kind": "equip-target", "details": "所有装扮挂在主角身上" },
        { "kind": "chat-character", "details": "AI 聊天主角色" }
      ]
    },
    {
      "id": "deprecated-npc-2",
      "nameCn": "<某 NPC>",
      "rarity": "—",
      "lifecycle": "removed",
      "removedAt": "2026-05-14",
      "removedBy": "commit <sha> V1→V2 单角色重构",
      "lastReferencedIn": [
        { "file": "<entity>-system.json", "line": "<hero>-identity.keywords", "note": "反向调教关键词 · 不算 stale · 保留" }
      ]
    }
  ],
  "items": [
    {
      "id": "20003101",
      "nameCn": "上号开黑卡",
      "category": "intimacy-gift",
      "rarity": "N",
      "lifecycle": "active",
      "sources": [
        { "kind": "shop-purchase", "details": "金币商店 50G", "refId": "shop-section-intimacy" },
        { "kind": "drop-from-task", "details": "每日任务 task-daily-chat 完成奖励", "refId": "task-daily-chat" }
      ],
      "sinks": [
        { "kind": "intimacy-gift", "details": "送主角 +10 亲密度", "refId": "intimacy-mechanic" }
      ]
    }
  ],
  "tasks": [
    {
      "id": "task-daily-chat",
      "theme": "每日聊天",
      "difficulty": "easy",
      "lifecycle": "active",
      "rewards": [
        { "kind": "item", "id": "20003101", "qty": 1 }
      ],
      "requirements": []
    }
  ],
  "orphans": {
    "no_source": [],
    "no_sink": ["task-old-dungeon"],
    "removed_with_refs": ["deprecated-npc-2"]
  }
}
```

**关键字段**：
- `lifecycle`：必填 `active | deprecated | removed` · `removed` 必带 `removedAt` + `removedBy` + `lastReferencedIn`
- `sources` / `sinks`：每项 `{ kind, details, refId? }` · kind 用项目自定义枚举
- `orphans`：build script 计算 · 不要手填

---

## audit.html 实现要点

### 顶部 header
- 标题：`<项目名> · 数据流向审计`
- Tabs：总览 / 英雄 / 装备 / 道具 / 任务 / ...（按 stats keys 动态生成 · 每个显示 count）
- generated 时间戳 + schema_version 显示

### filters 栏
- 搜索框（按 ID / nameCn / nameEn）
- 稀有度下拉（动态生成 from data）
- 孤儿筛选 checkbox：`☐ 无来源` `☐ 无去向` `☐ removed 还被引用`
- 实时计数：`显示 N / 共 M`

### 总览 tab
- 一张大 Mermaid `flowchart LR` 图 · 把整个经济闭环画出来：
  ```
  抽卡 → 卡池 → 角色 → 委派 → 任务奖励 → 道具 → 商店 / 合成 / 亲密度送礼
  扭蛋 → 装扮 → 角色穿戴
  战绩 → 金币 → 商店购买 / 扭蛋 / 等级
  ```
- 节点用 `classDef` 上色：玩法蓝 · 卡牌橙 · 资源绿 · CP 紫
- 底部图例 + 跳到对应 tab 链接

### 实体 tab 布局（3 栏）
```
[ 缩略图网格 260px ] | [ 中间 canvas 流向图 ] | [ 右侧详情面板 320px ]
```

**缩略图**：3:4 比例 · 图片 + nameCn + 稀有度 badge · 孤儿右上角红角标 · removed 角标灰 + 划线

**点缩略图** → 中间渲染该实体的局部 Mermaid：
```
[ source A ] ─┐
[ source B ] ─┼→ [ 此实体 ] ─→ [ sink X ]
              │                  ─→ [ sink Y ]
```

**右侧详情**：基本字段 + sources/sinks 完整列表 + lifecycle 状态 + （removed 时）lastReferencedIn

### Mermaid dark theme
```js
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#27272a',
    primaryBorderColor: '#3f3f46',
    primaryTextColor: '#e4e4e7',
    lineColor: '#71717a'
  }
});
```

### 渲染 + 缓存
- `fetch('/audit-data.json?t=' + Date.now())` 防缓存
- `mermaid.render('mermaid-id', code).then(({svg}) => container.innerHTML = svg)` 异步
- try/catch 出错时 console.log Mermaid 代码方便调试

---

## 配色（暗色 · 跟 _customization-patterns 一致）

```css
:root {
  --bg: #18181b;
  --bg-card: #27272a;
  --bd: #3f3f46;
  --fg: #e4e4e7;
  --fg-dim: #a1a1aa;
  --fg-weak: #71717a;
  --accent: #10b981;       /* active tab / 详情 h3 下划线 */
  --warn: #f59e0b;         /* deprecated */
  --danger: #ef4444;       /* 孤儿 / removed-with-refs */

  /* 稀有度 badge */
  --rarity-N: #525b6e;
  --rarity-R: #1e40af;
  --rarity-SR: #6d28d9;
  --rarity-SSR: #b45309;
  --rarity-UR: #b91c1c;
}
```

---

## build_audit_data 脚本逻辑

详见 [`_build-script-templates/`](_build-script-templates/) · 核心 5 步：

1. **读源数据**：CSV via pandas/papaparse · JSON via 标准 lib
2. **计算 sources/sinks**：扫 entity 间引用（如任务 reward → 道具 / 配方 input → 道具 / 商店 cost → 资源）
3. **扫历史 deleted entities**：`git log --diff-filter=D --name-only` + 解析当时的 entity ID · 标 `lifecycle: removed`
4. **grep 当前代码 docs 找 stale 引用**：`grep -rn "<removed_entity_id>" src/ docs/ public/` → 填 `lastReferencedIn`
5. **算孤儿**：`no_source` = 无 sources 数组 · `no_sink` = 无 sinks 数组 · `removed_with_refs` = lifecycle=removed 但 lastReferencedIn 非空

孤儿检测**写在生成脚本里 · 不要写在前端**——前端只展示 · 不计算。

---

## AI 协作钩子（必跑）

审计夕潮 §6 修复审计 5 步 SOP 步骤 5：

```
修代码 commit 前：
1. 跑 build_audit_data → 重生成 audit-data.json
2. git diff audit-data.json：
   - orphans.no_source 数变化
   - orphans.no_sink 数变化
   - orphans.removed_with_refs 是否新增
   - 新增 entity 是否有 lifecycle 字段
3. 上述任何异常 → commit message Review 段必须解释（如 "新增孤儿 task-x · 因为新功能未接入完毕 · 见 TODO")
```

**违反此钩子的 commit 视为审计纪律违纪**（同 #L 修实例不修 pattern）。

---

## 验证清单（建站完成后跑）

- [ ] `public/audit.html` 浏览器打开（`file://` 或 `npx serve public`）
- [ ] 总览 tab 显示完整经济闭环 · 节点 classDef 色彩生效
- [ ] 每个实体 tab 缩略图 + 流向图 + 详情都渲染
- [ ] 孤儿筛选生效（手动 inject 一个无 source 实体到 JSON · 看是否被标红）
- [ ] removed 实体显示灰色 + lastReferencedIn 完整
- [ ] build_audit_data 脚本可重复跑（idempotent · 同一源数据生成相同 JSON）
- [ ] audit 钩子接入审计夕潮 §6 SOP 步骤 5（手动跑一次 commit 验证）

---

## 跟 02 / 03 模板组合

游戏数据驱动 + 文档密集型项目通常 = 01 + 02 组合：
- 01 主导（CSV 数据流是核心）
- 02 作为一个 tab（docs/ 80+ MD 导航）
- 单 `public/audit.html` 页 · 顶部 tabs 加 "策划案" 一栏 · 内部嵌 02 的 markdown 渲染逻辑

组合不是 "建两个独立站" · 是 **一个站融合两套数据**。
