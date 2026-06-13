# VI 生产管线 · 可复用脚本骨架

> 这是《VI 专项》SKILL 的伴随参考文件，不是独立 skill（无 frontmatter）。
> 存放 §4 工艺链的**可复用脚本骨架**——从实际 VI 提案的生产脚本泛化而来。
> 用法：新 VI 项目照这四个骨架改参数，别从零写。每个骨架附"为什么这样 + 踩过的坑"。
> 被 SKILL §4 各节引用。

---

## 0 · 环境与渲染工具（先确认）

```bash
# SVG → PNG 渲染：优先级 rsvg-convert > cairosvg > headless Chrome
which rsvg-convert cairosvg
ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # mac 兜底

# headless Chrome 截图（最通用，任何 mac 都有）：
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --screenshot=out.png \
  --window-size=1480,1060 --hide-scrollbars --virtual-time-budget=10000 \
  "file:///path/to/preview.html"

# 字体工具
python3 -c "import fontTools; print(fontTools.version)"   # 字标手术依赖
pip3 install pypdfium2 pillow                              # PDF 渲染 / 图像处理
```

**坑**：headless `--screenshot` **忽略滚动位置**——想截长页某一段，要么把整页超高 window-size 截完再 PIL 切片，要么在 HTML 里用 `?goto=<id>` 让 body `transform: translateY()` 平移到目标段。

---

## 1 · 参数化 logo 生成（SSOT · §4.1）

核心思想：**几何参数化**。所有尺寸/圆角/间距是顶部常量，改一处全系列同步。一套坐标渲染出主标/反白/单色/图标全部版本。

```python
#!/usr/bin/env python3
"""<品牌> logo 资产生成器 · 参数化 SSOT
改一个常量 → 全系列版本同步重生。"""
import os
OUT = "brand/assets/logo"; os.makedirs(OUT, exist_ok=True)

# ── 调色板（SSOT：与 globals.css / 其他脚本共用同一组 hex）──
INK_B, INK_W, ACCENT = "#0A0A0C", "#F2F2EF", "#FF2D2D"

# ── 几何参数（改这里，全系列同步）──
S, CW, GAP, H = 44, 240, 40, 240        # 笔画粗 / 字宽 / 字距 / 字高
OVER = 64                                # 视觉锤：溢出深度
RX_O = 88                                # 圆角

def rrect(x, y, w, h, r):               # 圆角矩形 path 工具
    return (f"M{x+r},{y} h{w-2*r} a{r},{r} 0 0 1 {r},{r} v{h-2*r} "
            f"a{r},{r} 0 0 1 -{r},{r} h{-(w-2*r)} a{r},{r} 0 0 1 -{r},-{r} "
            f"v{-(h-2*r)} a{r},{r} 0 0 1 {r},-{r} z")

def lettermark(ink, accent):
    # ... 用参数拼出字母 path，视觉锤（溢出段）单独上 accent 色 ...
    return "<g>...</g>"

def svg(name, vb, body):
    open(f"{OUT}/{name}.svg","w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none">{body}</svg>')

# 一套函数，渲染全部版本：
svg("logo-primary",    VB, lettermark(INK_W, ACCENT))   # 深底主标
svg("logo-inverse",    VB, lettermark(INK_B, ACCENT))   # 浅底反白
svg("logo-mono-white", VB, lettermark(INK_W, INK_W))    # 单色（刺绣/钢印）
svg("logo-mono-black", VB, lettermark(INK_B, INK_B))
# + 副版本（冒烟/glitch）+ 极简图标 + 动态变体（如"爆表态"瞳变红）
```

**要点**：
- viewBox 要让**视觉锤的溢出段突破字面框**（如：字宽 800，viewBox 给 820，溢出段冲出 20）——"规范本身被设计突破"是叙事亮点。
- 防 AA 细缝：相邻填充块让其中一个多探 2-4px 重叠，避免渲染出 1px 白缝。
- glitch 版 = RGB 通道分离（红绿描边错位），是唯一允许绿色大面积出现的版本（技术语义自洽）。

---

## 2 · 中文字标 = 真字体轮廓 + 品牌手术（§4.2）

核心思想：用 `fontTools` 提取**真实字形矢量**作骨架，在轮廓上做品牌手术。**永不 AI 生成中文。**

```python
#!/usr/bin/env python3
"""中文字标生成 · 真字体轮廓 + 品牌手术
工艺：<专业开源字体> 真实字形为骨架 + 视觉锤植入。"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.recordingPen import RecordingPen

FONT = "brand/assets/fonts/<专业字体>.ttf"
font = TTFont(FONT); upm = font["head"].unitsPerEm
cmap = font.getBestCmap(); gs = font.getGlyphSet(); hmtx = font["hmtx"]

def glyph_path(ch):                      # 提取单字矢量 path
    pen = SVGPathPen(gs); gs[cmap[ord(ch)]].draw(pen)
    return pen.getCommands(), hmtx[cmap[ord(ch)]][0]

def contours_of(ch):                     # 提取轮廓顶点（找手术位置用）
    pen = RecordingPen(); gs[cmap[ord(ch)]].draw(pen)
    cs, cur = [], []
    for op, args in pen.value:
        cur += [p for p in args if isinstance(p, tuple)]
        if op == "closePath": cs.append(cur); cur = []
    return cs

# 1) 按 advance 排列各字，scale(1,-1) 翻转（字体 y 向上，SVG y 向下）
# 2) 分析目标字轮廓，找视觉锤的植入点：
#    例：含"口"字旁的字，口字旁内腔 = contour[2] 的窄长平行四边形 → 当"容器"
#    在容器内画 62% 填充块（视觉锤"满"）；末位字母底部画溢出脚（视觉锤"溢出"）
# 3) 输出 primary/inverse/mono + 中英组合锁定版
```

**坑与要点**：
- 字体 y 轴向上，SVG y 轴向下 → 整体 `transform="scale(1,-1)"`。
- 找手术点用 `RecordingPen` 拿顶点坐标，肉眼对照渲染图确认是哪个 contour（实测某字的口字旁是 contour[2]，靠顶点定位）。
- 字体 italicAngle（斜体角）要读出来，手术件（填充块/溢出脚）跟着斜，否则不贴合。
- **子集化压体积**：`pyftsubset font.ttf --text="只用到的字" --output-file=sub.woff2`，594KB→70KB。
- 小尺寸（<64px 高）用**无手术版**，细节让位识别。

---

## 3 · 锚定生图样机（§4.3）

核心思想：先渲染矢量资产为 PNG 锚图，生图时带锚图 + 保真指令，逐张 QC。

```python
#!/usr/bin/env python3
"""样机批量生成 · gemini-3-pro-image + 锚定参考图
跑法: python3 gen_mockups.py            # 全部（已存在>60KB SKIP 续传）
      python3 gen_mockups.py cap-black  # 指定重生"""
import json, urllib.request, urllib.error, base64, time, os, sys
KEY = os.environ["GEMINI_API_KEY"]      # 从环境变量读，别硬编码密钥路径
MODEL = "gemini-3-pro-image"
BASE = "https://generativelanguage.googleapis.com/v1beta"

def b64(p): return base64.b64encode(open(p,"rb").read()).decode()
# 先把矢量 logo/吉祥物渲染成干净 PNG 锚图（深底/浅底各一套）
ANCHORS = {k: b64(f"brand/assets/anchor/{k}.png") for k in ["lockup-dark","mascot-dark","icon-dark"]}

# ── 保真指令（关键！否则 AI 重新设计你的 logo）──
FIDELITY = (
 "The reference image shows the OFFICIAL brand artwork of <品牌>. "
 "Artwork anatomy: <逐部件描述 logo 解剖结构>. "
 "REPRODUCE THIS EXACT ARTWORK WITH PERFECT FIDELITY — identical letterforms, "
 "identical geometry. Do NOT redesign, restyle, re-letter, translate, or add elements. ")
TAIL = (" Premium high-end commercial photography. Strict brand palette: <hex 清单>. "
 "No watermarks, no extra invented text, no other brand logos. Clean, expensive-looking, never garish.")

JOBS = {  # name: (锚图keys, 画幅, prompt)
 "storefront-night": (["lockup-dark"], "16:9", FIDELITY + "Scene: <场景描述>"),
 # ... 15-18 张覆盖五类触点 ...
}

def call(prompt, anchor_keys, aspect):
    parts = [{"inline_data":{"mime_type":"image/png","data":ANCHORS[k]}} for k in anchor_keys]
    parts.append({"text": prompt + TAIL})
    body = {"contents":[{"parts":parts}],
            "generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":aspect}}}
    req = urllib.request.Request(f"{BASE}/models/{MODEL}:generateContent?key={KEY}",
            data=json.dumps(body).encode(), headers={"Content-Type":"application/json"})
    data = json.loads(urllib.request.urlopen(req, timeout=300).read())
    for part in data["candidates"][0]["content"]["parts"]:
        if "inlineData" in part: return base64.b64decode(part["inlineData"]["data"])

def main():
    only = set(sys.argv[1:])
    for name,(anchors,aspect,prompt) in JOBS.items():
        out = f"brand/assets/mockups/{name}.png"
        if only and name not in only: continue
        if not only and os.path.exists(out) and os.path.getsize(out)>60_000: continue  # SKIP 续传
        for attempt in (1,2):
            try:
                open(out,"wb").write(call(prompt, anchors, aspect))
                print(f"OK {name}"); break
            except urllib.error.HTTPError as e:
                msg = e.read().decode()[:200]; print(f"HTTP{e.code} {name}: {msg}")
                if e.code==429 and "depleted" in msg: print("额度耗尽,停"); return  # 别瞎重试
                time.sleep(30 if e.code==429 else 8)
        time.sleep(5)   # 串行限速
```

**坑与要点**：
- **保真指令是命脉**：不写 "do NOT redesign" → AI 把你的 logo 重画成山寨版。要**逐部件描述 logo 解剖**喂给它。
- **吉祥物最易漂移**：眼睛变色、烟断开。漂了改 prompt 写死特征（"thick BLACK ring eyes with solid BLACK pupils, never red, never hollow"）单张重生。
- **429 判别**：响应体含 `prepayment credits are depleted` = 项目级额度归零，换模型无用，**立即停**别重试。读 message 判断，别当限流。
- **角色代号入画风险**：prompt 里把品牌名当角色代号有被印进画面的风险，高风险样机（工牌/招牌）优先改称 "the mascot"。
- 豆包 ARK 作补充：endpoint `ark.cn-beijing.volces.com/api/v3/images/generations`，model `doubao-seedream-4-0-*`，Bearer 鉴权。新 key 常报 ModelNotOpen 需 console 逐模型 activate。

---

## 4 · 单文件离线打包（§4.5）

核心思想：base64 内联所有资产 + 渐进增强（无 JS 也完整）+ JPEG 压体积。

```python
#!/usr/bin/env python3
"""打包 brand/index.html → 自包含单文件（全资产 base64 内嵌）"""
import base64, re, os, mimetypes, io
mimetypes.add_type("font/woff2",".woff2"); mimetypes.add_type("image/svg+xml",".svg")
ROOT="brand"; html = open(f"{ROOT}/index.html",encoding="utf-8").read(); cache={}

def data_uri(rel):
    if rel in cache: return cache[rel]
    raw = open(os.path.join(ROOT,rel),"rb").read()
    mime = mimetypes.guess_type(rel)[0] or "application/octet-stream"
    if "mockups/" in rel and rel.endswith(".png"):       # 样机 PNG→JPEG q87，体积减半
        from PIL import Image
        buf = io.BytesIO(); Image.open(io.BytesIO(raw)).convert("RGB").save(buf,"JPEG",quality=87,optimize=True)
        raw, mime = buf.getvalue(), "image/jpeg"
    cache[rel] = f"data:{mime};base64,{base64.b64encode(raw).decode()}"
    return cache[rel]

html = re.sub(r"url\('(assets/[^']+)'\)", lambda m:f"url('{data_uri(m.group(1))}')", html)
html = re.sub(r'src="(assets/[^"]+)"',     lambda m:f'src="{data_uri(m.group(1))}"', html)
open("提案+[名字].html","w",encoding="utf-8").write(html)
```

**渐进增强（HTML 侧，关键）**：
```html
<head>
<style>
  /* 默认全可见；仅 js-anim 时才隐藏并由 IO 点亮 —— 无 JS/解析慢不黑屏 */
  html.js-anim .rv { opacity:0; transform:translateY(26px); transition:opacity .7s var(--ease); }
  html.js-anim .rv.on { opacity:1; transform:none; }
</style>
<script>try{document.documentElement.classList.add('js-anim');}catch(e){}</script>
</head>
<script>
/* 三重保险丝 */
(function(){
  const all=()=>document.querySelectorAll('.rv').forEach(el=>el.classList.add('on'));
  try {
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}}),{threshold:.12});
    document.querySelectorAll('.rv').forEach(el=>io.observe(el));
    setTimeout(all, 3000);   // 兜底：3 秒无条件全亮
  } catch(e){ all(); }       // IO 不可用：直接全亮
})();
</script>
```

**坑与验收**：
- **纯 IO 点亮 = 单点故障**：`.rv{opacity:0}` 默认隐藏、全靠 JS 点亮——大文件解析慢一拍就**整页黑屏**。必须渐进增强（默认可见，JS 才隐藏）。
- **style 块内永远不要出现 `</st`+`yle>` 字样**（哪怕注释里）——直接终结样式块导致全页白屏。
- **验收三连**：拷到隔离目录（脱离 assets/）+ `--disable-javascript` + file:// 整页截图 → 证明断网双击 + 禁 JS 都完整。只验首屏不够。
- 外链自查：`grep -c 'https\?://' 单文件.html` 应只剩 SVG 的 xmlns 命名空间声明（不发请求）。

---

## 5 · 海报 = 图归图 + 字归字（§4.4）

**永不让 AI 生成带字海报**（错字/糊字/一眼 AI）。两层分离，小红书竖版 1242×1656。

### 字体先到位（两模式都要）
```bash
# 下载免费可商用字体（优先 VI §06 定的；海报需展示字时另选合适开源商用字）
mkdir -p fonts
# 例：展示标题字 + JetBrains Mono(英/数) + 思源黑体(正文) —— 全 OFL/可商用
curl -L -o fonts/title.woff2  "<开源字体 woff2 url>"
# 海报字号大，可不子集化；正文密集可 pyftsubset 压体积
```

### 模式 A · 纯矢量海报（无 AI · 终端风）
```html
<style>
  @font-face{font-family:'T';src:url('fonts/title.woff2')}
  body{width:1242px;height:1656px;background:var(--ink);color:var(--paper);position:relative;overflow:hidden}
  /* 背景也是代码：网格/扫描线/色块 + 大字 + 视觉锤进度条 + lockup，全绝对定位 */
</style>
```

### 模式 B · AI 留白底图 + 手排文字（有 API · 小红书风 ← 推荐）
```python
# 第1步：生成"预留文字位"的底图——prompt 明确要负空间
PROMPT = ("<品牌氛围/吉祥物/场景描述>. IMPORTANT: leave the UPPER THIRD as clean "
          "empty negative space for a headline — no objects, no text there. "
          "Strong composition with deliberate empty area for typography. "
          "No text anywhere in the image, no letters, no watermark.")
# 走 §3 同款 call()（带锚图保吉祥物真实），存 poster-bg.png
```
```html
<!-- 第2步：底图当背景，文字矢量层绝对定位排在留白处 -->
<style>
  @font-face{font-family:'T';src:url('fonts/title.woff2')}
  body{width:1242px;height:1656px;position:relative;margin:0}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .title{position:absolute;top:120px;left:80px;font-family:'T';font-size:130px;color:#fff}
</style>
<img class="bg" src="poster-bg.png">
<div class="title">第一次<br>跑通 AI</div>  <!-- 排在底图留白的上三分之一 -->
```
```bash
# 渲染（设备像素比锁 1，避免 2x 模糊）
"$CHROME" --headless --disable-gpu --screenshot=poster.png \
  --window-size=1242,1656 --hide-scrollbars "file://.../poster.html"
```

**要点**：
- **预留位置是模式 B 的命门**：prompt 不写"leave empty space"，AI 会把画面填满，文字没处放只能压在杂乱处。要主动指挥负空间。
- **文字层永远矢量手排**，AI 永不碰文字（连英文也不让 AI 写，一样糊）。
- 渲染后逐张放大查中文：手排区天然零错字，但要**确认字体加载成功**（没 fallback 成系统字——@font-face 路径错时静默回退，肉眼核对字形）。

---

## 6 · 无 API 兜底 · 纯 SVG 扁平矢量样机（§4.6 T2）

最小环境（只有浏览器 + 模型）也能做完整样机章。思路：**自己画产品轮廓 + 贴真矢量 logo**，扁平插画风（Stripe/Linear brand book 同款），保真满分。

```html
<!-- mockup-tote.html · 一个 HTML 排多个产品，headless 截图即得样机墙 -->
<style>
  :root{--ink:#0A0A0C;--paper:#F2F2EF;--accent:#FF2D2D}
  body{margin:0;background:var(--paper);display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px}
  .scene{aspect-ratio:4/3;border-radius:14px;display:grid;place-items:center;overflow:hidden;position:relative}
  .scene.dark{background:var(--ink)} .scene.light{background:#e7e7e2}
  /* 产品 = SVG 画的轮廓；logo = <img> 引真矢量资产，绝对定位贴上 */
</style>
<!-- 帆布袋：梯形袋身 + 提手弧线（纯 SVG path），中央贴真 logo -->
<div class="scene light">
  <svg viewBox="0 0 400 440" width="58%">
    <path d="M70,140 H330 L310,420 H90 Z" fill="#d8d4c8" stroke="#0A0A0C" stroke-width="3"/>
    <path d="M150,140 q0,-70 50,-70 q50,0 50,70" fill="none" stroke="#0A0A0C" stroke-width="10"/>
  </svg>
  <img src="assets/logo/logo-inverse.svg" style="position:absolute;width:26%;top:46%;left:37%">
</div>
<!-- 卫衣/名片/手机/招牌/键帽/杯：同法，每个 = 一段 SVG 轮廓 + 一张真 logo -->
```

**要点**：
- **logo 永远 `<img src>` 引真矢量资产**，不在样机里重画——这就是"保真满分"的来源（比 AI 生图更可靠，AI 会重绘成山寨）。
- 产品轮廓用**简笔 SVG path**（梯形袋/圆角衣身/方招牌/胶囊键帽），扁平但有设计：给轮廓加 1 道暗部、1 道高光线，就不廉价。
- 深底场景配反白 logo，浅底配深色 logo（复用 §1 已生成的版本）。
- 一个 HTML 网格排 6-8 个产品，一次 headless 截图就是半面样机墙；或每个单独截图进 lightbox。
- **T1 进阶（有 PIL/ImageMagick）**：真实产品照模板 + 位移贴图把 logo 包裹上布料褶皱——
  `magick tshirt.jpg logo.png -compose over -displace 20 mockup.png`（displacement map 让 logo 随褶皱变形），接近照片级。

---

> 脚本骨架从实际 VI 提案的生产管线泛化而来 · §6 无 API 兜底样机为补充档位。
