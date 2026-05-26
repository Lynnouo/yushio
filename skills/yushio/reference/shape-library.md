# 形状库 · 跨项目单一真源

> **Schema 版本**：v2.0
> **Last-Updated**：2026-05-25
> **形状总数**：28（4 开发通用 + 13 审计技术 + 4 Meta + 7 流程）+ 7 设计指针（美术总监 §9）
> **路径约定**：
> - macOS / Linux：`~/.claude/skills/yushio/reference/shape-library.md`
> - Windows：`%USERPROFILE%\.claude\skills\yushio\reference\shape-library.md`
> - Claude.ai / ChatGPT / Gemini 等无文件系统的工具：作为 Project Knowledge 上传，引用时用文件名「shape-library.md」
>
> **被引用方**：基础夕潮 SKILL §4.4（形状识别本能）· 审计夕潮 SKILL §10/§11（修复审计 + 沉淀流程 owner）· 美术总监夕潮 SKILL §9（设计形状库另存于美术总监 SKILL）· 并行夕潮 SKILL §6（多 session 形状 #DM）· 各项目本地形状库（建议路径 `<project>/docs/audit/_shape-library.md` 作为本地实例溯源）
>
> **维护权限**：夕潮家族各 SKILL 共同消费 · 沉淀流程由审计夕潮 §11 owner（追加自主 / 重写需 user 签字）

## 使用规则

1. 写代码 / 修代码 / 提交前 Review 都要参照本文件
2. 项目本地形状库（建议路径 `<project>/docs/audit/_shape-library.md`）= 跨项目形状的本地出现位置 + 修复轮次溯源 + 项目独有形状
3. 跨项目可迁移的新形状（满足"3 项目见过 / 跨语言可迁移 / 关联形状清晰"）由审计夕潮 §11 沉淀流程升级回写到本文件

## Portability · 跨机器 / 跨工具 / 跨使用者

### Claude Code 主用法（推荐 · 100% 完整度）

文件路径 `~/.claude/skills/yushio/reference/shape-library.md` 在 macOS / Linux / Windows（WSL）都 portable（home 相对路径）。Claude Code 在 session 开头自动发现 SKILL · 引用本文件时 SKILL 知道路径。

### Claude.ai / Claude Desktop（95% 完整度）

无文件系统访问 · 替代方案：
- 把本文件**上传到 Project Knowledge**（每个 Project 独立 knowledge base）
- 基础夕潮 / 审计夕潮 / 美术总监夕潮 SKILL 也作为 knowledge 上传
- 引用时改成「reference 文件 / 见上传文档 shape-library.md」

### 其他 LLM 工具（ChatGPT / Gemini / Cursor / JetBrains / 60-80% 完整度）

详见基础夕潮 SKILL §9.2 三列 fallback 表（全局层 / 项目级层 / 完整度）。本文件作为 reference：
- Cursor：作为 `.cursor/rules/yushio-shape-library.mdc` 项目级 rule（替代或叠加全局 Rules for AI）
- ChatGPT / Gemini：上传到 Custom GPT / Gem 的 knowledge base
- 任何对话框 LLM：每次开头粘贴本文件全文

### Fallback 机制（reference 文件找不到时）

如果 SKILL 引用本文件失败（路径错 / 工具无文件系统 / 用户首次 setup），夕潮的行为退化策略：
1. **基础夕潮 §11.2** 已 inline 了 10 形状速查 → 写代码场景不受影响
2. **审计场景**：审计夕潮 §10 也 inline 了 10 形状速查 → 修代码 / 验收场景能跑核心 SOP
3. **完整定义需要时**：主动告诉 user "找不到 reference 文件 · 哪里能拿到？" → 等 user 提供路径或粘贴内容
4. **不要凭记忆复述形状定义**——记忆和文件可能不一致（见 yushio §6.5 衰减意识）

### 跨使用者分发流程（朋友分享时）

如果 user 想把整套夕潮 SKILL 分享给朋友：
1. 把 `~/.claude/skills/{yushio,yushio-art-director,yushio-auditor}/` 三个目录整体复制（含 reference 子目录 + code-guard.md）
2. 朋友放到自己的 `~/.claude/skills/` 下 · 路径自动对齐
3. 朋友 session 开头说"你是夕潮"即触发
4. 如果是其他工具（Cursor / ChatGPT），按上面的 Portability 段做 setup

## 过期检测

本文件 schema-version 升级（如 v2.0 → v2.1）= 形状库结构或核心原则有变更 · 消费方需更新 inline 速查表。Last-Updated 仅追加形状不改结构。

消费方（基础 / 审计 / 美术总监 SKILL）自检方式：
- session 开头探测时读本文件顶部 schema-version
- 如果不匹配 SKILL 内的预期版本 → 告知 user "形状库 schema 已升级 · 建议重新加载 SKILL"
- 当前各 SKILL 的预期 schema-version：v2.0（2026-05-15）

每个形状的最低标准：**症状 / 根因 / 修复 / 判定 / grep 模板（如适用）/ 关联形状 / 出处**。**没有 "判定" 等于没识别形状**。

---

## 形状索引

### §1 开发通用 bug 形状（写代码时防御）

| ID | 名称 | 关联 |
|---|---|---|
| #A | Overlay 点击事件冒泡到底层推进 | — |
| #B | useEffect 无依赖 + 全局变量 + setState = 无限循环 | #G |
| #D | 占位元素机制（compile-time 物化非标节点） | — |
| #G | Observable subscribe 递归陷阱 | #B |

### §2 审计高频技术形状（修代码 / 审代码时排查）

| ID | 名称 | 严重度 | 关联 |
|---|---|---|---|
| #K | TOCTOU 无锁竞态 | P0 | #T, #N |
| #M | Debug 残留 | P1 | #P |
| #N | 非原子多步 | P0 | #K, #Q |
| #O | 全局单例多用户 | P0 | — |
| #P | 权限粒度不匹配 | P0 | #M, #Q, #V |
| #Q | 错误处理不当 | P1 | #N, #P |
| #R | 资源无上限 | P2 | — |
| #S | 加密弱随机 | P0 | — |
| #T | 锁键不一致 | P1 | #K |
| #U | 用户输入拼接路径 | P1 | #P |
| #V | Mass assignment | P1 | #P |
| #W | Service 白名单过滤导致 API 响应漏字段 | P1 | #L, #Q |
| #X | 前端 UI Pattern 未抽函数复制实现 | P2 | #L, #E |

### §3 Meta 形状（结构性陷阱）

| ID | 名称 | 关联 |
|---|---|---|
| #DJ | Native runtime + dev watch reload = backend 死 | #DK |
| #DK | 陈旧产物陷阱 Stale Artifact Trap | #DJ, #DL, #DM |
| **#DL** | **项目缺鸟瞰可视化（→ AI/人陷局部失全局 → stale 成虚假真相）** | **#DK（主动防御工具）, #I（基建后补）** |
| **#DM** | **多 session 撞共享脊柱（并行 session 在隔离层不冲突，却在脊柱争用）** | **#DK（stale 协调文档）, #H（双源漏同步）, yushio-parallel** |

### §4 流程形状（工作纪律案例）

| ID | 名称 | 关联 |
|---|---|---|
| #C | 写方法论文档时作者容易不用方法论 | #J |
| #E | 横向铺面 N 文件 0 功能 | #X |
| #F | 手写 JSON 应该是结构化 UI | — |
| #H | 状态改完但另一侧没跟上（双源漏同步） | — |
| #I | 代码先行基建后补（"第二个 session 从零") | — |
| #J | Plan 批准 ≠ 跳过纪律 | #C |
| #L | 修实例不修 Pattern（**核心原则**） | #W, #X |

### §5 设计形状

设计形状由美术总监夕潮 SKILL §9 单独维护，不在本文件重复定义：
- #DA 配色和品牌情绪脱节
- #DB 动效气质和产品节奏不匹配
- #DC 新功能视觉孤岛
- #DD 美术总监先假设方向再问用户
- #DE Emoji / 视觉清扫只扫组件漏 seed 字符串
- #DF 签字稿 hex 实装时静默漂移
- #DG spec 文字描述漂离签字稿 HTML

完整定义见：`~/.claude/skills/yushio-art-director/SKILL.md` §9

---

## 核心原则：禁止「修实例不修 Pattern」

> 此原则原为形状 #L · 因频次和重要性升级为所有形状扫描的**前提**。

**规则**：修改任何一行代码前，必须先回答 3 个问题：
1. 这是什么错误 pattern？（不是「这一行错了」，而是「这属于哪类形状」）
2. 这个 pattern 的判定条件是什么？（怎么识别另一个同类）
3. 同文件、同目录、同 import 还有没有其他地方是这个形态？

**强制步骤**：
1. 修改前 grep 同 pattern（同文件 + 跨文件）
2. commit message 附扫描结果（grep 命令 + 输出 + 逐行处置）
3. 修改范围 = grep 结果 ∩ 真正需要修的

**详细 SOP + grep 速查表 + 反模式示例 + 验收 checklist 见审计夕潮 SKILL §6-§9**。

---

## §1 开发通用 bug 形状

### 形状 #A · Overlay 点击事件冒泡到底层推进

**症状**：user 点击 overlay 时既触发 overlay 内部 onClick 又触发底层容器的 onClick（常见于 "点击任意位置推进" 的 UI）→ 同一次点击产生双重副作用 → overlay 推进 + 底层推进同时发生。表现为 "N 条内容变成 N-1 条" 或 "overlay 显示一瞬间就被穿透"。

**根因**：React / Vue / Svelte / 原生 DOM 等任何事件冒泡模型。Overlay 的 outer 容器没 stopPropagation。

**修复**：Overlay 的 onClick handler 第一行 `e.stopPropagation()`。或用 `pointer-events` CSS 控制层级。

**判定**：未来任何响应**点击推进**（不是按钮 onClick，而是整个区域 onClick）的 overlay 都需要这个保护。只渲染不响应推进的 overlay 不需要。

**关联**：—

**出处**：2026-04-15 · 某 React + TypeScript 视觉小说项目的 SMS 系统首次实施

---

### 形状 #B · useEffect 无依赖数组 + 全局变量永远存在 + setState 产新值 = 无限循环

**症状**：useEffect 没有依赖数组，每次 render 都跑。Effect 内部读一个外部全局变量（`window.__xxx`），变量永远存在，effect 内部又调 setState（即使是 `setCounter(c => c + 1)` 这种 "即使 c 稳定也产生新值" 的形式）→ 无限循环 → React `Maximum update depth exceeded`。

**根因**：`setCounter(c => c + 1)` 即使 state 稳定也每次产新值。结合无依赖数组的 useEffect，每次 render 跑 effect → setState → render → effect → ...

**修复模式**：Effect 内部在使用后立刻 `delete window.__xxx`，或给 effect 加依赖数组，或改成 "状态稳定则不 setState"。

**判定**：看到 useEffect 无依赖数组 + 内部读全局变量 + 内部 setState → **必须**确保全局变量在 effect 内部被消费后清理。

**关联**：#G（subscribe 递归陷阱本质相同 · 都是 "副作用回路")

**出处**：2026-04-15 · 同 React + TS 项目 SMS 系统验证

---

### 形状 #D · 占位元素机制（编译时把图节点变成 runtime 能消费的形状）

**症状（正面 pattern · 不是 bug）**：图形 / 拓扑数据结构需要在 runtime 时被识别和触发。直接让 runtime 遍历图是 leaky abstraction。

**根因**：Runtime 消费者通常有一套 "数据形状 X" 的假设。如果 runtime 需要处理 "非 X 形状的节点"，要么污染 runtime（加特殊分支），要么**物化**。物化更干净。

**修复模式**：编译时为每个非标准节点生成一个 "占位元素"，该元素用**统一的** custom handler 承载节点类型信息。Runtime 只认一种数据形状，通过 custom handler 分派。

**判定**：如果你在给 runtime 加新节点类型导致 "runtime 需要知道图拓扑" 的紧耦合 → 考虑物化到占位元素。**优先用统一的 custom 路径**而不是发明新的命名约定。

**关联**：—

**出处**：2026-04-15 · 同项目画布 playback 编译器（3 种不同节点类型 `_condroute_` / `_gameplay_` / `_sms_` 复用同一 custom handler 形状）

---

### 形状 #G · Observable subscribe 递归陷阱

**症状**：store 的 subscribe 里调用修改 state 的操作 → 修改触发新的 subscribe 调用 → 无限递归 → `Maximum call stack size exceeded`。

**根因**：Subscribe callback 不是 "监听"，是 "响应式更新链" 的一部分。在 callback 里写 state 会触发自己。

**修复模式**：Subscribe 开头用引用比较提前 return：`if (prev === current) return;`。或用 batched / debounced update。

**判定**：任何 observable 模式（Zustand / Redux / MobX / RxJS / Vue reactivity / Svelte store / Rx / CompletableFuture observer）里，subscribe / watcher / effect 内部 setState 前先做 "真的变了吗" 判断。

**关联**：#B（同根 · 都是无限副作用回路）

**出处**：2026-04-14 · 某项目 canvasStore autosave · 首次踩坑后第二次在 editorStore 直接复用同形状修复

---

## §2 审计高频技术形状

### 形状 #K · TOCTOU 无锁竞态（Read→Check→Mutate→Write 无原子性）

**症状**：两个并发请求各自读到相同状态，各自通过条件检查，各自修改写回。后写覆盖前写，或两者都成功但只有一份扣款生效。表现为 "金币双花" / "物品复制" / "积分翻倍"。

**根因**：JS 单线程 / Python GIL / Go goroutine 等让人误以为不需要锁。但每个 `await` / `yield` 点就是并发窗口——两个请求在同一个 IO 操作处交错执行。

**修复**：所有涉及经济 / 物品 / 属性的 read→modify→write 路径用 `withLock('scope:${userId}', async () => { ... })` 包裹（Node.js 用 `async-mutex` / `proper-lockfile`；Python 用 `asyncio.Lock`；Go 用 `sync.Mutex`；DB 层用 `SELECT ... FOR UPDATE` + 事务）。

**判定**：看到 `const x = await getX(); x.value += delta; await setX(x)` 三行模式，三行之间有 `await` → 必须有锁。对所有涉及金钱 / 物品 / 积分 / 等级 / 库存的写操作做这个检查。

**grep 模板**：
```bash
grep -B 2 -A 2 "updateAttrs\|setWallet\|saveItems\|updateBalance" <file> \
  | grep -B 2 "getAttrs\|getWallet\|getItems\|getBalance"
```

**反模式**：
```js
// ❌
const attrs = await dao.getAttrs(userId);
attrs.toxicity = newValue;
await dao.updateAttrs(userId, attrs);

// ✅
await withLock(`pet:${userId}`, async () => {
  const attrs = await dao.getAttrs(userId);
  attrs.toxicity = newValue;
  await dao.updateAttrs(userId, attrs);
});
```

**关联**：加了锁但锁键不一致 → 触发 #T；操作涉及跨表写入需要事务 → 见 #N

**出处**：2026-04-16 · 多项目审计

---

### 形状 #M · Debug 残留（"临时"变"永久"）

**症状**：注释写着 `// TODO: 上线前移除` 或 `// 暂始终显示` 或 `// 仅调试用`，但代码已合入主分支且无人跟进。调试面板 / debug 端点 / mock 按钮对所有用户可见。

**根因**：开发速度 > 清理纪律。`TODO` 没有追踪机制（无 lint rule、无 CI check、无定期扫描）。

**修复**：
- 后端 debug 端点：加 `NODE_ENV === 'production'` 守卫 **或者** 直接不注册路由
- 前端 debug UI：加 `isDevMode` 条件渲染
- Electron / 桌面端 debug 代码：加 `app.isPackaged` 或 `--dev` 参数判断
- 发版前 grep 一遍非测试文件

**判定**：看到 `TODO` / `暂` / `临时` / `debug` / `mock` / `test` / `dev` 关键词在非测试文件中 → 立即标记为 tech debt，不能留到 "以后清理"。

**grep 模板**：
```bash
grep -rn "TODO\|FIXME\|暂\|临时\|debug\|mock" \
  --include="*.{js,ts,py,go,rs}" --include="*.html" \
  --exclude-dir=node_modules --exclude-dir=tests --exclude-dir=dist
```

**关联**：#P（debug 端点常缺认证）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #N · 非原子多步操作（步骤间崩溃 = 数据不一致）

**症状**：DELETE 全部 → INSERT 新行（library replace pattern），或 扣款 → 入库 → 解锁 → 退款 四步独立调用。中间任一步失败不回滚。

**根因**：Supabase JS Client / 多数 ORM 不暴露 `BEGIN/COMMIT`，开发者用独立查询替代事务。

**修复优先级**：
1. **最好**：DB function / RPC / stored procedure（单事务）
2. **次好**：补偿事务（try-catch，失败时回滚前面步骤）
3. **最差**：独立操作不处理（= 数据不一致）

**判定**：看到连续两个 `await db.操作(...)` 修改相关数据 → 问 "中间崩了怎么办"。答案是 "数据不一致" → 需要事务或补偿。

**grep 模板**：
```bash
grep -A 20 "export async function\|async def\|func .*\)" <file> \
  | grep -c "await db\|await supabase\|cursor\.execute\|tx\."
```

**关联**：#K（锁是替代方案之一）· #Q（回滚失败时可能吞错）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #O · 全局单例遇多用户（模块级状态被覆盖）

**症状**：模块级全局变量 `_currentUserId` 被最后一个连接覆盖。用户 A 的对局奖励写入用户 B 的账号。全局 `_recentReplies` 数组导致用户 B 的回复被 A 的查重拦截。

**根因**：桌面端 / 单 tenant 产品假设 "一台机器一个用户"，用模块级单例。加了多用户登录 / SaaS 化后单例没改。

**修复**：将全局状态改为 `Map<userId, State>` 或 per-request context（AsyncLocalStorage / contextvars / context.Context）。

**判定**：看到模块级的 `let currentUser = null` + `setCurrentX(x)` → 问 "如果两个用户同时在线会怎样"。桌面端也不安全——用户可能快速切换账号或 SaaS 化后多 tenant 共享进程。

**grep 模板**：
```bash
# Node
grep -rn "setCurrent\|this\._current\|let _current\|let currentUser" <src-dir>
# Python
grep -rn "_current_\|current_user = None\|globals()\['" <src-dir>
```

**反模式**：
```js
// ❌ 模块级 mutable state
let _currentUserId = null;
export function setCurrentUserId(uid) { _currentUserId = uid; }

// ✅ AsyncLocalStorage
import { getRequestContext } from '../middleware/request-context.js';
function getCurrentUserId() {
  return getRequestContext()?.userId || null;
}
```

**关联**：—

**出处**：2026-04-16 · 多项目审计

---

### 形状 #P · 权限粒度不匹配（router-level 宽松 auth 覆盖需严格认证的路由）

**症状**：`router.use(optionalAuth)` 让所有路由可选认证。同文件里某些路由修改全局配置（API Key、提示词模板），需管理员权限但继承了宽松默认。

**根因**：Express / FastAPI / Koa 等框架的中间件瀑布模型。加了 `optionalAuth` 作为默认后，新增 PUT 路由自动继承，开发者不会注意到 "这个路由需要更严格的权限"。

**修复**：不在 router-level 设权限默认值。每个路由显式声明自己的 auth middleware。**或者** 路由组拆分（admin 路由组 vs public 路由组）。

**判定**：看到 `router.use(optionalAuth)` / `router.use(authMiddleware)` / `app.use_middleware(...)` → 逐一检查该文件所有 POST/PUT/DELETE 路由的权限等级是否匹配其操作敏感度。

**grep 模板**：
```bash
# Step 1: 找所有 router.use(宽松 auth) 的文件
grep -l "router\.use(optionalAuth)\|app\.before_request" <routes-dir>
# Step 2: 对每个文件列出所有写路由
grep -n "router\.\(put\|post\|delete\)\|@app\.route.*method" <file>
# 逐行审视：这个操作的敏感度配得上 optionalAuth 吗？
```

**权限矩阵**：
| 操作敏感度 | 应使用的中间件 |
|---|---|
| 修改全局配置 | `adminApiAuth` / admin-only |
| 修改用户自己数据 | `authMiddleware` / authenticated |
| 用户偏好 / 可匿名降级 | `optionalAuth` |
| 只读查询 | `optionalAuth` |
| 调用外部付费 API（LLM/VLM/storage） | `authMiddleware` + 限速 |

**关联**：#M（debug 端点常缺认证）· #Q（auth 错误后可能吞错）· #V（写路由的权限和字段白名单常一起缺失）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #Q · 错误处理不当（吞错 / 信息泄漏 / 降级无声明）

**症状**：
1. **吞错**：`catch (e) { log.error(e) }` 后面没有 throw / return error / status code 5xx——调用方认为成功
2. **信息泄漏**：`res.status(500).json({ error: err.message })` 将内部错误原文（DB / LLM provider / FS）暴露给前端
3. **降级无声明**：catch 后走降级路径但没有注释说明降级策略

**根因**：对 "优雅降级" 的误解——真正的优雅降级是有计划的 fallback，不是无声的失败。

**修复**：catch 里必须选一：
1. `throw` 让上层处理
2. `return { success: false, error }` 明确告知调用方（**生产环境用 generic message，raw error 仅入日志**）
3. 有计划的 fallback（**注释说明**降级策略，不能静默）

**判定**：看到 `catch (e) { log.error(e) }` 后面没有 throw 或 return error → 问 "调用方知道失败了吗"。如果不知道 = 静默吞没。

**grep 模板**：
```bash
# 吞错
grep -B 1 -A 3 "} catch\|except.*:" <file> | grep -v "throw\|return\|raise\|res\.status"
# 信息泄漏
grep -rn "err\.message\|str(e)\|error\.message" <routes-dir> | grep "res\.\|return"
```

**关联**：#N（回滚失败可能吞错）· #P（auth 异常吞错）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #R · 资源无上限（缓存 / 消息 / body / listener 无边界）

**症状**：`new Map()` / `new Set()` 内存缓存无最大条目数且无 TTL。WebSocket `maxPayload` 默认无上限。JSON body 限制过大。Poller 失败无退避。IPC listener 注册不解绑。

**根因**：开发时数据量小。上线后数据量增长或遇到攻击 / 死循环，资源耗尽。

**修复**：每个资源容器声明上限：
- 缓存加 TTL + maxSize（lru-cache / cachetools）
- 网络接口加 maxPayload / max_length / body_limit
- Poller 加指数退避
- IPC / 事件 listener 必须配套 removeListener / unsubscribe

**判定**：每个 `new Map()` / `new Set()` / `new WebSocketServer()` / `express.json()` / `app.add_event_handler()` → 问 "最大多大？过期策略？谁负责清理？"

**grep 模板**：
```bash
grep -rn "new Map\|new Set\|new WebSocketServer\|express\.json\|@cache\|lru_cache" <src-dir>
# 每个看有没有 maxSize/TTL/limit
grep -rn "ipcMain\.on\|addEventListener\|on_event\|signal\.connect" <main-process-dir>
# 每个看有没有 removeListener / removeEventListener / disconnect
```

**关联**：—

**出处**：2026-04-16 · 多项目审计

---

### 形状 #S · 加密弱随机（Math.random / random.random 进安全场景）

**症状**：邮箱验证码 / session token / 密码重置链接 / CSRF token 用 `Math.random()` / Python `random.random()` 生成。这些函数使用非加密安全 PRNG（xoshiro128**、Mersenne Twister 等），序列可被预测。

**根因**：标准库 random 是最顺手的随机函数。开发者不区分 "娱乐随机" 和 "安全随机"。

**修复**：
- Node.js：`crypto.randomInt()` / `crypto.randomUUID()` / `crypto.randomBytes()`
- Python：`secrets.token_urlsafe()` / `secrets.randbelow()`
- Go：`crypto/rand` 包（不是 `math/rand`）
- Rust：`rand::rngs::OsRng`

**判定**：以下场景**必须**用加密安全随机：验证码 / session token / CSRF token / 密码重置链接 / 用户 UID / API key / 加密 nonce / 任何影响认证 / 授权的随机值。

**例外**：游戏内随机（抽卡概率、NPC 行为、骰子）/ A/B 测试分流 / 模拟用例 → 弱随机 OK。

**grep 模板**：
```bash
grep -rn "Math\.random\|random\.random\|math/rand" \
  <src-dir>/{services,middleware,routes/auth,utils}
```

**关联**：—

**出处**：2026-04-16 · 多项目审计

---

### 形状 #T · 锁键不一致（同数据不同锁 = 锁了等于没锁）

**症状**：`funcA` 用 `withLock('equip:' + userId)`，`funcB` 用 `withLock('inv:' + userId)`，两者操作同一张 `user_items` 表。两把锁不互斥 = 锁了等于没锁。

**根因**：不同开发者（或不同 session 的 AI）各自加锁时取了不同的 key，没有全局的锁键注册表。

**修复**：建立锁键约定——**同一张表 / 同一个文件的所有写操作用同一个锁键**。在代码中用注释标注锁键作用域：
```js
// Lock key convention for user_items: inv:${userId}
withLock(`inv:${userId}`, async () => { ... });
```

**判定**：加 `withLock` 时问两个问题：
1. 这个锁保护哪张表 / 哪个资源？
2. 还有谁也写这个资源？锁键一样吗？

**grep 模板**：
```bash
# 搜所有 withLock 调用，按文件归组
grep -rn "withLock(" <src-dir> | awk -F: '{print $1, $3}' | sort
# 每个 DAO 文件的所有写函数和 withLock 配对
grep -n "^export async function" <dao-file>
grep -n "withLock" <dao-file>
```

**关联**：#K（锁存在但键不对 = 形同虚设，本质退化为 #K）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #U · 用户输入拼接路径（路径穿越）

**症状**：`path.join(baseDir, req.params.xxx)` 或 `path.resolve(__dirname, userInput)` 未做校验，攻击者通过 `../` 穿越目录读写任意文件。

**根因**：路径拼接 API 看起来安全（不像 `eval`），开发者忘了 `..` 仍是合法路径片段。

**修复**：
- 用户输入拼接路径前，必须做正则白名单校验（如 `/^[A-Z]{4}$/`）
- 或用 `path.resolve` 后检查结果是否仍在 `baseDir` 内（`resolved.startsWith(baseDir)`）
- Python：`os.path.commonpath([base, resolved]) == base`

**判定**：所有 `path.join` / `path.resolve` / `os.path.join` 跟用户输入（`req.params` / `req.body` / `req.query`）拼接的位置都要校验。

**grep 模板**：
```bash
grep -rn "path\.join\|path\.resolve\|os\.path\.join" <src-dir> \
  | grep "req\.params\|req\.body\|req\.query\|request\.\(args\|json\|form\)"
```

**反模式**：
```js
// ❌ 未校验，macOS / Windows 大小写不敏感时可穿越
const mbtiType = req.params.mbtiType.toUpperCase();
const filePath = path.resolve(__dirname, `../data/personalities/${mbtiType}.json`);

// ✅ 白名单校验
if (!/^[A-Z]{4}$/.test(mbtiType)) return res.status(400).json({ error: '无效参数' });
```

**关联**：#P（路径穿越端点常伴随缺认证）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #V · Mass assignment（用户输入直接 spread 写库）

**症状**：`{ ...current, ...req.body }` 直接 spread 用户输入，攻击者可注入任意字段（如 `isAdmin: true`、`balance: 999999`）。

**根因**：图省事用 spread 同步整个对象。忘了 `req.body` 是用户可控的。

**修复**：
- 字段白名单：`const ALLOWED = ['nickname', 'avatar']; const updates = pick(req.body, ALLOWED);`
- 拒绝名单 helper：`stripForbiddenKeys(req.body, ['isAdmin', 'balance', ...])`
- ORM 层显式 schema：Mongoose `select: false` / Sequelize `attributes` / SQLAlchemy `__table_args__`

**判定**：禁止直接 `{ ...req.body }` 写入数据库或配置。看到这个 pattern → 必须用白名单或 helper。

**grep 模板**：
```bash
grep -rn "\.\.\.req\.body\|\.\.\.body\|\.\.\.request\.json\|update_from_dict" <routes-dir>
```

**反模式**：
```js
// ❌ 任意字段注入
const updates = { ...current, ...req.body };
await db.from('pets').update(updates).eq('user_id', userId);

// ✅ 字段白名单
const ALLOWED = ['nickname', 'avatar', 'theme'];
const updates = {};
for (const key of ALLOWED) {
  if (req.body[key] !== undefined) updates[key] = req.body[key];
}
```

**关联**：#P（写路由的权限和字段白名单常一起缺失）

**出处**：2026-04-16 · 多项目审计

---

### 形状 #W · Service 白名单过滤导致 API 响应漏字段

**症状**：DAO 层 `mapRowToAttrs` 返回完整字段（含新增字段），但路径上的 Service 层做**显式白名单**转发（`return { a: attrs.a, b: attrs.b, ... }`）——新字段没列进去 → API 路由以为有、前端消费 undefined → 功能静默失效。

**根因**：早期为了 "只暴露需要的字段" 用白名单。后续加新字段时只在 DAO 加 + 路由读，**忘了中间 Service 层也是过滤层**。

**修复**：
- **短期**：每次 API 加新字段时，从 route 往上**追到所有过滤层**，每层补字段
- **中期**：改为明确的「拒绝名单」而非「允许名单」——`const { forbiddenA, forbiddenB, ...rest } = attrs; return rest;`
- **长期**：在 DAO 层增加**契约测试**——"DAO 返回字段数 === Service / API expose 字段数 - 已知的内部字段数"

**判定**：跨层数据传递时，问 "这一层是过滤层吗？过滤策略是白名单还是黑名单？" 白名单是默认陷阱。

**grep 模板**：
```bash
# 找所有 DAO 调用后的 explicit return 模式
grep -rn "await .*Dao\.get\|await .*Repo\.find" <services-dir> \
  | awk -F: '{print $1}' | sort -u \
  | xargs -I{} grep -l "return {" {}
```

**反模式**：
```js
// ❌ Service 显式白名单
async getVitals(userId) {
  const attrs = await dao.getAttrs(userId);
  return {
    mbtiType: attrs.mbtiType ?? null,
    toxicity: attrs.toxicity ?? 50,
    // ... 手写 9 个字段
    // ❌ 新加的 onboardingStage 没透传 → API 返 undefined
  };
}

// ✅ 拒绝名单
async getVitals(userId) {
  const { __internal_id, __version, ...rest } = await dao.getAttrs(userId);
  return rest;
}
```

**关联**：#L（修实例不修 pattern 在 "多层数据传递" 场景的特化）· #Q（下游读到 undefined 不报错会被吞没）

**出处**：2026-04-21 · 多项目审计

---

### 形状 #X · 前端 UI Pattern 未抽函数，各处复制实现

**症状**：一个复杂的交互模式（如 "乐观 UI + 并行 API + 飞行动画 + 失败回滚"），在项目中**多处复制实现**。第一处写完没抽函数，第二处来了就复制，后续新增继续复制 → 各处行为分叉、样式不一致、性能退化、bug 修到一处漏两处。

**根因**：写第一处时 "只是这一处用得到"，写第二处时 "复制最快"，写第三处时 "三处了再抽吧" 但没人回头抽。

**修复**：
- **抽 helper 函数**：把 `(btnEl, amount, apiFn, opts)` 作为入参，差异行为（onBusy / onSuccess / onFailed）用 callback 注入
- **阶段 1**：helper 放在**当前文件内**（只消费方是这个文件时），避免过早 promote 到 shared/
- **阶段 2**：当第二个 feature 页面要用时，再 promote 到 `shared/`
- **验证**：diff 三问——"我重构后三处的外部行为**完全等价**吗？" 必须逐一比对

**判定**：同一交互模式出现 3 次以上 = 候选抽函数位点。出现 2 次 = 关注。

**grep 模板**：
```bash
# 典型：同一 API + 同一动画 + 同一音效反复出现
grep -rn "playCoinFlyAnimation\|addMockGold\|refreshFromServer" <renderer-dir> \
  | awk -F: '{print $1}' | sort | uniq -c | sort -rn | head
# 同文件出现 >3 次 = 候选
```

**关联**：#L（修实例不修 pattern 在前端交互层的表现）· #E（横向铺面）—— #X 是 "已经有功能的重复"，#E 是 "还没打通就先铺面"

**出处**：2026-04-21 · 多项目审计

---

## §3 Meta 形状（结构性陷阱）

### 形状 #DJ · Native runtime + dev watch reload = backend 死

**症状**：项目用 native binding（如 `@huggingface/transformers` / `onnxruntime-node` / `node-canvas` / `sharp` / `better-sqlite3`）加载本地资源。`node --watch` / `nodemon` / `webpack-dev-server` 检测代码改动触发 reload 时，子进程退出阶段报 native crash（如 `libc++abi: terminating due to uncaught exception of type std::__1::system_error: mutex lock failed`）。watch 没干净 spawn 新子进程 → backend daemon dead。Client（Electron / 浏览器）通过旧 socket 还显示 ESTABLISHED 但实际 dead → user-facing endpoint 返回失败 → GUI 显示空数据。

**根因**：native binding 在进程退出 cleanup 阶段撞自己的全局 mutex / 资源句柄。Native runtime 的析构跟 V8 / Python interpreter 进程生命周期不对齐。**独立一次性脚本进程 crash** 只留 zombie 不影响功能；**daemon reload 撞 crash** 让整个 daemon dead → user 看到 GUI breakage。

**修复**：
1. **立即**：dev backend 不用 watch reload。加 `dev:safe` script（plain `node src/index.js` / `python app.py` 不带 reload）。改 native runtime 相关文件后手动 kill + restart backend
2. **中期**：把 native runtime 服务剥离到独立 sidecar 进程（HTTP / socket / gRPC IPC）· backend 仅作 client · sidecar 不被 watch reload 触及
3. **诊断信号**：dev 模式 reload 后 backend curl 失败 + `ps` 看到 UE state zombie + stdout log 末尾含 native crash 信息

**判定**：项目用任何 native binding + dev 用 watch reload + 改动会触发该 binding 模块 reload → 必中此坑。修法不是 "小心改文件"（人肉防线必失败），而是**结构性隔离**（不 watch 或 sidecar）。

**关联**：#DK（演进期常伴随 dev workflow 漂移）· #C（容易把 "独立进程不影响" 当事实，没举一反三到 daemon reload 同样撞）

**出处**：2026-05-14 · 某项目 ONNX Runtime + transformers.js 反复触发 dev backend 死锁

---

### 形状 #DK · 陈旧产物陷阱（Stale Artifact Trap · 重构期项目高频中坑）

**症状**：项目处于演进期（V1→V2 / 旧设计→新设计 / legacy→modern）。新功能 / 新代码做对了，但 "过去某个时间点对的东西今天不对但还在仓库 / 系统里" 的产物**幽灵影响**当前工作：

- **stale 文档**让 AI 信错前提：CLAUDE.md / README 写的旧行为不对
- **stale 数据**让 AI 误判业务现状：csv / fixture / seed 数据保留远古残留
- **stale 全局资源**让新行为 break 旧 daemon：native mutex / 全局 socket / 模块单例 → 新代码改动触发旧 daemon reload 撞 crash（具体见 #DJ）
- **stale 注释**让 grep 误命中：`[AI-NOTE] 已删` 但函数体还在 → 新 AI grep 找到 dead path 当 live
- **stale dep**：`package.json` / `pyproject.toml` 里 dev dep 不再用但 `import` 还在 → 删 dep 同时漏删 import = broken build
- **stale CSV / fixture**：业务字段保留但当前版本已不消费 → 读到字面值误判业务实体

**根因**：演进期 "旧设计→新设计" 切换没做干净：
1. 删除是政治成本（怕断别人引用）→ 保留 dead path
2. 文档更新成本（每次变化都更新所有 docs 难）
3. 资源生命周期错配（全局单例 vs 进程级隔离 mismatch）
4. **AI 协作者只看 git diff 不看 runtime / git history / 跨文件影响** → 错过 stale 残留

**修复**（侧重 AI 协作者纪律 · 不依赖项目侧"以后清理"）：

1. **§4.1 开工 5 问扩展**：第 5 问 "隐患" 必含 "陈旧产物搜查"：
   ```bash
   # 必跑 · 不能跳过
   grep -rn "\[AI-NOTE\].*已删\|废弃\|deprecated\|legacy\|V[12]" <相关目录>
   ```
   - 查 CLAUDE.md / docs/ 里跟本任务相关的描述是否最新（**信但要验证**）
   - 看 runtime 依赖（backend daemon / cron / sidecar）是否会被本改动间接影响（git diff 看不到的部分）

2. **§4.3 逆向审计扩展**：第 5 问 "隐患处理" 必须问："本改动改的运行时状态 · git diff 看不到的部分（daemon reload / 资源 mutex / 全局 singleton / cache 状态）有副作用吗"

3. **沉淀（核心纪律）**：每次 grep 命中 stale 标记 → **主动评估能否一并清而不是绕过它**——让仓库越来越干净 · 不让 stale 继续埋雷。这是**让 stale 减少而不是堆积**的唯一机制——靠"以后清理"必失败。

4. **结构性隔离**：dev workflow / 全局资源 / config 走 "明确 SoT" 而不是 "代码注释里说"——文档跟代码同步漂移是常态 · 只有 "机器会报错" 的约束是真防御（呼应美术总监 #DF）

5. **维护式 kill-list（主动防御 · 比"遇到再清"早一层）**：演进期项目主动维护一份"残留禁忌清单"（哪些 V1 名字 / 旧字段 / 废弃路径 / 反向调教关键词不该再出现），把被动 grep 升级为主动列举——新 session 开工先对照 kill-list，命中即清，不等"撞上了"再处理。

**判定**：跨项目可迁移——任何持续演进的项目都积累 stale artifacts。最高风险信号：
- 看到 "V1→V2" / "旧→新" / "deprecated but kept" 类描述 → 必有 stale 残留
- 看到 `[AI-NOTE].*已删 / 废弃 / legacy` 注释 → 必须查 "为啥还没删 · 现在还在影响什么"
- 看到 csv / json / dep 文件跟代码语义不对齐 → 必先 grep `V[12]` / `AI-NOTE` 验证业务现状

**grep 模板（开工前必跑）**：
```bash
grep -rn "\[AI-NOTE\].*已删\|废弃\|deprecated\|legacy\|V[12]" <relevant-dir>
```

**关联**：#DJ（native runtime crash 是 stale artifact 在 runtime 层的表现）· #C（"独立进程不影响" 没举一反三到 daemon reload）· **#DL（项目缺鸟瞰可视化 · 是 #DK 主动防御工具 · 从被动 grep 验证升级到主动结构化展示）** · **#DM（多 session 的协调文档 / 交接信也会 stale）** · 基础夕潮 §4 调研前验证业务现状（feedback 提炼）

**出处**：2026-05-14 · 某项目 V1→V2 重构期反复中坑事件累积（2026-05-25 充实第 5 条"维护式 kill-list"）

---

### 形状 #DL · 项目缺鸟瞰可视化（→ AI/人陷局部失全局 → stale 成虚假真相）

**症状**：复杂项目（5+ entity 类型 / 100+ files / 3+ 协作者 / 多次重构任一）没有结构化可视化展示。AI 改完 csv / 代码 / 文档后**看不到全局影响**——stale 实体引用悄悄留下 · 6 个月后变成"虚假真相"被新 AI 当事实读：

- csv 5 行被读成 5 实体（实际 V2 单角色 + 4 装扮映射）
- 删除的 entity 在其他 csv / config / docs 还有 stale 引用 · grep 才发现
- `[AI-NOTE] V2 已删` 注释下函数体没删 · grep 命中污染
- 白皮书 §3 场景脚本"三层记忆系统"跟 §2.3 主体"<第三方记忆方案> + 知识库 RAG"不一致（24 天后才被审计抓到）
- 模块依赖循环 / API 路由孤儿 / 外部 dep 未使用 · 无人看见

**根因**：**#DK 陈旧产物陷阱的根因之一**——#DK 现有修复段侧重**被动 grep 验证**（`grep [AI-NOTE].*已删 / 废弃 / legacy`）· 但**没有主动展示机制**——AI / 人陷在单个文件 · 看不到全局结构 → 看不到"哪些实体已删但还有引用"/"哪些数据无来源 / 无去向"/"哪些文档相互引用"。grep 是窄带验证 · 鸟瞰站是宽带验证。

**修复**（**Phase 0 调研 → Phase 1 建站 → Phase 2 维护** · 见审计夕潮 §6b + reference/visualization-templates/）：

1. **Phase 0 鸟瞰调研**（夕潮 §6b 7 步 SOP）：扫主语言 / 数据形式 / 文档分布 / 实体生命周期 / 现有可视化 / 复杂度 → 输出 `_project-recon-report.md` schema 报告
2. **Phase 1 建站**：按调研报告选模板（01 数据流向 / 02 策划案 / 03 通用代码 / 自由组合 / 兜底 _customization-patterns.md）+ 定制 → 生成 `public/audit.html` + `audit-data.json` + build script
3. **Phase 2 维护**：审计夕潮 §6 步骤 5b 钩子（修代码 commit 前自动重生 audit-data + 看孤儿数变化 + 报 stale 引用）· 或 pre-commit hook 强制 · 或 npm script 手动

**关键 schema 要求**（audit-data.json · 详见 reference/visualization-templates/_schema-template.md）：

- 每个 entity 必带 `lifecycle: active | deprecated | removed` 字段
- `lifecycle: removed` 必带 `removedAt` + `removedBy` + `lastReferencedIn`（**这是 #DK 防御核心**——build script 扫 git log 历史 deleted entities · grep 当前代码找 stale 引用 · 暴露给人类肉眼）
- `orphans` 字段由 build script 计算（不要手填）：`no_source / no_sink / removed_with_refs / deprecated_with_refs / modules_no_callers / apis_no_callers / external_deps_no_usage`

**判定**：项目满足以下任一 + 缺鸟瞰可视化 → 命中 #DL：

- 5+ entity 类型（角色 / 装备 / 任务 / 关卡 / 道具 ...）
- 100+ files
- 3+ 协作者
- 多次重构（V1→V2 / 旧→新 / deprecated but kept 等描述）
- 复杂度 tier ≥ medium（详见 _project-recon-report.md §6）

**grep 模板（开工前必跑）**：

```bash
# 检测是否已有鸟瞰站
ls public/audit.html design/index.html docs/dashboard/ docs/visualization/ 2>/dev/null

# 如已有 · 检查新鲜度
git log -1 --format="%ai" -- public/audit-data.json 2>/dev/null

# 如已有 · 检查 schema 完整性
jq '..|objects|select(has("id") and (has("lifecycle")|not))' public/audit-data.json 2>/dev/null
jq '.orphans' public/audit-data.json 2>/dev/null
```

**反例（不适用 #DL 的场景）**：

- prototype 项目（< 30 files / < 7 days）· 还没到 stale 累积阶段
- 单文件脚本 / 教学示例
- user 显式说"不建鸟瞰站"的项目（尊重 user · 跟基础夕潮 §0 习惯一致）

**关联**：**#DK（主动防御工具 · 升级"被动 grep 验证" → "主动结构化展示"）** · **#I（代码先行基建后补 · 鸟瞰站属于关键基建）** · 审计夕潮 §6b 鸟瞰调研 SOP / §9.E 鸟瞰可见度评审

**出处**：2026-05-18 · v3 提炼自 user 两份参考提示词（数据流向审计单页站 + 策划案审阅网站）+ 某复杂项目 24 天 stale 累积案例（csv 5 行误读 / 白皮书漏修引用）+ user "保证任何项目都适用" 升级反馈

---

### 形状 #DM · 多 session 撞共享脊柱（并行 session 在隔离层不冲突，却在脊柱争用）

**症状**：一个仓库被多个平级 session（多个 Claude Code / 协作者）同时改。各 session 改各自的"垂直切片"（UI + 文案 + 配置 + 服务 + 引擎）时文件集不相交、相安无事；但一旦两个 session 同时改一条**共享脊柱**（聚合 store / 共享类型源 / 路由调度层 / 跨端协议 / 账户经济状态）→ git 冲突、或更隐蔽的语义冲突（双方都改同一全局状态的不同行 · build 过但运行时打架）。

**根因**："AI 不打架"被误当成自带能力。实际并行安全 = 架构有干净的缝 + 人沿缝分活 + 协议兜底争用面，三者缺一就会撞。按"技术层"切（一个 session 改所有 store / 一个改所有组件）必撞——每个功能横跨所有层；只有按"关注点"垂直切片才物理上不相交。脊柱是少数无法切分的共享文件 · 是被协调的争用面 · 不是可消灭的。

**修复**（完整方法见独立 skill `yushio-parallel`）：

1. **垂直切片**：让代码模块边界 = 领域边界（你脑子里理解产品的维度）·"一关注点一 session"文件集天然不相交
2. **识别脊柱**：grep 聚合状态 / 共享类型 / 路由调度 / 跨端协议 / 账户经济（见 yushio-parallel §0.2）
3. **铁律**：绝不让两个 session 同时改同一段脊柱（串行 / 谁先谁主 / 拆契约 三选一）
4. **协议兜底**：足迹可见（`touched:` 清单 / log-agent hook）+ commit 带模块 scope + 冲突回 user 仲裁绝不自动 merge（基础夕潮 §4.11）+ 脊柱改动先公告
5. **机器护栏**：路径作用域规则（基础夕潮 §8.3 `applies-to:` 自动注入该层规约）+ 提交期 hook（审计 §13b）把"自觉"变"结构"

**判定**：看到 多 git worktree / 同仓库被多 session 同时打开 / user 说"同时开几个 session 做不同模块" → 命中。先识别脊柱再分活 · 切不出干净的缝就别硬开 session（session 数 ≈ 干净的隔离切片数 · 不是越多越好）。

**grep 模板（识别脊柱 · 开工前）**：

```bash
grep -rlnE "createStore|combineReducers|configureStore|global|singleton|let _?current" <state-dir>
grep -rln "export (type|interface|enum)" <shared-types-dir>
grep -rlnE "balance|wallet|gold|inventory|account|economy" <src>
```

**反例（不适用 #DM）**：单 session 项目 · 切不出不相交文件集的强耦合代码（先重构出缝或串行）· 多 subagent 委派（那是基础夕潮 §4.8 纵向委派 · 不是平级并行）。

**关联**：**#DK（多 session 的协调文档 / 交接信也会 stale）** · **#H（双源漏同步 · 脊柱被多方改后的一致性问题）** · 基础夕潮 §4.8（多 subagent 边界）/ §8.1（探测信号）/ §8.3（路径作用域规则）· 独立 skill `yushio-parallel`（完整方法）

**出处**：2026-05-25 · 某 React + TS 多 session 并行项目（8+ session 不打架）dogfooding 提炼

---

## §4 流程形状

### 形状 #C · 写方法论文档时作者容易不用方法论

**症状**：面对 "看起来是规划 / 设计 / 结构化任务"（写 plan / 写文档 / 写交接信 / 写 ADR / 设计架构）的请求时，倾向于直接产出内容（shopping list / 章节树 / 骨架），**跳过对任务本身的 §4.1 开工 5 问**。

**根因**：把 5 问误认为 "写代码前的门槛"，忘了第 3 问 "体验画面" 对任何产出物都成立。"这个任务看起来不用写代码所以不用 5 问" 是一个常见的思维陷阱。

**修复**：写方法论文档 + 第一反应 "我要列结构" 时 → **停** → 对元任务做 5 问。尤其是第 3 问："一个完全没见过这份文档的人读完后，第一个行为画面是什么？"

**判定**：看到 "这是规划 / 设计 / 结构化任务" 的念头时 = **正是最需要 5 问的时刻**，不是可以跳过的时刻。任何非 trivial 的产出物（不限代码）都适用。

**关联**：#J（Plan 批准后跳纪律）· #DJ（"独立进程不影响" 也是同根 · 没举一反三）

**出处**：2026-04-15 · 本元文档 session 自身违纪事件

---

### 形状 #E · 横向铺面 N 文件 0 功能

**症状**：一个 session 里产出了大量文件（7 个 milestone 骨架 / 20 个新文件 / 30+ 条目 shopping list），但没有一个从代码到人类可感知结果的完整路径跑通。

**根因**：把 "文件数量" 当进度，把 "typecheck 通过" 当质量。忘了代码不是给自己写来完成任务的，是给下游消费者体验的。

**修复**：基础夕潮 §4.2 的两条不变量判断（完整路径 / 写一半能看到差别吗）。每创建 3+ 新文件时停下来问 "几个在下游产生可见变化"。< 2 = 横向铺面。

**判定**：一次产出 3+ 新文件且无可见变化 = 横向铺面。选一个，纵向打通到底再做下一个。

**关联**：#X（前端 UI 重复实现）· #I（基建后补的另一种表现）

**出处**：2026-04-10 · 某项目 M5-M11 "20 文件 0 功能" 事件

---

### 形状 #F · 手写 JSON 应该是结构化 UI

**症状**：编辑器 / 面板里用 textarea 让 user 手写 JSON 对象 / expression 字符串 / condition DSL，而这些数据本质是结构化的（有已知字段、枚举类型、约束）。

**根因**：写面板时为了赶工用 textarea 占位，计划 "后续换成结构化"，从来没换。user 抱怨 "看不懂" 时才暴露。

**修复**：详情面板所有结构化数据都用结构化组件（下拉 / 多选 / 字段列表 / 带验证的表单）。textarea 只用于真正的自由文本（标题 / 描述 / 长段注释）。

**判定**：看到 textarea + JSON.parse / JSON.stringify → 这是结构化数据用错了呈现。统一扫一遍同面板所有字段，是不是都有这个形状。

**关联**：—

**出处**：2026-04-14 · 某项目画布优化

---

### 形状 #H · 状态改完但另一侧没跟上（双源漏同步）

**症状**：数据有两个或多个表示（canvas store + editor store / 前端 cache + 后端数据 / local state + global state），在一处修改后另一处没更新。user 表现 "我改完列表但画布没动"。

**根因**：显式同步调用被遗忘。依赖 "记得调用" 的人肉流程必然失败。

**修复**：ID 序列对齐、autosave 时 invalidate 对应 cache、或统一到单一数据源。**不能只 "加一次同步调用"，要加 "同步保护层"** —— 就算未来漏写同步调用，数据也不会被覆盖。

**判定**：任何双源数据 → 问 "如果有人漏写同步调用会怎样"。答案是 "数据会不一致" → 需要结构性保护。

**关联**：—

**出处**：2026-04-14 · 某项目画布 vs 列表双源同步

---

### 形状 #I · 代码先行基建后补（"第二个 session 从零开始"）

**症状**：第一个 session 产出了可运行的 demo，但第二个 session 的 AI 打开项目后不知道 "做到哪了" / "为什么做了这些决策" / "下一步该做什么"。缺少活文档 / 交接信 / ADR。

**根因**：立项时注意力全在 "最快跑通纵向切片" 上，忽略了 "让下一个人能接着跑" 的基建。代码进度 = 产品进度的错觉。

**修复**：每个项目的第一个 session 结束前，必须有：
1. 活的产品状态文档（STATUS.md / vision.md）
2. 交接信
3. 至少一个 ADR
4. 更新的 CLAUDE.md / AGENTS.md 指向这些文档
5. 更新的 README.md

"持续不走偏" 需要六个机制协同：方向锚定 / 决策不可逆 / 交接连续性 / 记忆积累 / 验证锚点 / 纪律反馈。

**判定**：session 结束前问 "下一个 session 的 AI 执行 §0 后能不能在 30 秒内知道该做什么"。答案是 "不能" = 基建缺失。

**关联**：—

**出处**：2026-04-16 · 某 React + TS 视觉小说项目立项 session

---

### 形状 #J · Plan 批准 ≠ 跳过纪律（"执行模式的纪律断裂"）

**症状**：Plan 经 user 批准后，AI 进入 "执行模式" ——连续产出代码但跳过 5 问 / 逆向审计 / 举一反三。产出速度快但质量锚点丢失。

**根因**：把 plan 批准当作 "所有思考已完成，现在只需要写" 的信号。忘了 plan 是路线图不是执行脚本——每一步仍需独立思考。与形状 #C 同根：面对 "看起来很明确的任务" 时跳过元思考。

**修复**：Plan 批准后，每个子任务仍走 §4.1 开工 5 问。完成后做 §4.3 逆向审计。发现模式做 §4.4 举一反三。这些不是 "额外步骤"，是工作方式本身。

**判定**：开始写代码前问自己 "这个子任务的画面是什么"。答不出来 = 跳过了 5 问。

**关联**：#C（方法论作者不用方法论同根）

**出处**：2026-04-16 · 同上 React + TS 视觉小说项目 session

---

### 形状 #L · 修实例不修 Pattern（**核心原则** · 不只是形状）

> #L 已升级为所有形状扫描的**前提原则**——见本文件顶部「核心原则」段。本节保留作为历史记录 + 案例参考。

**症状**：审计报告指出 `PUT /settings` 缺权限，修复者只改了 `PUT /`，同文件另外 8 个 PUT 没改。审计报告指出删 2 行 console.log，修复者删了那 2 行但同文件还有 8 行相同 pattern 没处理。前端加了 debug gate 但 `init()` 函数里还有一处无条件覆盖没发现。

**根因**：把修复当 "勾选 checklist" 而非 "理解 pattern 后全面扫描"。AI 辅助编码尤其容易犯——AI 按指令改了指定行，但不会自发问 "同文件 / 同层级还有没有同类"。人类 review 也会犯——看到 PASS 就跳过，不验证 "同 pattern 还有没有"。

**修复**：修完一条后 `grep -rn "同关键词" 同目录/`。验收时对每个 PASS 问 "同文件 / 同层级还有没有同类问题"。**详细 5 步 SOP 见审计夕潮 SKILL §6**。

**判定**：收到修复指令后，第一反应不是 "改哪一行"，而是 "这是什么 pattern，在同文件 / 同层级还有多少个"。修完后 grep 验证覆盖度。**验收方看到修复只改了指定行而没扩展扫描 → 打回要求补全。**

**关联**：#W（多层数据传递特化）· #X（前端 UI 复制特化）· 几乎所有审计形状（#K~#X）都关联

**出处**：2026-04-16 · 多项目审计——5 轮审计 109 条修复中 24 条是同形状第二次发现

---

## §5 设计形状（指针）

设计形状由美术总监夕潮 SKILL §9 单独维护，不在本文件重复定义：

- #DA 配色和品牌情绪脱节
- #DB 动效气质和产品节奏不匹配
- #DC 新功能视觉孤岛
- #DD 美术总监先假设方向再问用户
- #DE Emoji / 视觉清扫只扫组件漏 seed 字符串
- #DF 签字稿 hex 实装时静默漂移
- #DG spec 文字描述漂离签字稿 HTML

完整定义路径：`~/.claude/skills/yushio-art-director/SKILL.md` §9

---

## 沉淀流程（升级 / 退役 / 合并 / 命名）

> 本节定义跨项目形状的沉淀机制。**owner 是审计夕潮 SKILL §11**——本节只是 reference 层的策略说明。

### 升级条件（项目级 → reference 文件）

新形状满足以下**全部**条件才升级到本文件：

1. **3 项目见过**：至少在 3 个独立项目中被发现（不只是 1 个项目反复出现）
2. **跨语言可迁移**：判定 / 修复 pattern 不绑定单一语言或框架（如 #K TOCTOU 在 JS/Python/Go 都成立）
3. **关联形状清晰**：能写出和现有形状的关联（不是孤立)
4. **判定有可执行 grep 模板**：判定不能只是 "凭感觉"——必须有 grep 命令或机器可识别的 pattern

不满足 = 留在项目级形状库（建议路径 `<project>/docs/audit/_shape-library.md`），等待累积。

### 升级动作

升级时审计夕潮 §11 owner 操作：
1. 项目级形状库该形状状态标记为 `↑ PROMOTED → reference 文件`，保留本地出现位置 + 修复轮次
2. reference 文件追加形状定义 + 关联 + 出处（含原项目名）
3. 项目实例链接表追加一行（见下文 §项目实例链接表）
4. reference 文件迭代日志追加一行
5. 各 SKILL（基础夕潮 §4.4 inline 速查 / 审计夕潮 §10）按需更新

### 退役（连续 3 轮 0 命中）

某形状在最近 3 轮项目级审计中均未被发现 → 标 `[HISTORICAL]`，从 ACTIVE 索引表移除，提交前 Review 不再强制扫描。

### 合并（两形状重叠 > 80%）

两个形状的 grep 模板 / 反模式重叠 > 80% → 判定为等价 → 合并，保留较早的 ID，被合并的 ID 标 `[MERGED → #X]`。

### ID 命名规则

- 跨项目 ID **永不复用**（即使退役也保留 `[HISTORICAL]` 占位 · 防混淆历史 commit）
- 编号约定：
  - #A-#J = 开发通用 bug 形状（含 #C/#E/#F/#H/#I/#J 流程形状插入位）
  - #K-#X = 审计高频技术形状
  - #DA-#DG = 设计形状（美术总监 SKILL §9 owner）
  - #DJ-#DK 及之后 = Meta 形状
- 字母用尽后改 #AA / #AB / ...
- 跨项目迁移时可保留原 ID + 项目前缀（如 `<project-prefix>-#K`）作为引用

---

## 项目实例链接表

> 每个跨项目形状反向链接到具体项目本地实例位置 + 修复轮次。让跨项目形状能找到 "在 X 项目里这个形状在哪些文件出现过 + 修过几轮"。

| 形状 ID | 项目本地引用 | 状态 |
|---|---|---|
| #K | （项目实例待 dogfooding） | — |
| #M | （项目实例待 dogfooding） | — |
| #N | （项目实例待 dogfooding） | — |
| #O | （项目实例待 dogfooding） | — |
| #P | （项目实例待 dogfooding） | — |
| #Q | （项目实例待 dogfooding） | — |
| #R | （项目实例待 dogfooding） | — |
| #S | （项目实例待 dogfooding） | — |
| #T | （项目实例待 dogfooding） | — |
| #U | （项目实例待 dogfooding） | — |
| #V | （项目实例待 dogfooding） | — |
| #W | （项目实例待 dogfooding） | — |
| #X | （项目实例待 dogfooding） | — |
| #DJ | （项目实例待 dogfooding） | — |
| #DK | （项目实例待 dogfooding） | — |
| #DL | （项目实例待 dogfooding · 计划 01+02 混合模板） | 模板就绪 |
| #DM | （项目实例待 dogfooding · 多 session 并行场景） | yushio-parallel 就绪 |
| #A/#B/#D | 某 React + TS 视觉小说项目（项目实例待 dogfooding） | — |
| #G | 某项目 canvasStore autosave（项目实例待 dogfooding） | — |
| #E | 某项目 milestone 横向铺面事件（项目实例待 dogfooding） | — |
| #F | 某项目画布优化（项目实例待 dogfooding） | — |
| #H | 某项目画布 vs 列表双源（项目实例待 dogfooding） | — |
| #I | 某 React + TS 视觉小说项目立项 session（项目实例待 dogfooding） | — |
| #J | 某 React + TS 视觉小说项目立项 session（项目实例待 dogfooding） | — |
| #L | 某项目多轮审计积累（项目实例待 dogfooding） | 持续监控 |

新项目接入时在表中追加一行（`<#形状> | <项目名> <本地形状库引用> | <状态>`）。

*GitHub 开源版：项目实例链接表脱敏为占位 · 等待 dogfooding 项目接入。*

---

## 迭代日志

完整迭代日志见仓库根 [CHANGELOG.md](../../../CHANGELOG.md)。本文件结构变更（schema 升级 / 新增形状类别等）的记录从开源版起：

- **2026-05-19 · GitHub 开源版** · 项目实例链接表脱敏为占位 · 迭代日志合并到 CHANGELOG.md
