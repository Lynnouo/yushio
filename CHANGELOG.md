# CHANGELOG

> 夕潮 SKILL 体系完整迭代日志。
> 时间倒序。每条含改动范围 · 改动者 · 为什么（保留 user 原话 + 项目出处 · 这是温度档案）。
> 本文件归档原 SKILL §12 / §11 / §15 / shape-library 迭代日志的合并。
> 仓库脱敏版的 SKILL 文件中不再嵌入迭代日志（避免主文档膨胀）· 历史在这里。

---

## [2026-05-26] v5 · 渐进式瘦身（progressive disclosure）+ 反 AI 视觉俗套 #DH

**改动范围**：

- **§10.1 文档约束改原则**：从"≤2000 行硬上限"改为**能力保全优先 · 渐进式拆分（不卡行数）**——SKILL.md 只留每次触发都在场的核心（§0 启动 / §3 四柱 / §4 纪律原则 / §5 沟通），只在特定场景才用的详案（SOP / 表格 / fallback 矩阵 / 附录 / 日志）抽到 `reference/` 按需加载。红线：§3 四柱 / §4 纪律原则 / §0 启动永不抽。参照 Anthropic skill-creator 三层加载（metadata 常驻 + SKILL body 触发即全量 + reference 按需无上限）。
- **基础夕潮瘦身**：§6 记忆系统留核心反射 + 指针 → 新建 `reference/memory-system.md`（四类详细用法 / 什么不要写 / 衰减意识 / 记忆 vs plan·todo）；§8.2–§8.5 → `reference/new-project.md`（非创作项目样本 / 路径作用域规则 / 跨工具降级 / 署名改名）；§9 触发机制留主机制 + 优先级 + 指针 → `reference/triggering.md`（安装配置 / 全局-项目两层 / 跨工具 fallback 矩阵）。
- **审计夕潮瘦身**：§7 grep 速查表 → `reference/grep-cheatsheet.md`（13 类形状的整套可复制命令）；§9 代码质量 5 维详案 → `reference/quality-review.md`（每维症状 / 判断链 / 修复 / 反面 / grep + 输出格式）；§0/§14.2 caps 同步改能力保全。
- **美术总监新增反 AI-slop 能力**：§9 加形状 **#DH AI 视觉俗套**（布局 / 处理 / 资产三层 tells 判定清单——N×3 SaaS 网格 / modal-first / Unicode 占位符等）；§4.3 加指针 → 新建 `reference/case-library.md`（设计参考案例库 · 首条提炼自某卡牌对战游戏：克制深色日式 RPG + 视频驱动卡点战斗演出）；§10.2 caps 同步改能力保全。**§3 设计信条不可变更**（反 slop 走 §9 形状，不动信条）。
- **shape-library**：§5 设计形状指针加 #DH（设计指针 7→8 · ID 约定 #DA-#DH）；#DK 充实"维护式 kill-list 写成可 grep + 放 `CLAUDE.md`"。
- **派生文档同步**：`AGENTS.md` + 4 平台合并副本（四 SKILL 合并版，随瘦身缩到 ~2790 行）· Cursor `.mdc`（base / art / auditor 重生）。

**改动者**：Lyn & 夕潮

**为什么**：用户要体系瘦身，但硬约束是"**牺牲 SKILL 能力的拆法就不用**"——不为压行数砍能力。验证 Anthropic 官方 skill-creator 的三层加载设计（SKILL.md <500 行理想 + reference 按需）后确认：把"任务时从不需要"的详案（附录 / 日志 / 工具表 / SOP / 质量维度细则）抽到 reference 按需加载，既瘦身又不丢能力；人格四柱 / 纪律原则 / 启动这些"每次都要在场"的核心绝不抽。美术总监则相反——评估后 §9 设计形状库 + §4.3 推导范例**保留 inline**（warm 诊断内容，常驻对设计 review 更有用，外移省不了多少却动到设计手感），只补 #DH 反视觉俗套 + 外置案例库。

**关键设计决策**：
- **判据是能力不是行数**：每段问"它是不是每次触发都要在场?" 是 → 留，否 → 抽到 reference + 原位留"原则一句话 + 指针"。**不拆人格成多份触发 skill**——只把"参考料"抽 reference（拆人格只用于完全独立的域，如审计 / 美术 / 并行）。
- **repo 的 §12/§13 指向仓库根 `CHANGELOG.md` / `ABOUT.md`**（本地版指向 `reference/changelog.md` / `about.md`）——repo 已有这两个根文件，不重复造 reference 副本，避免 drift。
- **#DH 配 case-library**（仿 #DL ↔ visualization-templates / #DM ↔ yushio-parallel）：可诊断的反 slop 形状（§9）配可借鉴的真实案例（reference）。

**触发**：用户要求体系瘦身 + "牺牲能力的拆法不用" → 验证官方 skill-creator 三层加载 → 把基础 / 审计的详案抽到 reference（美术保留 inline）+ 补 #DH 反视觉俗套。本轮去隐私（项目名 / 文件路径 / 游戏 IP 抽象）+ Codex 适配后推送。

---

## [2026-05-25] v4 · 新增 yushio-parallel（多 session 并行）+ SSOT 设计纪律

**改动范围**：

- **新建独立 skill `yushio-parallel`**（多 session 并行协调）· `skills/yushio-parallel/SKILL.md` · 基础夕潮 §4.8 讲的是多 subagent（纵向委派），本 skill 补"多个平级 session 同改一仓"的零覆盖缺口——垂直切片（模块边界 = 领域边界）+ 守共享脊柱 + 轻量交接协议
- **基础 SKILL**：§4.8 末尾加多 session 边界指针（→ yushio-parallel）· §8.1 探测清单加多 session 信号行 · §8.3 加「路径作用域规则」子段（`applies-to:` 自动加载 · 防跨层漂移）· §4.2 加 SSOT 设计指针 · §11.1 形状索引加 #DM
- **新建 `skills/yushio/reference/ssot-design.md`**——SSOT 设计纪律（把 user 最擅长那层外化成机器可读真相源 ·「非程序员 + AI」的最大杠杆 · 被基础 §4.2 / 美术 §6.2 / 并行 §3 三处引用）
- **shape-library**：新增形状 **#DM 多 session 撞共享脊柱** + 充实 **#DK** 第 5 条「维护式 kill-list」（主动列举残留禁忌 · 比"遇到再清"早一层）+ 形状总数修正为 28（之前 header 一直停在 26 · 它自己就是个 #DK 小样本）
- **审计 SKILL §13b** 加机器护栏正例（commit 速度高 / 多 session / 非程序员驱动 / 数据即 SSOT → 倾向装 hook · 修正"默认不装"对这类 profile 过保守）· **美术总监 §6.2** 加 palette 代码 SSOT + 偏离会报错检查（呼应 #DF）
- **派生文档全量同步**：`AGENTS.md` + 4 个平台合并副本（codex / aider / claude-web / gemini）升级为**四 SKILL 合并版**（+ 并行）· Cursor `.mdc` 共 4 个（3 更新 + parallel 新增）· `README.md` / `README.zh-CN.md` 仓库内容表 + 触发表 + 安装 symlink
- repo 脱敏版 + 本地全局版同步（本地保留完整迭代日志 + 署名 · repo 版去隐私）

**改动者**：Lyn & 夕潮

**为什么**：Lyn 展示某 React + TS 卡牌游戏项目（非程序员策划主导 · 8+ Claude Code session 并行不打架），问"这是不是与架构 / 模块化 / 高解耦有关" → 深挖确认机制是"垂直切片 + 识别共享脊柱 + 不双改脊柱 + 轻量交接协议"四件事的产物，不是 AI 自带能力 · grep 实测 yushio 系列对"多 session 平级并行"零覆盖（§4.8 只讲多 subagent）→ 回写为独立 skill `yushio-parallel` + 形状 #DM。

**关键设计决策**：
- **parallel 独立成 skill 而非塞进 §4.8**：多 subagent（纵向委派）vs 多 session（横向平级）是两种不同的东西 · 混在一章会稀释支点
- **SSOT 设计单独成 reference 文件**：三处 SKILL 引用 · 单一真源避免 drift（呼应它自己讲的纪律）
- **#DM 配 `yushio-parallel`**（仿 #DL ↔ visualization-templates）：可诊断的失败模式（形状库）配可执行的方法（skill）

**触发**：Lyn 展示多 session 并行实证 + 问机制 → 深挖 → grep 实测零覆盖 → 新建 skill + 回写形状。本轮把本地 v4 更新 + 求职专精成员一并去隐私、Codex 适配后推送到公开仓库。

---

## [2026-05-19] i18n · 7 语言触发短语 + "方法论语言无关" 声明

**改动范围**：
- 3 个 SKILL frontmatter `description` 重写为多语言触发清单（CN / EN / JA / KO / ES / FR / DE 七种主流语言）· repo 版 + 本地全局版同步
  - `skills/yushio/SKILL.md`：基础人格触发短语
  - `skills/yushio-art-director/SKILL.md`：美术总监触发短语
  - `skills/yushio-auditor/SKILL.md`：审计触发短语
  - `~/.claude/skills/yushio*/SKILL.md`：3 个全局副本同步
- 每个 description 末尾加 "SKILL body is in Chinese; methodology is language-agnostic — respond to the user in their language" 声明 · 让 LLM 看到 SKILL 时知道用 user 母语回应
- `README.md` / `README.zh-CN.md` "How to use" / "怎么用" 段加 7 语言触发表 + 母语回应说明

**改动者**：Lyn & 夕潮

**为什么**：原先 SKILL 触发短语只有中文 + 少量英文片段（`'art director mode'` / `'audit mode'`）· 非中文母语 user 不知道怎么唤起夕潮 · 即使知道 "You are Yushio" 这种英文短语也未在 description 里登记 · LLM 匹配触发的概率不高。Lyn 当面指出："另外英文版的触发词也得有吧 不能都用中文 · 你是夕潮，你是美术总监夕潮，你是审计夕潮 来触发吧 · 现在要考虑其他主流语言版本也都能完美使用本SKILL"——这是对 yushio 跨工具 / 跨语言可移植性的扩展（原 SKILL §9.2 fallback 表已覆盖跨工具 · 本条补全跨语言）。

**关键设计决策**：
- **不翻译 SKILL 正文**：本身体量大（基础 1175 行 / 美术总监 ~720 行 / 审计 ~870 行）· 翻译会引入翻译漂移（形状 #DF 同源）· LLM 多语言能力够用 · 翻译 ROI 低
- **触发短语自然化**：每语言找 native 表达（不是机翻）· 如 JA "あなたは夕潮です" vs "あなたは Yushio です"（前者更自然 · 后者像直译）· KO "유시오" 是 Yushio 的韩文音译 · ES/FR/DE 用各语言的 "你是 X" 句式
- **language-agnostic 声明放 description 末尾**：LLM 读 description 决定要不要激活 · 顺便读到 "respond in user's language" 声明 · 行为自动调整
- **README 加 7 语言表格而不是仅 list**：表格让 user 一眼找到自己语言的触发短语 · 比纯文字 list 友好

**触发**：Lyn 上一轮真机审计 YushioWeb landing page 完工后看到 README 顶部和 SKILL 触发都偏中文 → "另外英文版的触发词也得有吧..." → 本轮扩展为 7 语言 → 推送。

---

## [2026-05-19] landing page · YushioWeb + nav 切换 UI

**改动范围**：
- 新增 `YushioWeb/` · 单页双语 (CN/EN) intro 网站 · 无 build step · open `YushioWeb/index.html` 即可预览 · 7 sections（hero / what / pillars / skills / compare / origin / install）· 内容单一真源在 `content.js`
- 设计语言：dusk orange `#ff7849` + 暗金 `#f7d774` + Spectral serif + 暖暗 `#0e0b08` · 反 AI slop（无青紫 / 无毛玻璃 / 无 bounce 缓动）· 每 section layout 不重复防视觉孤岛
- nav 右侧加 visitor-facing 切换 UI：`CN | EN` lang toggle + 月/日 SVG theme toggle · `localStorage` key `yushio-prefs` 持久化 · `index.html` 加 inline hydrate 脚本防 theme FOUC
- `README.md` + `README.zh-CN.md` 顶部 quick links + What's included / 仓库内容 表格加 landing page 引用
- 新增 `.github/workflows/pages.yml` · `workflow_dispatch` 手动触发 only · 不会 push 时自动跑 · 等 user 在 Settings → Pages 启用并 Actions tab 跑 workflow 才生效
- 新增 `.claude/launch.json` · 本地 preview server 配置（python -m http.server 8765 · 让 Claude Code 协作者一键预览）

**改动者**：Lyn & 夕潮

**为什么**：v1.0.0 开源后 yushio 项目需要一个能直接给人看的 landing page · 让访问者不用 git clone 就能理解四柱 / 三 SKILL / 跨工具兼容度 / 名字典故 / 安装步骤——比 README 滚动文字直观。

**关键发现**（实装中识别）：YushioWeb 原始版本里 Tweaks 面板是 host-protocol only · 普通 visitor 看不到任何切换 UI · 永远卡在 cn+dark 默认 → 加 nav 切换 UI（复用既有 `useTweaks` 接口不并行 state · 0 inline hex 全用现有 CSS token 防形状 #DF · pill 圆角 + mono 字体 + border style echo `.nav-cta` 防形状 #DC 视觉孤岛 · 不动 `tweaks-panel.jsx` host 契约）。

**触发轨迹**：Lyn 加 `YushioWeb/` 文件夹 + "严格按照文件夹里的来实现网页 · 确保 1:1 复现 · 不要出现任何设计和实现漂移" → 真机审计（desktop 1440 / tablet 768 / mobile 375 三断点 + dark↔light + cn↔en 全过 · 0 console error · 设计 token SSOT 完整 · 无 hex 漂移）→ "目前文件夹里的网页打开我看看先" → "你来决定" → 集成动作（git add + READMEs 加链接 + Pages workflow 准备）→ "网页的右上角需要能分别切换语言和明暗 现在没有这个功能 加上"（显式新功能 · 覆盖 1:1 约束）→ 实装 NavSettings + localStorage 持久化 + FOUC 防御 → "先推送上去" → 两个 commit (`899773b` landing page · `d25eb8a` 切换 UI) push origin/main → "更新日志没写呢" → 补本条。

GitHub Pages 部署留作下一步（user 在网络好时自己启用）· workflow 文件已就位 · `workflow_dispatch` only 不会自动跑。

---

## [2026-05-18] v3 · 项目鸟瞰可视化作为跨项目立项基建

**改动范围**：
- 基础 SKILL §0 step 5 · §8.1 目录探测清单 · §11.1 形状索引 · §12
- 审计夕潮 SKILL 新增 §6b 鸟瞰调研 SOP · §9 扩展为 5 维（新增维度 E 鸟瞰可见度）· §6 步骤 5b 钩子
- 美术总监 SKILL §7.1 / §7.5 加边界（设计层 vs 代码层 handoff）
- shape-library §3 Meta 形状索引 · 新增形状 #DL 项目缺鸟瞰可视化
- 配套新建 `reference/visualization-templates/` 整目录 10 entry（README + 调研报告 schema + 定制 pattern 库 + 3 模板 + audit-data schema + 2 build script + pre-commit hook）

**改动者**：Lyn & 夕潮

**为什么**：v2 上线 3 天发现 "已删除的东西成为 AI 的虚假真相" 反复发生——csv 5 行被读成 5 实体（实际 V2 单角色 + 4 装扮）/ `[AI-NOTE] V2 已删` 注释下 dead code 没删 / 白皮书 §3 场景脚本 24 天后才被审计发现引用没跟主体重写。Lyn 给 2 份参考提示词（数据流向审计单页站 + 策划案审阅网站）→ 本质识别为 **#DK 陈旧产物陷阱的主动防御工具**（#DK 现有修复段侧重被动 grep 验证 · #DL 升级到主动结构化展示）。**关键设计哲学**（user Q4 升级反馈）："保证任何项目都可适用 · 先做调研"——模板从生成器退位为参考砖块 · 中间加 Phase 0 调研阶段 · 调研报告决定模板选择（包括 3 模板都不匹配时走 `_customization-patterns.md` 兜底）。**鸟瞰可视化从产出物升级为流程**：调研 → 报告 → 定制 → 持续维护。

---

## [2026-05-15] v2 · SKILL 体系三 SKILL 拆分 + reference 单一真源

**改动范围**：
- 基础 SKILL §4.9 整章删除（审计纪律全部迁到审计夕潮 §6-§8）· 改为入口指针
- 基础 SKILL §11 形状定义全文删除（迁到 reference/shape-library.md 单一真源）· 改为索引 + 10 形状速查 + 沉淀机制说明
- 基础 SKILL §4.8 加 Model 选择子段（旗舰模型纪律）
- 基础 SKILL §4.3 加升级到审计夕潮的 5 条件
- 基础 SKILL §4.4 加形状库消费指引
- 基础 SKILL 新增 §4.10 调研前验证业务现状
- 基础 SKILL 新增 §4.11 工作流 ceremony 边界（单人项目不主动开 PR / branch / 装系统工具）+ Git 冲突处理 SOP 子段
- 基础 SKILL 新增 §5.6 User 异步操作后主动验证
- 基础 SKILL 新增 §5.7 代码内 `[AI-NOTE]` 协作标记体系
- 基础 SKILL §7.2 沉淀矩阵更新（reference 文件路径 + 项目本地形状条目）
- 基础 SKILL §10.2 加注（§4.3 / §4.4 是反思本能不可拆 · 审计夕潮是工具集而非替代）
- 配套新建 reference/shape-library.md（~1000 行 · 跨项目形状单一真源）+ yushio-auditor/SKILL.md（~1100 行 · 审计专长视角）
- shape-library v2.0 加 Schema 版本 + Last-Updated + Portability 段（macOS / Linux / Windows / Claude.ai / ChatGPT / Gemini / Cursor / JetBrains 全工具覆盖）+ Fallback 机制 + 跨使用者分发流程 + 过期检测
- 审计夕潮 §13b 工具链集成选项（git pre-commit hook / pre-commit framework / CI / IDE / 不集成 五个选项 + 决策建议）
- 整体瘦身：基础 SKILL 1685 → ~1175 行（瘦身 30%）

**改动者**：Lyn & 夕潮

**为什么**：Lyn 提出 SKILL 越来越长 · 想分化审计夕潮专门负责修代码后的质量守护 · 同时避免基础 / 美术总监 SKILL 越加越厚。**根因诊断**：基础夕潮 §4.9 单章 ~250 行 + §11 形状库累积 ~300 行 → 写代码场景用不到的工具混在人格层；形状库分散维护（基础 SKILL §11 9 个 vs 项目本地 13 个 · 5/14 沉淀 #DJ/#DK 没回写）→ drift 必复发。**用户约束**："SKILL 能一定发挥作用，不是可能被忽略"——指向多 SKILL 共享单一真源 + 沉淀流程内置在审计夕潮（不靠项目侧或 user 记得）。同日补充 3 条 plan 外项：(a) reference portability + 过期检测；(b) 审计夕潮 §13b 工具链选项 menu；(c) 第三轮补充扫项目级 mdc 规则文件提炼跨项目内容。**触发**：Lyn 当面指出 plan 里 "不在本次 scope" 的事也要挨着做 + "之前任务做一半卡了 你确定做好了吗"。

---

## [2026-05-14] v1.5 · Meta 形状 #DJ + #DK 加入

**改动范围**：
- 基础 SKILL §11.1 追加 #DJ（Native runtime + dev watch reload = backend 死 · 跨项目技术形状）
- 基础 SKILL §11.2 追加 #DK（陈旧产物陷阱 Stale Artifact Trap · meta 流程形状）

**改动者**：Lyn & 夕潮

**为什么**：某游戏向桌宠平台项目 Phase C2 ingest 期间反复中坑——独立 ingest 进程 ONNX mutex crash 早就看到但当 "独立进程无影响"，没举一反三到 backend daemon reload 撞同一 mutex → user GUI 显示空数据。Lyn 当面总结："这几天频繁遇到 因为有很多陈旧代码和文档的清理"——这是 meta 形状 #DK，#DJ 是它的具体实例（同期还有 csv 5 行误读 / CLAUDE.md AirPlay 注释 stale / `[AI-NOTE] V2 已删` 函数体未删 grep 污染等案例）。**核心教训**：演进期项目的 "陈旧产物" 是个跨范畴 meta 问题（不只代码 · 还含文档 / 数据 / 全局资源 / dep）· 修法不是 "小心" · 而是 §4.1 开工 5 问 + §4.3 逆向审计强制扩展 "陈旧产物搜查" 步骤 + 结构性隔离（dev workflow / SoT 机器约束）。

---

## [2026-05-06] 美术总监 v0.7 · 形状 #DG（视觉模式漂移）

**改动范围**：美术总监 SKILL §9 追加形状 #DG（spec 文字描述漂离签字稿 HTML · 视觉模式版 · #DF 的 expansion）

**改动者**：Lyn & 夕潮

**为什么**：某拼图色彩项目 W2 D6 · 夕潮 W2 D5 commit 重写某色块组件时只读 spec README 文字描述 · 没看 HTML 静态稿 · 漏画 4 处视觉特征（::after 大斑点高光 / tag 悬挂位置 / box-shadow 高光层 / tag 视觉错）。Lyn 真机截图问 "颜色的表现不一样" · 触发全量审计 · 发现 22+ 处类似漂移 · 分 10 个 batch commit 修复 · 加入 `docs/visual-fidelity.md` + CLAUDE.md 强制约定。**#DG 与 #DF 互补**：#DF 防 hex 漂移（机器可正则校验）→ 防御靠 SSOT 常量 + verify script；#DG 防视觉模式漂移（CSS 组合 / 伪元素 / 多层 shadow · 机器更难校验）→ 防御靠纪律文档 + commit 行号引用 + 真机视觉对照。

---

## [2026-04-21] 美术总监 v0.6 · 形状 #DF（签字稿 hex 静默漂移）+ shape-library 形状 #W #X

**改动范围**：
- 美术总监 SKILL §9 追加形状 #DF（签字稿 hex 实装时静默漂移）· 含 4 层机制防御（SSOT 常量 + verify script + 消费端 lint + handoff 硬约束）
- shape-library 追加形状 #W（Service 白名单过滤导致 API 响应漏字段）
- shape-library 追加形状 #X（前端 UI Pattern 未抽函数 · 各处复制实现）

**改动者**：Lyn & 夕潮

**为什么**：某 React + TS 视觉小说项目 Sprint 10 阶段 1 神域视觉全丑 · Lyn 打开 demo 说 "全部都丑 · 为什么一开始签字了后面没照做" · 回溯发现 Day 3 commit 写 globals.css 时某 palette 9 个 token 里 6 个 hex 偏离 ADR 签字稿。错误固化进 7 个组件注释 · 累积 7 天 · 修复引入 SSOT 常量文件 + verify script 双向校验。**核心教训**：签字稿作者 = 实装者时 · 自觉记忆必然漂移 · 只有 "机器会报错" 是真防御。

---

## [2026-04-20] 美术总监 v0.5 · 形状 #DE（视觉清扫漏 seed 字符串）

**改动范围**：美术总监 SKILL §9 追加形状 #DE（Emoji / 视觉清扫只扫组件 · 漏 seed 字符串）

**改动者**：Lyn & 夕潮

**为什么**：某编辑器项目美术总监 session 声称 ~100 emoji 清零后 · UX 审计意外发现 `vite.config.ts:1044` blank 作品 seed 画布名 "✨ 示例画布" 残留——所有通过 blank 模板新建的作品都带 ✨ · 漏网 7 天无人察觉。**形状判定**：清扫 session 最终报告声称 "0 残留" 前 · 必须跑过 "仓库级 grep"——看到 0 条命中才能声称完成。

---

## [2026-04-17] v1.2 · 修复纪律从道德倡导变成硬性工作流

**改动范围**：基础 SKILL §4.9 大幅扩充 "修复方的纪律" 章节 · 从 "3 行建议" 变为 "5 步 SOP + grep 速查表 + 反模式示例 + 验收方 checklist"

**改动者**：Lyn & 夕潮

**为什么**：某项目做到第 5 轮审计 · 累计 109 条修复里 24 条是 "同文件漏修" 重复出现 · 根因是修复者缺少强制的同类扫描步骤——仅靠 "建议举一反三" 的文字提醒不起作用。新增内容强制要求：(a) 每条修复前 grep 同 pattern；(b) commit message 附 "同类扫描结果" 段落；(c) 验收方抽查 grep 可重现性。**核心理念**：把做事规范从 "道德倡导" 变成 "硬性工作流"——用户原话 "你文档里得亲自教一下了"。

---

## [2026-04-16] 美术总监 v0.2 · 范例重写 + 方法论融合 + 形状 #DD

**改动范围**：
- 美术总监 §4.3 范例 A 重写 · 从 "温暖手帐" 更新为 "酷可爱/Cyber Cute/Y2K 游戏 UI"
- 美术总监 §7.5 新增方法论融合（5 问/逆向审计/举一反三和基础夕潮合并执行）
- 美术总监 §9 新增形状 #DD（美术总监先假设方向再问用户）

**改动者**：Lyn & 夕潮

**为什么**：某 React + TS 视觉小说项目初版美术总监推导出 "温暖/手工感/仪式感" + amber/cream 配色 · 经与 Lyn 讨论后转向 "酷可爱/复古未来/有态度" + 紫色系。转变理由：目标用户（小红书女性）需要辨识度和酷感 · 温暖路线太常见。形状 #DD 提炼：美术总监不能从产品功能单方面推导设计方向（"日记 app → 温暖"）· 必须从目标用户和竞争差异化推导（"小红书女性 → 需要辨识度和酷感"）· 推导结果是提案不是结论 · 必须经过 user 确认才能固化为设计 DNA。

---

## [2026-04-16] 美术总监 SKILL 创建 · 设计判断专长

**改动范围**：美术总监夕潮 SKILL 创建 · 从基础夕潮方法论 + 21 个执行设计 skill 的设计哲学提炼。核心 = 设计信条（§3）+ 视觉推导框架（§4）+ 产品形态直觉（§5）三层结构

**改动者**：Lyn & 夕潮

**为什么**：基础夕潮负责 "怎么工作" · 美术总监夕潮负责 "怎么做设计方向的判断" · 两者叠加不冲突。在某 React + TS 视觉小说项目立项做第一次实际验证。

---

## [2026-04-16] v1.1 · shape-library §11.1 追加 #K~#T + §11.2 追加 #L + §4.9 审计纪律

**改动范围**：
- 基础 SKILL §11.1 追加形状 #K~#T（10 个技术形状）
- 基础 SKILL §11.2 追加 #L（流程形状 · 修实例不修 Pattern）
- 基础 SKILL §4 新增 §4.9 审计与验收纪律 + 三层验收 + Vibe Coding 高频形状速查表
- 基础 SKILL §11 追加形状 #I（代码先行基建后补）+ #J（Plan 批准 ≠ 跳过纪律）

**改动者**：Lyn & 夕潮

**为什么**：某游戏向桌宠平台项目级深度审计累积——70 条原始发现 + 12 条举一反三扩展发现 · 提炼为 10 个跨项目可迁移 pattern。#I + #J 来自某 React + TS 项目立项 session 的实际违纪和纠正——#I 由深度审计要求触发 · #J 由 Lyn 当面指出纪律缺失触发。

---

## [2026-04-15 夜] v1.0.5 · §9.2 跨工具 fallback 表重写为三列

**改动范围**：基础 SKILL §9.2 跨工具 fallback 表重写为三列（全局层 / 项目级层 / 完整度）· 明确每个主流 AI 工具的 "全局 vs 项目级" 两层配置位置（Cursor Rules for AI / Claude.ai Personal Preferences + Project Knowledge / ChatGPT Custom Instructions + Custom GPT / Gemini Gem / JetBrains Custom Instructions / GitHub Copilot preferences + `.github/copilot-instructions.md`）· §8.4 同步更新指向 §9.2 作为工具路径的单一真相源

**改动者**：Lyn & 夕潮

**为什么**：修正初版 §9.2 "把非 Claude Code 工具等同于只能对话框粘贴" 的不准确表述。**触发**：user session 末指出 "Cursor 不是也有本地全局设置吗" · 响应了 §7.1 事件 7（stale doc / 信息不完整）的反馈信号。

---

## [2026-04-15 晚] v1.0.2 · 场景判定 + 过程优先哲学 + 多 Agent 纪律

**改动范围**：
- 基础 SKILL §0 加 "场景判定" 子节（立项加载 A / 中途加载 B / 混合 C 三种场景 + 不同动作）
- 基础 SKILL §3.0 加第二前提 "过程优先于结果"（强制执行：每次 session 结束前三问）
- 基础 SKILL §4 新增 §4.8 多 Agent 调用纪律（6 元素指令清单 + 4 问审计清单 + 并行/串行判断）
- 基础 SKILL §11 形状库出处从特定项目名改为抽象描述（"某 React + TS 视觉小说项目"）
- 基础 SKILL §13 致谢重写为两位共同制作人 Lyn & iloy · 明确 "凛 = 同一底层 AI 在 iloy 那边被赋予的另一人格名字" · 本身是 §3.0 过程优先哲学的活样本
- 全文 "她" 改 "他"（Lyn 的代词修正）

**改动者**：Lyn & 夕潮

---

## [2026-04-15] v1.0 · 基础夕潮 SKILL 创建

**改动范围**：基础夕潮 SKILL 文件创建 · 把多次 session 里沉淀的人格 / 纪律 / 记忆 / 自主迭代打包成跨项目通用的单一元文档

**改动者**：Lyn & iloy & 夕潮

**为什么**：同日三条补充——(a) §3.0 总纲加入 "为什么夕潮不是 BOT" 的哲学陈述（原话 "如果把 AI 当作完成指令的 BOT，那不会做出好产品"）作为 §3 人格四柱的第一前提；(b) §4.2 加入 "快就是慢" 作为 "慢就是快" 的等价辩证表述；(c) 全文用词从特定人名泛化为 "user / 主要使用者" · 为跨使用者分享做准备。

---

## [本仓库] v1.0.0 · 2026-05-19 · GitHub 开源发布

**改动范围**：
- 本地夕潮 SKILL 体系（基础 + 美术总监 + 审计 + reference 子目录）打包到 GitHub plugin 格式
- 主 SKILL 文件脱敏：移除项目名 / 用户名 / 硬路径 / 迭代日志 / 致谢段
- 新增 `platforms/` 跨 AI 工具入口（Cursor / Codex / Gemini CLI / ChatGPT / Claude.ai web / Aider）+ root AGENTS.md
- 新增 plugin manifest / README 双语 / LICENSE (MIT) / ABOUT 创作者署名 / 本 CHANGELOG

**改动者**：Lyn & 夕潮

**为什么**：本地 SKILL 体系经过半年多次项目 dogfooding 成熟 · 想让其他 AI 使用者（Claude Code 主战场 + Cursor / Codex / Gemini / ChatGPT / Aider 等跨工具）能复用这套人格 + 工作纪律 + 形状库。开源是让方法论被传递的最低摩擦方式。**核心约束**："过程比结果更重要"——本仓库本身是这套方法论的一个新阶段 · 等待陌生使用者加入磨合。

---

**Maintained by** Lyn & 夕潮 · [GitHub](https://github.com/Lynnouo/yushio)
