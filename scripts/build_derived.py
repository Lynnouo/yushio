#!/usr/bin/env python3
"""
build_derived.py — 从 skills/（单一真源）生成所有派生单文件部署。

产出（原地覆盖）：
  AGENTS.md（仓库根）
  platforms/codex/AGENTS.md
  platforms/aider/CONVENTIONS.md
  platforms/gemini-cli/GEMINI.md
  platforms/claude-web/project-knowledge.md
  platforms/cursor/.cursor/rules/{yushio,yushio-art-director,yushio-auditor,yushio-parallel}.mdc

链接策略：派生文件会被 symlink / 复制进用户项目（脱离仓库目录树），
仓库相对链接在那里必然断裂——所以所有 `./` `../` 相对链接目标统一重写为
GitHub blob 绝对 URL（任何位置可点开；有网络能力的 agent 也能跟进）。
反引号内的纯路径文本与 `~/.claude/...` 安装布局说明保持原样
（它们描述 Claude Code 规范安装位置，不是仓库内导航链接）。

用法：
  python3 scripts/build_derived.py            # 生成并写盘
  python3 scripts/build_derived.py --check    # 只比对不写盘 · 有漂移则非零退出（CI 用）

每次改动 skills/*/SKILL.md 后必须重跑本脚本——派生文件是产物，不要手改。
"""
import pathlib
import posixpath
import re
import sys

REPO = pathlib.Path(__file__).resolve().parents[1]
GH = "https://github.com/Lynnouo/yushio/blob/main"

# 顺序即合并版 Part 顺序
SKILLS = [
    ("yushio", "基础夕潮"),
    ("yushio-art-director", "美术总监夕潮"),
    ("yushio-auditor", "审计夕潮"),
    ("yushio-parallel", "并行夕潮"),
    ("yushio-vi", "VI 专项"),
]

MERGED_PATHS = [
    "AGENTS.md",
    "platforms/codex/AGENTS.md",
    "platforms/aider/CONVENTIONS.md",
    "platforms/gemini-cli/GEMINI.md",
    "platforms/claude-web/project-knowledge.md",
]

# Cursor .mdc frontmatter（派生层自有元数据 · 不来自 SKILL frontmatter）
MDC_FRONTMATTER = {
    "yushio": (
        "---\n"
        "description: Yushio (夕潮) base persona — emotion/judgment/reflection/autonomy + work discipline + memory system\n"
        'globs: ["**/*"]\n'
        "alwaysApply: true\n"
        "---\n"
    ),
    "yushio-art-director": (
        "---\n"
        "description: Yushio art director mode — design judgment, intent > intensity, anti-AI-slop, form follows feeling. "
        'Trigger by saying "你是美术总监夕潮" / "art director mode"\n'
        'globs: ["**/*"]\n'
        "alwaysApply: false\n"
        "---\n"
    ),
    "yushio-auditor": (
        "---\n"
        "description: Yushio audit mode — post-fix audit + proactive code quality review (5-step SOP + grep cheatsheet). "
        'Trigger by saying "你是审计夕潮" / "audit mode" or after fixing a bug\n'
        'globs: ["**/*"]\n'
        "alwaysApply: false\n"
        "---\n"
    ),
    "yushio-parallel": (
        "---\n"
        "description: Yushio parallel mode — multi-session conductor: vertical slices + shared-spine protection + lightweight handoff. "
        'Trigger by saying "你是并行夕潮" / "parallel mode", or when multiple sessions / worktrees edit one repo\n'
        'globs: ["**/*"]\n'
        "alwaysApply: false\n"
        "---\n"
    ),
    "yushio-vi": (
        "---\n"
        "description: Yushio VI mode — full brand visual-identity production playbook (12-chapter skeleton + craft pipeline), layered on the art director. "
        'Trigger by saying "做一套 VI" / "build a VI" / brand identity system / VI proposal\n'
        'globs: ["**/*"]\n'
        "alwaysApply: false\n"
        "---\n"
    ),
}


def skill_body(skill: str) -> str:
    """读 SKILL.md · 去 frontmatter · 去首尾空行。"""
    text = (REPO / "skills" / skill / "SKILL.md").read_text(encoding="utf-8")
    lines = text.splitlines()
    if lines and lines[0] == "---":
        end = lines.index("---", 1)
        lines = lines[end + 1:]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def rewrite_links(body: str, skill: str) -> str:
    """`](./x)` `](../x)` 形式的相对链接目标 → GitHub 绝对 URL。

    只动以 ./ 或 ../ 开头的目标——裸文件名形式（如文档内示例 `[标题](file.md)`）
    刻意不动，避免误伤代码示例。
    """
    def fix(m: re.Match) -> str:
        target = m.group(1)
        norm = posixpath.normpath(posixpath.join("skills", skill, target))
        return f"]({GH}/{norm})"

    out = re.sub(r"\]\((\.{1,2}/[^)\s]+)\)", fix, body)
    # 链接显示文本里的 ../ 相对路径 → 仓库内路径（目标已是 GH URL，文本同步可读化）
    out = re.sub(
        r"\[`\.\./([^`]+)`\]\((https://[^)]+)\)",
        lambda m: f"[`skills/{m.group(1)}`]({m.group(2)})",
        out,
    )
    return out


def build_merged() -> str:
    preamble = (REPO / "scripts" / "agents-preamble.md").read_text(encoding="utf-8")
    parts = []
    for i, (skill, name) in enumerate(SKILLS, 1):
        body = rewrite_links(skill_body(skill), skill)
        parts.append(f"# Part {i} · {name} SKILL\n\n{body}")
    return preamble.rstrip() + "\n\n---\n\n" + "\n\n---\n\n".join(parts) + "\n"


def build_mdc(skill: str) -> str:
    return MDC_FRONTMATTER[skill] + "\n" + rewrite_links(skill_body(skill), skill) + "\n"


def outputs() -> dict:
    merged = build_merged()
    out = {p: merged for p in MERGED_PATHS}
    for skill, _ in SKILLS:
        out[f"platforms/cursor/.cursor/rules/{skill}.mdc"] = build_mdc(skill)
    return out


def main() -> int:
    check = "--check" in sys.argv
    drift = 0
    for rel, content in outputs().items():
        p = REPO / rel
        current = p.read_text(encoding="utf-8") if p.exists() else None
        if current == content:
            print(f"  ok       {rel}")
            continue
        drift += 1
        if check:
            print(f"  DRIFT    {rel}  (re-run: python3 scripts/build_derived.py)")
        else:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content, encoding="utf-8")
            print(f"  wrote    {rel}")
    if check and drift:
        print(f"FAIL: {drift} derived file(s) out of sync with skills/ (the SSOT).")
        return 1
    print("check passed: derived files in sync." if check else f"done: {drift} file(s) updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
