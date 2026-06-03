# 单文件 HTML 资产清册站（Asset Inventory Station）· 美术总监的实物巡视工具

> 这是《美术总监夕潮》§6.5 的伴随参考文件。
> 给「美术总监如何视觉巡视全量产出资产」提供一套可移植 pattern + starter template。
> 与基础夕潮 `reference/visualization-templates/` 下的 01/02/03 鸟瞰站家族**互补**——那三个看「结构与关系」，本文件看「资产本体」。
> 出处：某 RPG 项目美术 session 实证提炼。

---

## §1 这是什么 · 不是什么

**是**：
- 单 html 文件 + 物理资产文件直引（`<img src>` 指向 webp/png/jpg）→ 双击打开，零构建零服务
- 按资产真源（CSV 真源 / glob 命名规则）分段陈列 → 一眼看到「有什么 / 几个 / 什么样」
- 美术总监 §6.2 一致性巡检的**实物化产出** → 不仅 grep palette token，也用 html 巡视全量产出对照设计 DNA
- 视觉一致性的**跨 session 记忆载体** → 跨周维护时新 session 第一件事可以「先打开看一眼」

**不是**：
- 不是 portfolio / showcase（不刻意"好看"，目标是「能巡视」）
- 不是 audit dashboard（不报错、不算孤儿、不查代码引用——那是 auditor §6b 鸟瞰审计页面）
- 不是 admin panel（只读，无编辑/删除/操作按钮）
- 不是 mood board（在路上的灵感收集是另一类工具，用 Figma / Pinterest）

---

## §2 何时该建 · 何时不该建

**该建**：
- 项目有 100+ 物理资产，按命名规则铺在 `public/` 或类似目录
- 资产有「天然分组」对应真源（怪物按 region / 装备按 rarity / 场景按 chapter）
- 多 session 跨周维护 → 需要跨 session 知道资产现状（防 [[case-library]] #DC 视觉孤岛）
- 资产生成走 AI 工具链（Nano Banana / Gemini 3 / SDXL / Midjourney…）→ 需要工艺溯源（防 [[case-library]] #DG 视觉模式漂移的资产层）
- 美术总监巡视周期 ≥ 双周一次

**不该建**：
- 资产 < 30 个：VS Code preview / Finder cover flow 足矣
- 单 session 一次性 prototype：没生命周期，不值得维护
- 纯产品 UI 截图：走 Figma 或截图工具
- 没有「资产 vs 真源」对照需求（纯灵感图库 → mood board）
- 不会有 AI 协作的纯人工美术线：缺少防漂移收益

---

## §3 7 个设计原则（从实证 dogfooding 提炼）

### 原则 1 · 单文件零依赖，本地直开

写一个 html · 内联 CSS · 必要的 JS 也内联（Lightbox 只需 ~10 行）· 不引外部 JS 库（jQuery / React / Vue 都禁止）· `<img src>` 用相对路径指向物理文件。

**为什么**：双击就能开，在协作者 / AI / 审阅者之间零成本传递。Sticky nav / Lightbox / 网格只需要 ~80 行内联 JS + CSS，引框架是杀鸡用牛刀。

**反面**：引 Vue/React → 需要构建 → 协作者要装 Node → 失败率 ×10 → 几个月后不再有人开它。

### 原则 2 · 物理资产直显，缺图 onError 兜底（不静默隐藏）

```html
<img src="../_asset_samples/11101-tp.webp" loading="lazy"
     onerror="this.style.opacity=.2;this.style.filter='grayscale(1)'">
```

文件存在则显示，不存在则半透明 + 灰度保留位置。

**为什么**：资产清册站的核心承诺是「显示什么 = 真实存在的」。缺图**静默隐藏** → 蒙蔽审阅者；显式占位 → 让缺图变成视觉警示信号（[[case-library]] #DK 陈旧产物的资产层防御）。

**反面**：`onerror="this.style.display='none'"` → 缺图变成「这个 id 根本不存在」假象 → 审阅者以为资产已齐 → bug 埋雷。

### 原则 3 · 真源行号 inline 在每段标题

每个 section 标题旁小字写「来自 X.csv · Y/Y · 工艺 Z · 路径 W」——把数据真源、完成度、工艺、磁盘路径写成一行 meta。

例：
```
§ 怪物（抠图版） · 339/339 · 块面 + 透明底 + 品级勋章 · _asset_samples/*-tp.webp
```

**为什么**：让审阅者不离开页面就知道「这段对照哪张 CSV / 改 CSV 应来这里巡视 / 物理文件在哪个目录」。

**反面**：把数据来源写在文档顶部一句话，中间分段时人忘了——读者扫到中间看到「啊这是干嘛的」→ 又翻回顶部 → 巡视效率打折。

### 原则 4 · 业务分类用色 chip 不是文字

用 `<span class="badge tier-boss">BOSS</span>` 把「品级 / 区域类型 / 资产类别」做成色 chip，贴资产名旁边。

**为什么**：巡视场景是「快速扫视寻找异常」。色 chip → 周边视野能感知分布 → 「我看到这段全是 boss 但没有 wild，是不是配比错了」；纯文字 tag → 必须逐个读才知道。

**反面**：用 emoji（👑/⚔/🔥）当分类——AI slop 指纹（违反美术总监 §3.2）+ 跨平台渲染漂移 + 不能精确控色。

### 原则 5 · 工艺/工具溯源 chip（AI 时代特有）

资产由 AI 生成时，在卡片角落标极小 chip：`Nano` / `3Pro` / `SDXL` / `MJ-v6`——记录这张是用什么模型生成的。

**为什么**：视觉一致性的隐藏元凶是「跨模型混用」。当某天发现某区域怪物质感与别处不一致，溯源 chip 让你立刻知道是不是因为换了模型。这是 [[case-library]] #DG 视觉模式漂移的资产层防御。

**反面**：把工艺编进文件名（`monster-3pro-11101.webp`）——重命名成本高 + grep 一致性难维护 + CSV 引用要同步改；chip 是 html 元数据可独立改。

### 原则 6 · 多种 grid 形态共存，按资产天然比例匹配显示

不强行用「统一卡片尺寸」。例：
- 怪物头像：130px 圆勋章（圆形适合个体识别）
- 区域背景：380×214px 宽卡（16:9 还原氛围）
- 层地图：240×240px 方卡（1:1 像 mini-map）
- 道具图标：80×80px 小方卡（紧凑陈列）

**为什么**：资产天然比例承载信息密度。把 16:9 区域背景挤进方卡 → 看不出地形；把怪物头像拉宽卡 → 浪费屏幕；把道具图标放大到 240px → 巡视时每屏看不到几个。

**反面**：统一卡尺寸是「style guide 强迫症」的延伸——巡视场景中不需要 grid 整齐美感，Pinterest 才需要。

### 原则 7 · Lightbox + 双版本预览（grid 看辨识 / 大图看真实表现）

点卡片放大全屏看大图。资产有「展示版」+「对比版」时（如怪物的 `-tp.webp` 透明底 vs `-ondark.webp` 暗底渲染），grid 显示一个，Lightbox 显示另一个。

**为什么**：巡视的两个时刻需要不同视图——快扫时要辨识（透明底干净一目了然），细看时要真实表现（暗底里实际效果对不对）。

**反面**：资产清册站做成 modal-first 的复杂查看器（切换面板 / 对比模式 / 标注工具）——超出巡视 scope，变成 admin panel。

---

## §4 反例 · 不是资产清册站的形态

- ❌ 加上传 / 删除 / 编辑按钮 → 变成 admin panel
- ❌ 加全屏 lightbox 播放器 + bgm + 自动 slideshow → 变成 portfolio
- ❌ 加注释 / 评分 / 标签管理 → 变成协作工具（用 Figma 评论）
- ❌ 加搜索框 + 多维筛选器 → 资产量 < 1000 不需要，sticky nav 够用；> 1000 应分页或上数据库
- ❌ 用 React / Vue → 失去「双击即开」承诺
- ❌ 缺图静默隐藏 → 失去缺漏警示，变虚假齐全
- ❌ 把生成器逻辑写进 html → 单文件原则下应分离（生成器是 `.py` / `.cjs` / `.mjs`，产物是 html）

---

## §5 与基础夕潮 `reference/visualization-templates/` 的生态位

| 维度 | 鸟瞰审计页面家族（01/02/03） | 资产清册站（本 pattern） |
|---|---|---|
| 看的对象 | 结构与关系（实体 / 边 / 孤儿 / 陈旧） | 资产本体（缩略图 / 计数 / 工艺溯源） |
| 数据形态 | `audit-data.json` 动态驱动 + DOM 渲染 | 物理文件 inline 直引（`<img src>` 指相对路径） |
| 触发的形状防御 | [[case-library]] #DK 陈旧产物 / #DL 缺鸟瞰 | #DC 视觉孤岛 / #DG 视觉模式漂移（资产层） |
| owner SKILL | 审计夕潮 §6b（鸟瞰调研 SOP） | 美术总监 §6.5（资产清册站） |
| 典型项目 | 代码项目（后端 + ADR） / 策划文档密集项目 | 素材密集型项目（数百怪物 / 多层地图 / 数十区域背景） |
| 重生触发 | commit 前钩子 `build_audit_data.{py,mjs}` | 资产改动后 `scripts/_gen_<asset>_review.{py,cjs}`（软纪律） |
| 一句话答案 | "什么坏了 / 谁孤儿 / 谁陈旧" | "有什么 / 几个 / 什么样 / 怎么做的" |

**两者互补**：同一个项目两者都可建——审计走鸟瞰 + 美术走清册，合在一起是「项目身体的两次 CT」（结构透视 + 实物巡视）。

---

## §6 starter template

直接 cp 一份开始改：[`asset-inventory-starter.html`](./asset-inventory-starter.html)

starter 内置：
- sticky nav 框架（4 段示意：3D 模型 / 立绘 / 场景 / 道具图标，按项目实际改）
- 三种 grid 形态 CSS（`grid-square` / `grid-wide` / `grid-medal`，按资产比例切）
- Lightbox 全屏（点卡片放大，点黑背景或 Esc 退出）
- 元数据 chip 配色样例（tier-* / area-* / tool-*）
- 占位段落 + 占位卡片 + 占位 meta（保留 `<!-- TODO -->` 注释指引）
- 顶部 HTML 注释讲怎么改（每段对应真源 / chip 怎么扩 / 重生在哪）

---

## §7 生成器（可选 · 项目特定）

starter 不带生成器——因为生成逻辑高度项目特定（Python 扫 `Monster.csv` + glob `_asset_samples/*-tp.webp` / Node + cjs 扫卡牌 CSV / 其他项目可能是 mjs + 资产 manifest）。

但建议：

- 把 html 生成走 `scripts/_gen_<asset>_review.{py,cjs,mjs}`
- 输入：真源 CSV（一行一资产 + meta）+ glob 路径（物理文件存在校验）+ 工艺 manifest（哪张是哪个模型生成的）
- 输出：单文件 html（直接覆盖既有产物）
- 加进项目 `.claude/rules/assets.md` 作为「资产改动后建议重生」软纪律——**不强制 commit 拦截**，只在 rules 里说"建议"

---

## §8 迭代日志

> 完整迭代日志见仓库根 [CHANGELOG.md](../../../CHANGELOG.md)。本节保留为占位 · 未来本 pattern 单独的迭代变更可记录在这里。
