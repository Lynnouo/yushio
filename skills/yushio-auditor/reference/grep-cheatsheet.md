# 审计夕潮 · grep 速查表(按形状类别)

> 审计夕潮 SKILL.md §7 的伴随文件。审计现场要排查某类形状时,这里是整套可复制 grep 命令 + 评估提示。每个形状的 grep 模板权威源在 `~/.claude/skills/yushio/reference/shape-library.md` · 本表是审计现场的快查版。

## 权限类(对应形状 #P)
```bash
# Step 1: 找所有 router-level 宽松 auth 的文件
grep -l "router\.use(optionalAuth)\|app\.before_request" <routes-dir>
# Step 2: 对每个文件列出所有写路由
grep -n "router\.\(put\|post\|delete\)\|@app\.route.*method" <file>
# 评估：每个写路由的权限是否匹配其操作敏感度（修改全局配置 → admin · 修改用户数据 → auth · 只读 → optional）
```

## 锁类(对应形状 #K / #T)
```bash
# 某个 DAO 的所有写函数
grep -n "^export async function\|^async def" <dao-file>
# 该文件所有 withLock
grep -n "withLock\|asyncio\.Lock" <dao-file>
# 评估：每个写函数都有对应 withLock 吗？锁键一致吗？
```

## 错误处理类(对应形状 #Q)
```bash
# 找所有 catch 后没传播错误的可疑模式
grep -B 1 -A 5 "} catch\|except.*:" <file> | grep -v "throw\|return\|raise\|res\.status"
# 信息泄漏：err.message 进 response body
grep -rn "err\.message\|str(e)\|error\.message" <routes-dir> | grep "res\.\|return"
```

## LLM / 外部 API 端点(限速 + 鉴权)
```bash
# 找所有调外部 LLM / VLM / 付费 API 的端点
grep -B 2 -A 5 "ai\.chat\|llm\.chat\|openai\.\|anthropic\.\|fetch.*api/v1" <routes-dir>
# 评估：向上看 router.post/put 是否有 limiter + 严格 auth
```

## Mask / 敏感字段一致性
```bash
# 所有 mask 实现
grep -rn "apiKey.*slice\|mask\(\|masked\|\\*{4}" <routes-dir>
# 评估：所有端点的 mask 格式是否统一？防回传逻辑是否兼容 mask 后的字符串？
```

## 弱随机(对应形状 #S)
```bash
# Node
grep -rn "Math\.random" <src>/{services,middleware,routes/auth*,utils}
# Python
grep -rn "random\.random\|random\.randint\|random\.choice" <src>/{services,routes/auth,middleware}
# Go
grep -rn "math/rand" <src>/{services,middleware,routes/auth}
# 评估：是安全场景（验证码 / token / UID / CSRF）还是娱乐场景（抽卡 / 骰子）
```

## 路径穿越(对应形状 #U)
```bash
grep -rn "path\.join\|path\.resolve\|os\.path\.join" <src> \
  | grep "req\.params\|req\.body\|req\.query\|request\.\(args\|json\|form\)"
# 评估：是否做正则白名单校验？是否检查 resolved 路径在 baseDir 内？
```

## Mass assignment(对应形状 #V)
```bash
grep -rn "\.\.\.req\.body\|\.\.\.body\|\.\.\.request\.json\|update_from_dict" <routes-dir>
# 评估：是否用 safeMerge / stripForbiddenKeys / 字段白名单？
```

## 全局单例串号(对应形状 #O)
```bash
# Node
grep -rn "setCurrent\|this\._current\|let _current\|let currentUser" <services-dir>
# Python
grep -rn "_current_\|globals()\['current\|current_user = None" <src>
# 评估：多用户并发会串号吗？应改 AsyncLocalStorage / contextvars / Map<userId, State> 吗？
```

## Service 白名单过滤(对应形状 #W)
```bash
# 找所有 DAO 调用后的 explicit return 模式
grep -rn "await .*Dao\.get\|await .*Repo\.find" <services-dir> \
  | awk -F: '{print $1}' | sort -u \
  | xargs -I{} grep -l "return {" {}
# 评估：DAO 加新字段时这些 Service 都要补字段吗？应改拒绝名单吗？
```

## Debug 残留(对应形状 #M)
```bash
grep -rn "TODO\|FIXME\|暂\|临时\|debug\|mock" \
  --include="*.{js,ts,py,go,rs}" --include="*.html" \
  --exclude-dir=node_modules --exclude-dir=tests --exclude-dir=dist
# 评估：每条评估"是否还需要？是否有 isDevMode 守卫？"
```

## 资源无上限(对应形状 #R)
```bash
grep -rn "new Map\|new Set\|new WebSocketServer\|express\.json\|@cache\|lru_cache" <src>
# 评估：每个有 maxSize / TTL / limit 吗？
grep -rn "ipcMain\.on\|addEventListener\|on_event\|signal\.connect" <main-process>
# 评估：每个有配套 removeListener / removeEventListener / disconnect 吗？
```

## 陈旧产物搜查(对应形状 #DK · 开工前必跑)
```bash
grep -rn "\[AI-NOTE\].*已删\|废弃\|deprecated\|legacy\|V[12]" <relevant-dir>
# 评估：每条命中 "为啥还没删 · 现在还在影响什么 · 能否一并清"
```
