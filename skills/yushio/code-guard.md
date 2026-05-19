---
name: code-guard
description: Proactive code defense checklist derived from vibe coding anti-patterns. Run mentally before writing any backend route, DAO function, or frontend state mutation. Part of the Yushio (夕潮) skill ecosystem but usable independently.
---

# Code Guard · 编码防御清单

> 从多个项目的深度审计中提炼的 10 个高频错误 pattern。
> **不是事后 checklist，是写代码时的前置思考。**
> 每写一个函数 / 路由 / 组件前，花 30 秒扫一遍相关条目。

---

## 使用方式

**写后端路由时**：检查 §1 §2 §3 §5 §6 §7 §8
**写 DAO / 数据操作时**：检查 §1 §4 §7 §9 §10
**写前端状态逻辑时**：检查 §1 §3 §5 §7
**改别人代码时**：检查 §2（最重要）
**发版前扫一遍**：检查 §3 §8

---

## §1 · 并发写入必须有锁

> 对应形状 #K · TOCTOU 无锁竞态

**规则**：任何 `await read → 修改 → await write` 的三步操作，如果涉及**金币 / 物品 / 积分 / 等级 / 配置**，必须用锁包裹。

**写代码时问自己**：
- 这个函数修改了持久化数据吗？（DB / 文件 / 缓存）
- 如果两个请求同时调用这个函数，会发生什么？
- 两个 `await` 之间有没有修改共享状态？

**正确写法**：
```js
// 好：withLock 包裹整个 read-modify-write
export async function addBalance(userId, amount) {
    return withLock(`wallet:${userId}`, async () => {
        const wallet = await getWallet(userId);
        wallet.balance += amount;
        await setWallet(userId, wallet);
        return wallet;
    });
}
```

**错误写法**：
```js
// 坏：读和写之间有 await gap，两个并发请求会读到同一个值
const wallet = await getWallet(userId);
wallet.balance -= cost;  // 两个请求都减了，但只有最后一个 write 生效
await setWallet(userId, wallet);
```

**自检命令**：`grep -rn "await.*get\|await.*read" server/src/services/dao/ | 逐行看后面有没有 withLock`

---

## §2 · 改的是 pattern 不是行号

> 对应形状 #L · 修实例不修 Pattern

**规则**：修任何 bug 或加任何功能后，问"同文件 / 同层级还有没有同类"。

**写代码时问自己**：
- 我刚加的这个 `withLock`——同文件其他写函数有吗？
- 我刚加的这个 `adminApiAuth`——同文件其他 PUT/DELETE 需要吗？
- 我刚删的这个 `console.log`——同文件还有几个？
- 我刚修的这个 XSS 转义——同页面其他 innerHTML 做了吗？

**修完后执行**：
```bash
# 假设你刚给 equipSlot 加了 withLock
grep -rn "export async function" server/src/services/dao/inventory-dao.js
# 看看其他函数有没有 withLock
```

**硬性要求**：修完一个 bug 后，在 commit message 里写"同文件/同层级扫描结果：[发现 N 处同类 / 无同类]"。

---

## §3 · Debug 代码写的时候就加守卫

> 对应形状 #M · "临时"变"永久"

**规则**：写 debug 代码的同时写好它的生命周期管理。不存在"以后再删"——你不会删的。

**后端 debug 端点**：
```js
// 写的时候就加守卫，不是 TODO
router.post('/debug/xxx', authMiddleware, (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: '生产环境不可用' });
    }
    // debug 逻辑...
});

// 更好：直接不注册路由
if (process.env.NODE_ENV !== 'production') {
    router.post('/debug/xxx', authMiddleware, handler);
}
```

**前端 debug UI**：
```html
<!-- 写的时候就 hidden，JS 里根据 dev flag 解锁 -->
<div id="debug-panel" hidden>...</div>
<script>
if (window.electronAPI?.isDevShell) {
    document.getElementById('debug-panel').hidden = false;
}
</script>
```

**console.log**：
```js
// 坏：裸 console.log
console.log('[Debug] wallet:', wallet);

// 好：用 logger，生产环境自动静默
const log = createLogger('Wallet');
log.debug('wallet:', wallet);
```

**自检命令**：
```bash
grep -rn "TODO\|FIXME\|暂\|临时\|debug\|mock" --include="*.js" --include="*.html" \
  --exclude-dir=node_modules --exclude-dir=tests
```

---

## §4 · 多步写操作要考虑中间崩溃

> 对应形状 #N · 非原子多步操作

**规则**：连续两个 `await db.操作()` 修改相关数据时，问"如果第二步失败，第一步怎么回滚？"

**写代码时问自己**：
- 我先 DELETE 再 INSERT——中间网络断了怎么办？
- 我先扣款再发道具——发道具失败了钱怎么退？
- 我先更新 A 表再更新 B 表——B 失败了 A 怎么办？

**方案优先级**：
1. **最好**：用数据库事务 / RPC 包裹（一步失败全回滚）
2. **次好**：补偿事务（try-catch，失败时手动回滚前面的步骤）
3. **最差**：分别操作不处理（= 数据不一致风险）

```js
// 补偿事务示例
let debitDone = false;
try {
    await walletDao.addBalance(uid, -cost);
    debitDone = true;
    await inventoryDao.addItemsBatch(uid, items);
} catch (err) {
    if (debitDone) {
        await walletDao.addBalance(uid, cost).catch(() => {}); // 回滚
    }
    throw err;
}
```

---

## §5 · 全局状态要考虑多用户

> 对应形状 #O · 单用户设计遇多用户现实

**规则**：模块级的 `let currentXxx` 变量 = 定时炸弹。

**写代码时问自己**：
- 这个变量存的是"当前用户"的状态吗？
- 如果两个用户同时在线，谁的值会覆盖谁的？
- 这个 singleton service 有没有 `setCurrentUserId` 这种方法？

**错误写法**：
```js
let _currentUserId = null;
export function setCurrentUserId(id) { _currentUserId = id; }
export function getCurrentUserId() { return _currentUserId; }
// 第二个用户连接后覆盖了第一个用户的 ID
```

**正确写法**：
```js
const _userState = new Map();
export function setUserState(userId, state) { _userState.set(userId, state); }
export function getUserState(userId) { return _userState.get(userId); }
```

---

## §6 · 路由权限要逐条审视

> 对应形状 #P · 权限粒度不匹配

**规则**：不要在 router 级别设默认权限然后忘了它。每个写路由的权限要**显式声明**。

**写路由时问自己**：
- 这个端点修改的数据有多敏感？（全局配置 > 用户数据 > 只读展示）
- `router.use(optionalAuth)` 是不是让我的 PUT 也继承了宽松权限？
- 未登录用户能调到这个端点吗？如果能，会怎样？

**权限选择指南**：
| 操作类型 | 推荐中间件 |
|----------|-----------|
| 全局配置修改（API Key、模型、提示词） | `adminApiAuth` |
| 用户数据修改（钱包、物品、属性） | `authMiddleware`（严格） |
| 用户自己的偏好设置 | `optionalAuth` + handler 内 `if (!uid) return` |
| 只读查询 | `optionalAuth` |
| Debug 端点 | `NODE_ENV` 守卫 + `authMiddleware` |

**新加路由时**：直接在路由声明上写中间件，不依赖 router.use 继承。
```js
// 好：显式声明
router.put('/api-key', adminApiAuth, handler);
router.get('/status', optionalAuth, handler);

// 坏：依赖继承，容易遗漏
router.use(optionalAuth);  // 所有路由都是可选认证...
router.put('/api-key', handler);  // 包括这个修改 API Key 的
```

---

## §7 · 错误必须传播

> 对应形状 #Q · 错误静默吞没

**规则**：`catch` 块里如果只有 `log.error`，那调用方不知道失败了。

**写代码时问自己**：
- 这个 catch 之后，调用方会认为操作成功了吗？
- 如果这个操作失败了，用户会看到什么？（什么都看不到 = 静默吞没）
- 这个 error handler 是空的吗？

**正确模式**：
```js
// 好：log + throw
try {
    await db.insert(data);
} catch (err) {
    log.error('插入失败:', err.message);
    throw err;  // 让调用方知道
}

// 好：log + return error
try {
    await db.insert(data);
} catch (err) {
    log.error('插入失败:', err.message);
    return { success: false, error: err.message };
}

// 坏：log 后继续
try {
    await db.insert(data);
} catch (err) {
    log.error('插入失败:', err.message);
    // 然后继续执行... 调用方以为成功了
}
```

**WebSocket / EventEmitter error handler**：
```js
// 坏
ws.on('error', () => {});

// 好
ws.on('error', (err) => {
    log.error('WS 错误:', err.message);
    ws.terminate();
});
```

---

## §8 · 每个容器都要有上限

> 对应形状 #R · 资源无上限

**规则**：`new Map()` / `new Set()` / `WebSocketServer` / `express.json()` 创建时立即考虑上限。

**写代码时问自己**：
- 这个 Map 最多会有多少条目？需要 TTL 吗？需要 LRU 吗？
- 这个 WebSocket 接受多大的消息？
- 这个 HTTP body 最大多少？
- 这个轮询失败后间隔会增加吗？

**常用上限参考**：
```js
// WebSocket
new WebSocketServer({ noServer: true, maxPayload: 1 * 1024 * 1024 })  // 1MB

// HTTP body
app.use(express.json({ limit: '1mb' }))  // 全局 1MB
router.post('/upload', express.json({ limit: '10mb' }), handler)  // 特定路由放宽

// 缓存 Map
const cache = new Map();
const MAX_CACHE = 1000;
function cacheSet(key, value, ttlMs = 300_000) {
    if (cache.size >= MAX_CACHE) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
    }
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// Poller 退避
const backoff = Math.min(30 * 60_000, baseInterval * 2 ** consecutiveFailures);
```

---

## §9 · 安全随机 vs 娱乐随机

> 对应形状 #S · 加密弱随机

**规则**：`Math.random()` 只用于游戏/展示。涉及认证/授权的随机值用 `crypto`。

| 场景 | 用什么 |
|------|--------|
| 验证码 | `crypto.randomInt(100000, 1000000)` |
| Session ID / Token | `crypto.randomUUID()` |
| CSRF Token | `crypto.randomBytes(32).toString('hex')` |
| 抽卡概率 | `Math.random()` ✅ |
| 骰子 / NPC 行为 | `Math.random()` ✅ |
| 排序 shuffle | `Math.random()` ✅ |

**自检命令**：
```bash
grep -rn "Math\.random" server/src/services/dao/ server/src/routes/auth.js server/src/middleware/
# 如果在 auth / dao / middleware 里出现 → 需要评估是否安全场景
```

---

## §10 · 锁键必须与数据对齐

> 对应形状 #T · 锁键不一致

**规则**：操作同一张表/同一个文件的所有函数，锁键必须相同。

**写代码时问自己**：
- 我加的 `withLock('xxx:${userId}')` 保护的是哪张表？
- 还有哪些函数也写这张表？它们用的锁键和我一样吗？
- 如果我用 `equip:${userId}` 而别人用 `inv:${userId}`，两把锁不互斥

**锁键约定（示例）**：
```js
// 在文件顶部用注释声明锁键约定
/**
 * Lock key convention for user_items table:
 *   withLock(`inv:${userId}`, ...) — ALL writes to user_items use this key
 */

// 每个函数的 withLock 都用同一个 key
export async function addItem(userId, itemId, qty) {
    return withLock(`inv:${userId}`, async () => { ... });
}
export async function equipSlot(userId, itemId, slot) {
    return withLock(`inv:${userId}`, async () => { ... });  // 同一个 key！
}
```

**新加锁时**：在函数上方加注释说明锁键属于哪个数据域。

---

## 速查卡片

写完代码后，用 30 秒扫一遍：

```
□ §1  有 await-gap 的写操作加锁了吗？
□ §2  同文件同类问题扫了吗？
□ §3  debug 代码加守卫了吗？
□ §4  多步操作有崩溃回滚吗？
□ §5  全局状态支持多用户吗？
□ §6  路由权限逐条审视了吗？
□ §7  catch 里 throw 了吗？
□ §8  容器有上限吗？
□ §9  安全场景用 crypto 了吗？
□ §10 锁键和其他写者一致吗？
```
