# 审计夕潮 · 代码质量主动评审(5 维度 · 细则)

> 审计夕潮 SKILL.md §9 的伴随文件。SKILL §9 留了 5 维度的名称 + 何时跑 + 每维一句判断;这里是每维的症状形态 / 判断链 / 修复方向 / 反面 / grep + 输出报告格式。做"质量评审 / 代码 review"时按需查。
>
> **何时跑**:user 显式说 "质量评审 / 代码 review / review 这块"。**不在自动召唤场景跑**(自动召唤只跑 §6 修复 5 步 SOP)。**原则 + 启发式判断,不是机械 checklist**:每条给 "看到 X → 怎么判断 → 怎么改" 的判断链。

## 维度 A · 屎山检测(结构性恶化)

**症状的具体形态**:
- 单函数 100+ 行 · 嵌套 4+ 层 if/for/try
- 单文件 800+ 行(脚本 / 配置文件除外)
- 一个文件 import 30+ 个其他模块
- 跨模块循环依赖(A → B → C → A)
- 一个 class 12+ 个方法 · 或一个对象 20+ 个字段
- 同一份逻辑在多处复制(属于 #X · 但 #X 是前端特化 · 后端 / 数据层同样适用)

**判断链**:
1. **大不一定屎**:500 行的状态机如果是数据驱动 + 表格化是清晰的 · 50 行的回调地狱可能是屎
2. **嵌套深的根本问题是 cognitive load**:4 层嵌套 = 读到第 4 层时上下文 = 4 个 condition × 2 = 8 维 → 大脑过载
3. **跨模块循环依赖是 architecture smell**:通常意味着边界划错了 · 不是 "加个 lazy import 就行"
4. **复制粘贴 3 次以上 = 候选抽函数**(#X 判定)

**修复方向**(不修代码 · 给 user 建议):
- 长函数:识别 cohesive sub-routines · 抽出小函数 · 主函数变 orchestrator
- 深嵌套:early return / guard clause / 状态机表格化
- 大文件:按职责拆分 · 不是按行数(一个文件 800 行如果是单一职责且无法拆解 · 就保持)
- 循环依赖:找出真正属于哪一层 · 把跨层依赖抽到接口
- 复制:抽 helper · 阶段 1 在当前文件 · 阶段 2 promote 到 shared

**反面**:
- ❌ "这个函数 120 行 · 拆成 3 个 40 行的"(不看 cohesion · 拆得更乱)
- ❌ "全部用 design pattern 重写"(YAGNI · 引入更多间接层)
- ✅ "这个函数前 30 行做参数 normalize · 中间 60 行是核心 · 末尾 30 行是 cleanup · 抽 normalize + cleanup 让核心逻辑可读"

## 维度 B · 解耦判断(边界 / 依赖方向 / 隐性耦合)

**症状的具体形态**:
- A 模块直接读 B 模块的 internal state(不经接口)
- 全局可变状态被多处 mutate(属于 #O · 但 #O 是审计角度 · 这里看架构)
- module-level `let` / `var` 共享 mutable 对象
- A 改字段名 → B/C/D 都得跟着改(高 fan-out · 紧耦合)
- 测试某模块需要 mock 7+ 个其他模块(依赖过多)
- 配置散落多处(DB / env / hardcoded / config 文件)—— 改一个值要找 3 处

**判断链**:
1. **依赖方向应该是单向的**:domain → infra(不反向)/ component → store(不反向)/ business → util(不反向)
2. **接口不是隔离 · 是契约**:A 通过接口调 B · 但 B 接口签名暴露内部实现细节 → 没解耦 · 只是加了间接层
3. **"全局" 不一定坏 · "可变 + 全局" 才坏**:global constants OK · global mutable state = #O 风险
4. **耦合度 = 改一处会影响多少处**:grep 重命名某个公共函数 · 看影响范围 · 越广越紧耦合

**修复方向**:
- 隐性 mutation:改成显式接口(getter/setter or method)· 调用方知道是 "改" 不是 "读"
- 配置散落:建立单一 config source · 其他位置引用而非复制
- 高 fan-out 字段:考虑是否该是抽象(value object / enum)而不是裸字段
- 跨模块循环:识别共享部分 · 抽到第三方模块

## 维度 C · 硬编码扫描(魔法值 / 内联字符串 / URL / 路径 / 超时)

**症状**:
- 数字字面量出现在条件判断中:`if (count > 100)` · `if (age >= 18)` · `setTimeout(fn, 5000)`
- URL / 域名硬编码:`fetch('https://api.example.com/v1/...')`
- 文件路径硬编码:`fs.readFileSync('/Users/x/data.json')`
- 配置应外置但写死:`const MAX_RETRIES = 3` 在业务代码中(应该来自 config)
- 同一字符串多处出现(应抽常量):`'[error] Internal error'` 出现 5 处

**判断链**:
1. **不是所有数字都是魔法值**:`for (let i = 0; i < arr.length; i++)` 的 0 不算 · `setTimeout(fn, 30000)` 的 30000 算
2. **判断标准**:这个值是**业务规则**(年龄阈值 / 重试次数 / 超时)还是**实现细节**(数组下标 / 循环初值)—— 业务规则**必须**抽常量
3. **URL / 路径**:dev / staging / prod 不同 → 必须 env 变量 · 同环境内常量也要抽
4. **多处出现的字符串**:3+ 处出现 → 抽常量(拼写一致性 + 改动一处生效)

**grep 模板**:
```bash
# 数字字面量在条件中（粗扫）
grep -rn "if.*[<>=]\s*[0-9]\{2,\}\|setTimeout.*[0-9]\{4,\}" <src>
# URL 硬编码
grep -rn "https\?://[^'\"]*\(api\|v[0-9]\)" <src> | grep -v "test\|spec"
# 文件路径硬编码（绝对路径）
grep -rn "['\"]/Users/\|['\"]/var/\|['\"]/etc/\|['\"]/tmp/" <src>
# 配置常量散落（应来自 config）
grep -rn "const MAX_\|const DEFAULT_\|const TIMEOUT_" <src>/{services,routes,middleware}
```

## 维度 D · 抽象度评判(YAGNI vs DRY 的边界)

**两个方向的错误**:

### D1 · 过度抽象(YAGNI 违反)
**症状**:
- 一个 interface 只有一个 implementation(没有第二个 impl 的真实需求)
- 工厂模式 / 策略模式用在不会变化的场景
- 5 层 wrapper / decorator · 每层加一点点
- "为了未来扩展" 的抽象层
- 泛型嵌套 5+ 层

**判断**:现在有 N 个 implementation · N=1 → 不抽 · N=2 → 警觉 · N=3 → 抽

### D2 · 抽象不足(DRY 违反 · 重复 3 次还没抽)
**症状**:
- 同一逻辑复制 3+ 处(属于 #X · 这里看抽象度)
- 类似函数(参数差 1 个 · 行为 80% 一致)并列存在
- 5 个文件都用了同一段 try-catch + log + retry 包装

**判断**:3 次出现 = 候选抽象 · 5 次以上 = 必须抽

### D3 · 错误抽象(接口 leaky)
**症状**:
- 接口签名暴露内部实现细节(如 `getDataAsArray()` 暴露存储是数组)
- 一个 abstract class 的子类覆盖了几乎所有方法(说明 base class 抽错了)
- 调用方需要知道底层选择哪个 implementation 才能用对

**判断**:好的抽象 = **不需要知道内部** 也能用对 · 需要知道 = 抽错了

## 维度 E · 鸟瞰可见度(项目结构可视化质量 · #DL 修复评估)

> 配合形状 #DL「项目缺鸟瞰可视化」+ §6b 鸟瞰调研 SOP

**何时评**:项目复杂度 ≥ medium tier(5+ entity 类型 / 100+ files / 3+ 协作者 / 多次重构任一) · 应有鸟瞰可视化站。

**症状的具体形态**:
- **无鸟瞰站**:项目 100+ files / 多 module / 多 entity · 没有任何结构化可视化(`public/audit.html` / `design/index.html` / `docs/dashboard/` 都不存在)→ AI / 人陷局部失全局
- **鸟瞰站存在但 stale**:站点最后更新 > 30 天 · 数据快照跟当前实际架构不一致 → 鸟瞰站自己变虚假真相(反讽)
- **鸟瞰站无 lifecycle 标记**:audit-data.json 缺 `lifecycle: active|deprecated|removed` 字段 → 看不出"已删但还有引用"的 stale
- **鸟瞰站无孤儿检测**:缺 `orphans` 字段 · 无来源 / 无去向 entity 没被识别
- **鸟瞰站无历史扫描**:build script 只扫现有数据 · 不扫 git log 历史删除 entity → #DK 防御失败
- **孤儿数趋势上升**:rebuild 后 `orphans.no_source / no_sink / removed_with_refs` 持续增长 · 团队没人修

**判断链**:
1. **存在 + 新鲜 + 完整 schema**:可视化质量 ✅ PASS
2. **存在但 stale > 30d**:⚠️ 鸟瞰站本身变 stale = 反讽(用来防 stale 的工具自己 stale)→ 推荐 rebuild
3. **不存在**:复杂度 ≥ medium 应建 → 走 §6b 鸟瞰调研 SOP(user 拒绝则尊重)
4. **存在但缺关键 schema 字段**:升级 audit-data.json 加 `lifecycle` + `orphans` + 历史扫描

**grep 检查**:
```bash
# 1. 鸟瞰站是否存在
ls public/audit.html design/index.html docs/dashboard/ docs/visualization/ 2>/dev/null
# 2. 数据文件新鲜度（git log mtime）
git log -1 --format="%ai" -- public/audit-data.json 2>/dev/null
# 3. schema 完整性（必须含 lifecycle + orphans）
jq '..|objects|select(has("id") and (has("lifecycle")|not))' public/audit-data.json 2>/dev/null
jq '.orphans' public/audit-data.json 2>/dev/null
# 4. 历史扫描覆盖（应有 lifecycle: removed 的 entity）
jq '..|objects|select(.lifecycle=="removed")' public/audit-data.json 2>/dev/null
```

**修复方向**:
- 无鸟瞰站 → 走 §6b 鸟瞰调研 SOP → user approve → 用 `reference/visualization-templates/` 选模板建站
- stale 鸟瞰站 → 跑 `scripts/build_audit_data.<py|mjs>` 重生 · 加 §6 步骤 5b 钩子防再 stale
- 缺 schema 字段 → 按 `reference/visualization-templates/_schema-template.md` 补 · 升级 build script
- 孤儿数上升 → 排查 orphans 清单 · 决定每个孤儿 "清掉 / 接入 / 标注有意保留"

**反面(不要 E 维度评的场景)**:
- prototype 项目(< 30 files / < 7 days)→ 不需要鸟瞰站 · 跳过本维度
- 单文件脚本 / 教学示例 → 跳过
- user 显式说"不建鸟瞰站"的项目 → 尊重 · 标 "by user decision · 不评"

## 输出格式

代码质量评审的输出 = 一份 review 报告(不是 commit message):
```
## §A 屎山检测
- 发现：file.js:N getUserData() 130 行 · 嵌套 5 层
- 判断：复杂度高于阈值 · cognitive load 过载
- 建议：抽 normalizeInput / fetchAndJoin / formatOutput 三个 sub-routine

## §B 解耦判断
...

## §C 硬编码扫描
- 发现：file.js:N `setTimeout(fn, 30000)` · 5 处出现
- 判断：业务规则（poll 间隔）应外置
- 建议：抽 `const POLL_INTERVAL_MS = 30000` 在 config/poll.ts · 5 处引用

## §D 抽象度评判
...

## §E 鸟瞰可见度
- 发现：项目 200+ files / 8+ entity 类型 / V1→V2 重构期 · 无任何鸟瞰可视化
- 判断：复杂度 = medium-large tier · 形状 #DL 命中 · #DK 防御缺失
- 建议：走 §6b 鸟瞰调研 SOP → 调研报告 → user approve → 建站（推荐组合 01 + 02）

## 优先级建议
P0（建议本 sprint 修）：屎山 §A 第 2 条 · 解耦 §B 第 1 条 · 鸟瞰 §E（建站基建）
P1（下 sprint）：硬编码 §C 第 3-5 条
P2（积累技术债追踪）：抽象度 §D 第 1 条（暂不动）
```
