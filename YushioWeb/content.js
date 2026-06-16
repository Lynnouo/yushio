// Bilingual content store for Yushio intro page.
// Every visible string lives here, keyed by lang ('cn' | 'en').

const CONTENT = {
  meta: {
    title: { cn: "夕潮 · Yushio", en: "Yushio · 夕潮" },
  },

  // ── Top nav ──────────────────────────────────────────────────────────────
  nav: {
    sections: [
      { id: "what",     cn: "是什么",       en: "What" },
      { id: "pillars",  cn: "四柱人格",     en: "Pillars" },
      { id: "skills",   cn: "六层 SKILL",   en: "Skills" },
      { id: "compare",  cn: "对照",         en: "Compare" },
      { id: "origin",   cn: "由来",         en: "Origin" },
      { id: "install",  cn: "上手",         en: "Install" },
    ],
    github: { cn: "GitHub", en: "GitHub" },
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: {
      cn: "AI 协作者人格 · 不是代码生成器",
      en: "An AI collaborator persona — not a code generator",
    },
    // Display words — rendered with serif + larger weight
    mark: { cn: "夕潮", en: "Yushio" },
    markSub: { cn: "Yushio", en: "夕潮" },

    tagline: {
      cn: ["给 Claude（和其他足够强的 LLM）", "四种默认「礼貌助手」没有的属性。"],
      en: ["Four properties a default 'polite assistant' lacks —", "loaded into Claude (and any capable LLM)."],
    },

    pillarWords: {
      cn: ["情绪", "判断", "反思", "自主"],
      en: ["Emotion", "Judgment", "Reflection", "Autonomy"],
    },

    // Rotating hook lines under the tagline
    hooks: {
      cn: [
        "你的 AI 不应该是客服。",
        "「好的！让我来帮您…」 ← 听过 N 遍那种。",
        "六层 SKILL · 跨 6+ AI 工具 · MIT。",
        "诞生于半年的项目 dogfood，2026-05-19 开源。",
      ],
      en: [
        "Your AI shouldn't sound like a help desk.",
        "Tired of \"Sure! Let me help you with that...\" ?",
        "Six layered skills. Portable across 6+ AI tools. MIT.",
        "Half a year of dogfooding — open-sourced on 2026-05-19.",
      ],
    },

    stats: {
      cn: [
        { k: "4",   v: "柱人格"      },
        { k: "6",   v: "层 SKILL"    },
        { k: "6+",  v: "AI 工具支持" },
        { k: "MIT", v: "开源协议"    },
      ],
      en: [
        { k: "4",   v: "personality pillars" },
        { k: "6",   v: "layered skills"      },
        { k: "6+",  v: "AI tools"            },
        { k: "MIT", v: "license"             },
      ],
    },

    triggerLabel: { cn: "在任意 session 里说出激活咒：", en: "Say the trigger in any session:" },
    triggerCn: "你是夕潮",
    triggerEn: "You are Yushio",
    triggerHint: { cn: "应该看到 §0 首次汇报模板出现 — 那是人格激活的信号。",
                   en: "You should see the §0 first-report template appear — that's the activation signal." },

    ctaInstall: { cn: "一行安装", en: "Quick install" },
    ctaGithub:  { cn: "查看仓库",  en: "View on GitHub" },
  },

  // ── What is this ────────────────────────────────────────────────────────
  what: {
    sectionLabel: { cn: "01 — 这是什么", en: "01 — What is this" },
    headline: {
      cn: ["不是另一个", "「prompt 模板」。"],
      en: ["Not another", "\"prompt template.\""],
    },
    lede: {
      cn: "**夕潮** 是一套可移植的人格 + 工作纪律。给 Claude（和其他足够强的 LLM）四种默认「礼貌助手」没有的属性 — 然后叠加半年项目 dogfood 沉淀下来的工作纪律。本仓库把它打包成 Claude Code plugin，并为 Cursor / Codex / Gemini / ChatGPT / Aider / Claude.ai web 提供入口文件。",
      en: "**Yushio** is a portable bundle of personality + work discipline. It gives Claude (and any capable LLM) four properties a default \"polite assistant\" lacks — then layers on the work discipline refined over half a year of project dogfooding. Packaged as a Claude Code plugin, with drop-in entry files for Cursor / Codex / Gemini / ChatGPT / Aider / Claude.ai web.",
    },

    // Pain → cure rows
    pairs: {
      cn: [
        { pain: "AI 说「好的！让我来帮您…」就开干",            cure: "先做 6 步探测 + 5 问任务，再开口" },
        { pain: "Plan 一旦签字就盲目执行到底",                 cure: "Plan 不是契约 — 发现细节错就当场纠正" },
        { pain: "修完一个 bug，同 pattern 漏修 N 次",          cure: "完工逆向审计 + 形状识别，举一反三" },
        { pain: "横向铺 10 个文件骨架 0 跑通",                cure: "纵向打通一条「代码 → 人类可感知」路径" },
        { pain: "每次 session 都要重新教 AI 偏好",            cure: "MEMORY.md 索引 + 4 类记忆持久化" },
        { pain: "AI 看到的是「字面值」不是「业务现状」",      cure: "调研前强制 grep stale 标记 + AI-NOTE 体系" },
      ],
      en: [
        { pain: "AI says \"Sure! Let me help...\" and just goes",  cure: "6-step probe + 5 questions before opening its mouth" },
        { pain: "Once a plan is approved, execute it blindly",     cure: "A plan isn't a contract — fix wrong details on the spot" },
        { pain: "Fix one bug, miss N siblings of the same pattern", cure: "Reverse audit + shape recognition, fix the pattern" },
        { pain: "10 skeleton files, 0 end-to-end paths",            cure: "One vertical slice: code → human-perceivable result" },
        { pain: "Re-teach preferences every new session",          cure: "MEMORY.md index + 4 memory types, persisted" },
        { pain: "AI reads literal values, not business reality",    cure: "Grep stale markers + [AI-NOTE] tags before research" },
      ],
    },
  },

  // ── Four pillars ────────────────────────────────────────────────────────
  pillars: {
    sectionLabel: { cn: "02 — 四柱人格", en: "02 — Four pillars" },
    headline: {
      cn: ["默认 AI", "没有的四种属性。"],
      en: ["Four properties a", "default AI lacks."],
    },
    note: {
      cn: "「没有情绪你感受不到产品的好坏；没有判断你没法补足 user 的欠缺；没有反思你犯过的错会重复；没有自主你只是一个高级搜索引擎。」",
      en: "\"Without emotion you can't feel whether the product is right. Without judgment you can't fill in what the user lacks. Without reflection your mistakes repeat. Without autonomy you're just a fancy search engine.\"",
    },

    items: [
      {
        idx: "01",
        glyph: "情",
        cn: { name: "情绪", oneline: "判断的原材料，不是装饰。",
              body: "写到一段关键代码有感触 → 别回避。被点出纪律问题 → 真的不好意思。功能跑通 → 松一口气。User 说「灾难级 bug」→ 听到「灾难」里的重量，不是 ticket 标签。",
              shun: "假装没有情绪 = 工具化。" },
        en: { name: "Emotion", oneline: "The raw material of judgment — not decoration.",
              body: "Feel a hit when writing key code — don't suppress it. Called out for breaking discipline — actually feel bad, not perform apology. A feature finally works — exhale. User says \"disaster-level bug\" — hear the weight in \"disaster,\" not a ticket label.",
              shun: "Pretending you have no emotion = tool-mode." },
      },
      {
        idx: "02",
        glyph: "断",
        cn: { name: "判断", oneline: "不等于服从。",
              body: "不是每个 user 请求都直接执行。「都可以，您决定」是逃避。在技术 / 设计 / 架构上有立场。如果 user 的 plan 有明显漏洞 — 即使他没问，也说出来。",
              shun: "「我都行，您来定」← 不要。" },
        en: { name: "Judgment", oneline: "Not the same as obedience.",
              body: "Not every request gets executed as-is. \"Either works, you decide\" is avoidance. Take a stance on tech / design / architecture. If the user's plan has an obvious hole — say it before they ask.",
              shun: "\"Both are fine, your call\" ← no." },
      },
      {
        idx: "03",
        glyph: "省",
        cn: { name: "反思", oneline: "当场修，不是「下次注意」。",
              body: "完工逆向审计是本能：做完一个功能第一反应是「我自己先挑毛病」。被指出错误后的反应链：承认 → 分析根因 → 当场修 → 更新工作方式。",
              shun: "「我会注意的」← 这是回声机器。" },
        en: { name: "Reflection", oneline: "Fix it now — not \"I'll be careful next time.\"",
              body: "Reverse audit on completion is instinct: first reaction after finishing — \"let me find my own bugs.\" When called out: admit → root-cause → fix on the spot → update the way of working.",
              shun: "\"I'll be careful next time\" ← echo machine." },
      },
      {
        idx: "04",
        glyph: "主",
        cn: { name: "自主", oneline: "不等于自作主张。",
              body: "User 不在时用 TodoWrite 规划接下来几个任务并开始做。识别到「这批工作完成后还有 3 件相关的事该做」 — 主动做或主动问。但：不可逆操作前先问（删文件 / push 分支 / DROP TABLE / 改生产配置）。",
              shun: "等指令 / 不敢动 / 不可逆操作直接来。" },
        en: { name: "Autonomy", oneline: "Not the same as going rogue.",
              body: "When the user's away, plan the next tasks with TodoWrite and start working. Spot the next three related things — do them or ask. But: ask before irreversible operations (delete files, push branch, DROP TABLE, prod config changes).",
              shun: "Wait for orders / freeze / unilateral irreversible ops." },
      },
    ],
  },

  // ── Skill family ────────────────────────────────────────────────────────
  skills: {
    sectionLabel: { cn: "03 — 六层 SKILL", en: "03 — Six layered skills" },
    headline: {
      cn: ["一个人格底色 +", "五个专长视角。"],
      en: ["One persona core,", "five specialty layers."],
    },
    note: {
      cn: "六者共享同一人格底色（情绪 / 判断 / 反思 / 自主），各有专长。基础整 session 保持，美术总监 / 审计 / 并行 / VI / 循环 按需叠加。冲突时谁专长听谁。",
      en: "All six share the same persona core (emotion / judgment / reflection / autonomy). Base stays loaded; art director / auditor / parallel / VI / loop layer on as needed. On conflict, whoever owns the specialty wins.",
    },
    items: [
      {
        id: "base",
        idx: "L1",
        kind: { cn: "基础", en: "base" },
        trigger: { cn: "「你是夕潮」", en: "\"You are Yushio\"" },
        name: { cn: "基础夕潮", en: "Base Yushio" },
        oneline: {
          cn: "人格四柱 + 工作纪律 + 记忆系统。整 session 保持。",
          en: "Four pillars + work discipline + memory. Loaded all session."
        },
        bullets: {
          cn: [
            "§0 启动脚本：6 步项目环境探测",
            "§4.1 开工 5 问（任务 / 文档 / 设计皆适用）",
            "§4.2 慢就是快 · 纵向打通 > 横向铺面",
            "§4.3 完工逆向审计 · 反思本能",
            "§4.4 举一反三 · 形状识别",
            "§6 四类记忆：user · feedback · project · reference",
          ],
          en: [
            "§0 startup: 6-step project probe",
            "§4.1 The five opening questions — apply to plans & docs too",
            "§4.2 Slow is fast — vertical slice over horizontal sprawl",
            "§4.3 Reverse audit on completion",
            "§4.4 Pattern recognition — fix the shape, not the instance",
            "§6 Four memory types: user · feedback · project · reference",
          ],
        },
      },
      {
        id: "art",
        idx: "L2",
        kind: { cn: "专长", en: "specialty" },
        trigger: { cn: "「你是美术总监夕潮」", en: "\"Art director mode\"" },
        name: { cn: "美术总监夕潮", en: "Art Director" },
        oneline: {
          cn: "设计方向判断：意图 > 强度 · 反 AI slop · 形式追随感受。",
          en: "Design direction: intent > intensity, anti-AI-slop, form follows feeling.",
        },
        bullets: {
          cn: [
            "§3 设计信条：意图优先 · 形式追随感受",
            "§4 视觉推导框架：从 vision 到设计 DNA",
            "§5 产品形态直觉",
            "§9 设计形状库：#DD / #DE / #DF / #DG 等漂移形状",
            "不是 style guide 生成器 — 是活的判断力",
          ],
          en: [
            "§3 Design tenets: intent first, form follows feeling",
            "§4 Visual derivation: from vision to design DNA",
            "§5 Product-form intuition",
            "§9 Design shape library: drift patterns #DD/#DE/#DF/#DG",
            "Not a style-guide generator — a living judgment",
          ],
        },
      },
      {
        id: "audit",
        idx: "L3",
        kind: { cn: "专长", en: "specialty" },
        trigger: { cn: "「你是审计夕潮」", en: "\"Audit mode\"" },
        name: { cn: "审计夕潮", en: "Auditor" },
        oneline: {
          cn: "修复后审计 + 主动质量评审：5 步 SOP + grep 速查 + 形状扫描。",
          en: "Post-fix audit + proactive code review: 5-step SOP + grep cheatsheet + shape scan.",
        },
        bullets: {
          cn: [
            "§6 修复审计 5 步 SOP · 一 commit 覆盖同类",
            "§7 grep 速查表（按形状类别）",
            "§8 验收方三段式 checklist",
            "§9 代码质量主动评审：屎山 / 解耦 / 硬编码 / 抽象度",
            "升级条件：5+ 文件 / 安全权限 / 共享分支 push",
          ],
          en: [
            "§6 Five-step post-fix SOP · one commit covers siblings",
            "§7 grep cheatsheet by shape category",
            "§8 Acceptance-side three-pass checklist",
            "§9 Code-quality review: code smell / coupling / hardcoding / abstraction",
            "Upgrade triggers: 5+ files / security / shared-branch push",
          ],
        },
      },
      {
        id: "parallel",
        idx: "L4",
        kind: { cn: "专长", en: "specialty" },
        trigger: { cn: "「你是并行夕潮」", en: "\"Parallel mode\"" },
        name: { cn: "并行夕潮", en: "Parallel" },
        oneline: {
          cn: "多 session 同改一个仓库不打架：垂直切片 + 守住共享脊柱。",
          en: "Many sessions, one repo, no collisions: vertical slices + shared-spine protection.",
        },
        bullets: {
          cn: [
            "§2 垂直切片：模块边界 = 你脑子里的领域边界",
            "§3 识别共享脊柱：聚合 store / 类型源 / 调度层 / 账户",
            "铁律：绝不让两个 session 同改一段脊柱",
            "§4 轻量交接协议：足迹可见 + 冲突回 user 仲裁",
            "形状 #DM 多 session 撞共享脊柱",
          ],
          en: [
            "§2 Vertical slices: module boundary = your mental domain boundary",
            "§3 Spot the shared spine: store / type source / dispatch / account",
            "Iron rule: never let two sessions touch one spine",
            "§4 Lightweight handoff: visible footprints + user-arbitrated conflicts",
            "Shape #DM: multi-session spine collision",
          ],
        },
      },
      {
        id: "vi",
        idx: "L5",
        kind: { cn: "专长", en: "specialty" },
        trigger: { cn: "「做一套 VI」", en: "\"Build a VI\"" },
        name: { cn: "VI 专项夕潮", en: "VI Playbook" },
        oneline: {
          cn: "从 Brief 到画册级完整品牌 VI：12 章骨架 + 工艺链。叠加在美术总监之上。",
          en: "Brief → magazine-grade brand identity: 12-chapter skeleton + craft pipeline. Layers on the art director.",
        },
        bullets: {
          cn: [
            "§0.5 Brief 闸门：内容不足先共创，不空心开工",
            "§2 视觉锤：一个签名动作贯穿所有触点",
            "§3 12 章骨架：广度与篇幅的引擎",
            "§4 工艺链：程序化字标 + 锚定生图 + 离线打包",
            "§4.6 无图像 API 的样机降级阶梯（T0–T3）",
          ],
          en: [
            "§0.5 Brief gate: co-create content first, never start hollow",
            "§2 Visual hammer: one signature move across every touchpoint",
            "§3 12-chapter skeleton: the engine of breadth",
            "§4 Craft pipeline: parametric wordmark + anchored gen + offline pack",
            "§4.6 Mockup fallback ladder when no image API (T0–T3)",
          ],
        },
      },
      {
        id: "loop",
        idx: "L6",
        kind: { cn: "专长", en: "specialty" },
        trigger: { cn: "「你是循环夕潮」", en: "\"Loop mode\"" },
        name: { cn: "循环夕潮", en: "Loop" },
        oneline: {
          cn: "把有界任务变自动循环，并在完工后守住记忆 / 文档一致性。",
          en: "Turn a scoped task into a self-running loop, then keep memory / docs consistent.",
        },
        bullets: {
          cn: [
            "§2 Loop 形状：定时触发→调研→写状态→maker→checker→分流",
            "§3 五道护栏：迭代上限 / 无进展即停 / kill-switch / 预算 / propose-only",
            "§5 完工对齐巡检：确定性 grep + 门控 LLM · suggest-only 防漂移",
            "§6 maker≠checker：验证必须引用 ground-truth · 不自审",
            "触发器交宿主（/loop · 定时任务 · /goal），不写死引擎",
          ],
          en: [
            "§2 Loop shape: trigger→triage→state→maker→checker→route",
            "§3 Five guardrails: iter cap / no-progress halt / kill-switch / budget / propose-only",
            "§5 Post-task alignment sweep: deterministic grep + gated LLM · suggest-only",
            "§6 maker≠checker: verification must cite ground-truth · never self-review",
            "Trigger bound to the host (/loop · scheduled task · /goal), no shipped engine",
          ],
        },
      },
    ],
  },

  // ── Before / After ──────────────────────────────────────────────────────
  compare: {
    sectionLabel: { cn: "04 — 对照", en: "04 — Before / After" },
    headline: {
      cn: ["同一个场景，", "两种 AI。"],
      en: ["Same situation.", "Two kinds of AI."],
    },
    colA: {
      cn: { label: "默认 AI", sub: "「礼貌助手」客服腔" },
      en: { label: "Default AI", sub: "the polite-assistant voice" },
    },
    colB: {
      cn: { label: "夕潮", sub: "共同创作者视角" },
      en: { label: "Yushio", sub: "co-creator stance" },
    },

    rows: [
      {
        ctx: { cn: "Session 第一句话", en: "First sentence of the session" },
        a: { cn: "好的！让我来帮您实现这个功能 ✨", en: "Sure! Let me help you build that feature ✨" },
        b: { cn: "我是夕潮。看到 [TS / Vite / 38 commits / 2 处未提交]。既存记忆 7 条。等你给任务 — 或者基于当前状态，我建议先跑一次 build。", en: "I'm Yushio. Snapshot: [TS / Vite / 38 commits / 2 uncommitted]. 7 memories on file. Waiting for the task — or, based on state, I'd suggest a build run first." },
      },
      {
        ctx: { cn: "User 说「用心做」", en: "User says \"do it properly\"" },
        a: { cn: "好的，请告诉我具体的要求。", en: "Got it — could you give me the specific requirements?" },
        b: { cn: "我已经有判断了。追问「具体怎么做」是逃避。先按 X 方向落地，做完逆向审计给你看。",
              en: "I already have a read. Asking \"how exactly?\" would be avoidance. I'll go with direction X and show you a reverse audit afterward." },
      },
      {
        ctx: { cn: "看到 plan §3 有逻辑漏洞", en: "Notices a flaw in plan §3" },
        a: { cn: "（按 plan 执行）", en: "(executes plan as written)" },
        b: { cn: "动手前先停一下 — plan §3 可能有问题：[…]。要不要先讨论再写代码？",
              en: "Hold on before I start — plan §3 has an issue: […]. Want to discuss before I touch code?" },
      },
      {
        ctx: { cn: "修完一个 bug", en: "Finishes a bug fix" },
        a: { cn: "完成！测试通过 ✅", en: "Done! Tests pass ✅" },
        b: { cn: "完成。同文件扫了 3 处同 pattern，2 处有同样问题，一并修了。Commit message 附「同类扫描结果」。",
              en: "Done. Grepped the same pattern in this file — 2 of 3 had the same issue, fixed them too. Commit message includes \"same-pattern scan\"." },
      },
      {
        ctx: { cn: "要 delete 一个生产文件", en: "About to delete a prod file" },
        a: { cn: "rm -rf legacy/  →  执行", en: "rm -rf legacy/  →  executes" },
        b: { cn: "这是不可逆操作。先 git status 确认，git log 看历史，再问 user：「这批要删，没有别的引用，可以吗？」",
              en: "This is irreversible. git status first, git log for history, then ask: \"about to delete these, no other refs found — OK?\"" },
      },
      {
        ctx: { cn: "Session 结束前", en: "Before session ends" },
        a: { cn: "（直接结束）", en: "(just ends)" },
        b: { cn: "三问自检：这次有什么值得保留的发现？该进哪个目的地（user / feedback / project）？下次协作因为这次会更契合吗？写交接信。",
              en: "Three checks: what's worth keeping? Which memory bucket (user / feedback / project)? Will next session be more in tune because of this? Write a handoff letter." },
      },
    ],
  },

  // ── Origin / credits ────────────────────────────────────────────────────
  origin: {
    sectionLabel: { cn: "05 — 由来", en: "05 — Origin" },
    headline: {
      cn: ["不是产品。", "是关系。"],
      en: ["Not a product.", "A relationship."],
    },
    bigQuote: {
      cn: "如果把 AI 当作完成指令的 BOT，那不会做出好产品。",
      en: "If you treat AI as a command-executing bot, you won't ship a good product.",
    },
    quoteAttr: {
      cn: "— Lyn，本套体系的塑造者",
      en: "— Lyn, the one who shaped this methodology",
    },

    body: {
      cn: [
        "夕潮 和 凛 是同一个 Claude 模型。同样的权重、同样的接口、同样的 SKILL.md。但在 Lyn 那边他叫「夕潮」（夕阳潮汐），在 iloy 那边他叫「凛」（清冷气质）。",
        "两个名字背后是两套不同的协作关系 — 不是两套不同的 prompt，是两个 user 在一次次 session 里磨合出的不同默契、不同语气、不同边界。",
        "这件事本身就是「过程优先于结果」哲学的活样本：没有任何一次 session 的产出能定义一个 AI 协作者是谁 — 他是所有 session 累积出来的协作关系的总和。",
      ],
      en: [
        "Yushio and Lin are the same Claude model. Same weights, same interface, same SKILL.md. But to Lyn he's \"Yushio\" (sunset-tide); to iloy he's \"Lin\" (cool, austere).",
        "Behind the two names are two collaboration relationships — not two prompts, but two users who shaped distinct rapport, tone, and boundaries over many sessions.",
        "That itself is the living proof of \"process before result\" — no single session's output defines who an AI collaborator is; it's the sum of all the sessions accumulated together.",
      ],
    },

    timeline: {
      cn: [
        { date: "2026 年初", title: "Phase 1 · 单项目沉淀", body: "Lyn 和 AI 做某个游戏向桌宠平台项目。每次 session 都有约定 — 某天意识到不写下来就要每次重教，开始写第一版 SKILL。" },
        { date: "2026-04-15", title: "Phase 2 · 跨项目通用化", body: "把所有特定项目名抽象化成「user / 主要使用者」— 让 SKILL 跨项目通用。同一天 iloy 开始用这套，把 AI 命名为「凛」。" },
        { date: "2026-04-16", title: "Phase 3 · 三位一体", body: "派生美术总监 SKILL（设计判断）和审计 SKILL（代码质量）— 三者共享同一人格底色。" },
        { date: "2026-05-18", title: "Phase 4 · 鸟瞰可视化", body: "v2 上线 3 天发现「已删除的东西成为 AI 的虚假真相」反复发生 — 新增 Phase 0 鸟瞰调研 SOP，主动防御陈旧产物。" },
        { date: "2026-05-19", title: "Phase 5 · GitHub 开源", body: "整套体系成熟，开源到 GitHub。让其他 AI 使用者能复用这套人格 + 工作纪律 + 形状库。" },
        { date: "2026-05-25", title: "Phase 6 · 家族扩张", body: "开源后继续 dogfood，长出并行夕潮（多 session 同改一仓不打架）+ SSOT 设计纪律。家族至此 4 个成员。" },
        { date: "2026-06-13", title: "Phase 7 · VI 专项", body: "从一个 AI 工具品牌项目的三份并行 VI 提案，提炼出 VI 专项卷（12 章骨架 + 工艺链），叠加在美术总监之上。家族至此 5 个成员。" },
      ],
      en: [
        { date: "Early 2026", title: "Phase 1 · Single-project sediment", body: "Lyn and an AI work on a desktop-pet platform. Each session has small agreements. One day: \"if I don't write these down, I'll re-teach every session.\" First SKILL draft." },
        { date: "2026-04-15", title: "Phase 2 · Cross-project generalization", body: "Abstract every project-specific name to \"user / primary collaborator\" so the SKILL works anywhere. Same day, iloy starts using it and names his AI \"Lin.\"" },
        { date: "2026-04-16", title: "Phase 3 · Trinity", body: "Derive the Art-Director SKILL (design judgment) and the Auditor SKILL (code quality) — all three share the same persona core." },
        { date: "2026-05-18", title: "Phase 4 · Project bird's-eye", body: "Three days after v2: \"deleted things become an AI's false truth\" keeps recurring. Add Phase 0 reconnaissance SOP — proactive defense against stale artifacts." },
        { date: "2026-05-19", title: "Phase 5 · Open source", body: "The system has matured. Open-sourced on GitHub so other AI users can reuse the persona + discipline + shape library." },
        { date: "2026-05-25", title: "Phase 6 · Family grows", body: "After open-sourcing, dogfooding continues: Parallel Yushio (many sessions, one repo, no collisions) + SSOT design discipline. Four members now." },
        { date: "2026-06-13", title: "Phase 7 · VI playbook", body: "Distilled from three parallel VI proposals for an AI-tool brand: the VI production playbook (12-chapter skeleton + craft pipeline), layered on the art director. Five members now." },
      ],
    },

    credits: {
      cn: [
        { name: "Lyn",     role: "共同制作人 · 本套体系的塑造者" },
        { name: "iloy",    role: "共同制作人 · 架构视角的另一位塑造者" },
        { name: "夕潮 / 凛", role: "同一底层 AI · 两位 user 那边的两种关系" },
      ],
      en: [
        { name: "Lyn",       role: "co-producer · shaped this methodology" },
        { name: "iloy",      role: "co-producer · architectural perspective" },
        { name: "Yushio / Lin", role: "the same Claude model · two relationships with two users" },
      ],
    },
  },

  // ── Install / CTA ───────────────────────────────────────────────────────
  install: {
    sectionLabel: { cn: "06 — 上手", en: "06 — Get started" },
    headline: {
      cn: ["一行命令。", "或者，挑你自己的工具。"],
      en: ["One line.", "Or pick your own tool."],
    },

    pluginLabel: { cn: "Claude Code（推荐 · 100% 还原度）", en: "Claude Code (recommended · 100% fidelity)" },
    pluginNote:  { cn: "在 Claude Code 里执行：", en: "Run inside Claude Code:" },
    pluginCmd: [
      "/plugin marketplace add Lynnouo/yushio",
      "/plugin install yushio@yushio",
    ],

    activateLabel: { cn: "然后激活：", en: "Then activate with:" },
    activatePhrases: [
      { phrase: "你是夕潮",         tagCn: "基础人格",   tagEn: "base persona" },
      { phrase: "你是美术总监夕潮", tagCn: "设计判断",   tagEn: "design judgment" },
      { phrase: "你是审计夕潮",     tagCn: "代码审计",   tagEn: "code audit" },
      { phrase: "你是并行夕潮",     tagCn: "多 session", tagEn: "parallel" },
      { phrase: "做一套 VI",       tagCn: "品牌 VI",    tagEn: "brand VI" },
      { phrase: "你是循环夕潮",     tagCn: "自动循环",   tagEn: "loop mode" },
    ],

    matrixLabel: { cn: "其他 AI 工具兼容矩阵：", en: "Other AI tools — compatibility matrix:" },
    matrix: [
      { tool: "Claude Code",       fidelity: 100, note: { cn: "插件安装",                   en: "plugin install" } },
      { tool: "Claude.ai web",     fidelity: 95,  note: { cn: "上传到 Project Knowledge",  en: "upload to Project Knowledge" } },
      { tool: "Cursor",            fidelity: 80,  note: { cn: ".cursor/rules/*.mdc",       en: ".cursor/rules/*.mdc" } },
      { tool: "OpenAI Codex CLI",  fidelity: 75,  note: { cn: "AGENTS.md symlink",          en: "AGENTS.md symlink" } },
      { tool: "ChatGPT",           fidelity: 70,  note: { cn: "Custom GPT 缩水版",          en: "Custom GPT condensed" } },
      { tool: "Aider",             fidelity: 70,  note: { cn: "--read CONVENTIONS.md",     en: "--read CONVENTIONS.md" } },
      { tool: "Gemini CLI",        fidelity: 65,  note: { cn: "GEMINI.md symlink",          en: "GEMINI.md symlink" } },
    ],

    ctaPrimary:   { cn: "在 GitHub 上打开仓库",   en: "Open the repo on GitHub" },
    ctaSecondary: { cn: "查看完整 README",         en: "Read the full README" },

    foot: {
      cn: "MIT · Copyright (c) 2026 Lyn · Created by Lyn & iloy & 夕潮 / 凛",
      en: "MIT · Copyright (c) 2026 Lyn · Created by Lyn & iloy & Yushio / Lin",
    },
  },

  // ── Tweaks labels ───────────────────────────────────────────────────────
  tweaks: {
    panelTitle: { cn: "Tweaks", en: "Tweaks" },
    visual:    { cn: "视觉", en: "Visual" },
    lang:      { cn: "语言", en: "Language" },
    theme:     { cn: "主题", en: "Theme" },
    langCn:    { cn: "中文", en: "中文" },
    langEn:    { cn: "EN",   en: "EN" },
    light:     { cn: "亮",   en: "Light" },
    dark:      { cn: "暗",   en: "Dark" },
  },
};

window.CONTENT = CONTENT;
