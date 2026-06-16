# 循环夕潮 · 详案（按需加载）

> 循环夕潮 SKILL.md 的伴随文件。SKILL 留了常驻核心（loop 形状 / 护栏 / 自主上限 / 对齐巡检铁律 / maker≠checker）；这里是细则——宿主绑定表、STATE 模板、Tier-1 grep 配方、重要度阈值、两条逐步 SOP。建 loop / 跑巡检 / 换工具时按需查。

---

## §A 宿主绑定表（触发器交给宿主，永不写死成"机制"）

**本 skill 不 ship 调度器。** 下表是"在某工具里，loop 形状（SKILL §2）该绑哪个原语"。版本会变——绑之前先探测（SKILL §0.2）。

| 工具 | 定时 / 循环原语 | 跑到条件满足 | 隔离 | 注意 |
|---|---|---|---|---|
| Claude Code | `/loop <间隔> <prompt>`；省略间隔 = 模型自控速 | `/goal "<可验证条件>"`（**需 v2.1.139+**，每轮判定是否达成·只读对话不跑工具）；**未到此版本 → 用 /loop 自控速代替** | `--worktree` / 子代理 `isolation: worktree` | `/goal` 的裁判模型**读不到工具、只读对话** → 条件要写成"产出能自证"（如"`npm test` 退出 0"） |
| Claude Code · 桌面定时任务 | 桌面端「定时任务」（cron 式，最小间隔约 1 分钟·以宿主为准） | —— | 本地 checkout | **能看到本地文件**（含本地独有 / 未提交）→ 适合本地领先 / 有本地独有文件的库 |
| Claude Code · 云端 routine | `/schedule` 创建云端 routine（cron） | —— | 云端 fresh clone | **盲区：看不到本地未提交 / 本地独有文件，且只推 claude/ 分支**。每日有按档配额（Pro/Max/Team 不同）。**笔记本关机也跑，但本地独有内容它不知道** → 本地独有文件它读不到 |
| Codex | thread / standalone / project automation（含 Triage 收件箱、本地 vs worktree、可选审批模式） | `/goal`（**默认关，需 config.toml 开 `features.goals`**）pause/resume/clear | `$CODEX_HOME/worktrees`（detached HEAD） | skill 合进家族 AGENTS.md（合并版）后在 Codex 可用；子代理只读 = `sandbox_mode='read-only'` |
| 其他（Cursor / Gemini / 纯对话 LLM） | 多无原生定时 → loop 退化为"user 每次手动重发 prompt + 读 STATE 续上" | 无 | 视工具 | 无 subagent 时 checker 退化为"你自己换个视角冷读一遍"（弱于独立模型，但聊胜于无） |

**判定**：在 Claude Code 上默认 = **`/loop` 自控速 + 桌面定时任务**（都能看到本地文件）；云端 routine 只在“任务只依赖已 push 内容 + 要笔记本关机也跑”时才用。`/goal` 等升过 v2.1.139 再启用——届时只换触发绑定，SKILL 正文一字不改（这就是不写死语法的回报）。

---

## §B STATE 文件模板（`.yushio/loop-state.md`）

> 位置：项目本地，**不在 memory 目录**。含敏感信息 → `.gitignore`。时间戳一律绝对值。

```markdown
# <项目> · loop 状态
> loop 的脊柱（过程量，非记忆）。每轮：先读本文件 → 干活 → 回写。
Last run: 2026-06-16T14:30:00+08:00
预算: 本轮上限 ~80k tokens / 实际 ~?k（越线 → 停 + 进下方 inbox）
BLOCKED:            # ← kill-switch 哨兵。非空 = 本轮硬停。user 或 loop 都能写
MAX_ITER: 20 / 当前第 3 轮 / 无进展计数 0

## 高优先级（loop 在处理 / 等 user 裁决 = inbox）
- [处理中] CI: test/auth 3 个失败 → 起草修复中（worktree wt-auth）
- [等你] 发现需删除旧字段 legacyToken —— 删除是红线，已停手，等你点头

## 观察列表
- docs/api.md 提到的 /v1/login 代码里已是 /v2 —— 疑似 stale，待对齐巡检确认

## 本轮忽略的噪声
- lint warning（格式），非本 loop 范围

## Run log（追加，不覆盖）
- 2026-06-16T14:30 · 第3轮 · 修了 test/auth 2/3 · 第3个等你裁决 · 花 ~52k
- 2026-06-16T09:00 · 第2轮 · …
```

---

## §C Tier-1 对齐巡检 · grep 配方（确定性 · 每轮跑 · 近零成本）

扩展形状 #DK / 基础夕潮 §4.10 / §5.7。按技术栈调路径。

```bash
# 1. 陈旧标记（已删/废弃却还被引用）
grep -rnE "\[AI-NOTE\].*(已删|废弃)|deprecated|legacy|V[12] 已" <docs> <src>

# 2. 出处校验：记忆/文档里引用的形状/决策 ID 还在吗
grep -rnoE "derives-from #[A-Z]+|见形状 #[A-Z]+|ADR-[0-9]+" <memory> <docs> \
  | while read ref; do echo "校验 $ref 的目标是否仍存在且仍如是说"; done   # 人工/LLM 接力

# 3. 符号锚定：文档/记忆提到的标识符，代码里还在吗
#   先列文档里出现的 CamelCase/路由/字段，再 grep 代码确认未被改名/删除
grep -rnoE "/v[0-9]+/[a-z]+|[A-Z][a-zA-Z]+Service|[a-z]+Token" <docs> <memory>

# 4. 术语 lint：同一概念两处叫法（需项目术语表；无表则人工扫候选）
```

**铁律**：Tier-1 命中只是**候选**，不是结论。确定性层负责"高精确率地圈出可疑对"，语义判断留给 Tier-2（且 cite-or-abstain）。Tier-1 自己也要**校验标注有效性**（`derives-from #K` 里的 #K 可能已不存在）。

---

## §D 重要度累积阈值（门控 Tier-2 这道贵的）

Tier-2（LLM 语义对比）只在累积"重要度"过阈值才跑。取法（任选 / 组合，宁可保守）：

- **事件触发**：本轮 commit 触及"决策类"产物（改了 spec / ADR / project memory / 产品方向）→ 立即够格。
- **计数触发**：距上次 Tier-2 已过 N 个任务 / M 次 loop。
- **双门**（仿 consolidate-memory）：距上次 > 24h **且** > 5 次会话/任务。
- **强制触发**：基础夕潮 §7.1 事件 1（user 当面纠正）→ 立刻跑一次 Tier-2，不等累积。

阈值太高 = 真漂移多轮不被发现；太低 = 老跑贵的、还假阳性磨损信任。**保守起步，按"它有没有抓到真东西 / 有没有乱报"调**。

---

## §E 建 loop · 逐步 SOP

1. **过 §4 判据**：这件事有界吗？通过/失败信号干净吗？不干净 → 别 loop，退回人来主导。
2. **写 ground-truth 验证命令**（§6）：这个 loop 的 checker 跑什么命令判对错？写不出 = 开环 loop = 只能演示，停。
3. **设 5 护栏**（§3）→ 初始化 `.yushio/loop-state.md`（§B 模板）。
4. **选触发器**（§A 表）：按本工具能力绑，不写死命令。
5. **写 Triage prompt**：读哪些信号 → 怎么写进 STATE。一句话能复述这个 loop 每轮干什么。
6. **接 checker**（§6）：起草 = 基础夕潮，验证 = 召唤审计夕潮 / 跑独立信号，**不是同一个**。
7. **接对齐巡检**（§5）：loop 收尾默认跑 Tier-1；过阈值跑 Tier-2。
8. **跑 1 轮 dry-run 给 user 看**，再放它定时跑。第一轮永远盯着看。

## §F 对齐巡检 · 逐步 SOP

1. **读当前态**：读运行时当前文件（非快照），相对日期转绝对。
2. **Tier-1**（§C）：grep 三类 → 产出"可疑候选对"清单。命中 0 → 报"未发现矛盾"，结束（不说"已验证一致"）。
3. **门控判断**（§D）：够格才进 Tier-2；不够格 → 只报 Tier-1 候选，结束。
4. **Tier-2 语义对比**：只比候选对。每条拟改写 **cite-or-abstain**（引不出矛盾原文就 abstain）。
5. **二次复核**（§5.2）：拟 UPDATE/DELETE 交审计夕潮（最好换模型）默认反驳式复核，要矛盾原文才算数。对账封顶 2 轮。
6. **仲裁**（§5.3）：记忆↔派生文档冲突 → spec 为准；记忆/文档↔代码冲突 → **冻结+上交 user**，不自动判。
7. **产出**：一份 diff + 矛盾清单进 inbox（STATE「等你」段）。**suggest-only，原文不动**，等 user 批。
8. **回灌**：user 裁决后，把答案传播到所有下游产物（闭环）。改 spec/产品方向 → user 签字。

---

## §G `derives-from` 出处标注约定（可选 · 先 grep-only，需要再上）

让对齐巡检从"全量 O(N²) 比对"变"定向扫描"的最便宜手段：在派生记忆/文档条目尾部加一行轻量出处标注——

```markdown
<!-- derives-from: #K | ADR-007 | spec§3.2 -->
```

巡检 Tier-1 据此只校验"这条 → 它的上游"，不用两两比。**起步可不做**（先靠 §C 的符号/标记 grep 锚定）；当记忆/文档规模大到 grep 锚定不够用，再逐步补标注。这是一次性补 + 长期写入纪律的取舍——按需，不强上。
