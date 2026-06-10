#!/usr/bin/env python3
"""
verify_release.py — 发行不变量校验（本地 push 前 + CI 每次 push/PR 跑）。

检查：
  1. 派生文件与 skills/（SSOT）同步（调 build_derived.py --check）
  2. 五份合并版字节一致
  3. 全仓 markdown 链接可解析（相对链接逐个验证；GitHub blob 链接映射回仓库内路径验证）
  4. 落地页 stats 数字 == skills/ 实际 skill 数
  5. marketplace.json（两处）与 plugin.json 版本号一致
  6. 无个人绝对路径泄漏（通用模式；真实项目名黑名单在仓库外的私有脚本里）
  7. 每个 skills/*/SKILL.md frontmatter name 与目录名一致

任何一项失败 → 非零退出。
"""
import hashlib
import json
import pathlib
import re
import subprocess
import sys

REPO = pathlib.Path(__file__).resolve().parents[1]
GH_BLOB = "https://github.com/Lynnouo/yushio/blob/main/"
MERGED = [
    "AGENTS.md",
    "platforms/codex/AGENTS.md",
    "platforms/aider/CONVENTIONS.md",
    "platforms/gemini-cli/GEMINI.md",
    "platforms/claude-web/project-knowledge.md",
]
errors: list[str] = []


def ok(msg: str) -> None:
    print(f"  ok   {msg}")


def err(msg: str) -> None:
    errors.append(msg)
    print(f"  FAIL {msg}")


def tracked_files() -> list[pathlib.Path]:
    try:
        out = subprocess.run(
            ["git", "-C", str(REPO), "ls-files", "-z"],
            capture_output=True, check=True,
        ).stdout.decode()
        return [REPO / p for p in out.split("\0") if p]
    except Exception:
        return [p for p in REPO.rglob("*") if p.is_file() and ".git" not in p.parts]


def strip_code(md: str) -> str:
    """去掉 fenced code block 与 inline code span——示例代码里的伪链接不算链接。"""
    md = re.sub(r"```.*?```", "", md, flags=re.S)
    return re.sub(r"`[^`\n]*`", "", md)


def check_build_sync() -> None:
    r = subprocess.run(
        [sys.executable, str(REPO / "scripts" / "build_derived.py"), "--check"],
        capture_output=True, text=True,
    )
    if r.returncode == 0:
        ok("derived files in sync with skills/ (build --check)")
    else:
        err("derived files drifted — run: python3 scripts/build_derived.py")
        print(r.stdout)


def check_merged_identical() -> None:
    digests = {p: hashlib.sha256((REPO / p).read_bytes()).hexdigest() for p in MERGED}
    if len(set(digests.values())) == 1:
        ok(f"5 merged deployments byte-identical ({list(digests.values())[0][:12]}…)")
    else:
        err(f"merged deployments differ: {digests}")


def check_md_links() -> None:
    bad = 0
    for f in tracked_files():
        if f.suffix.lower() != ".md":
            continue
        body = strip_code(f.read_text(encoding="utf-8"))
        for m in re.finditer(r"\[[^\]]*\]\(([^)\s]+)\)", body):
            target = m.group(1)
            if target.startswith(("#", "mailto:")):
                continue
            if target.startswith(("http://", "https://")):
                if target.startswith(GH_BLOB):  # 自家 blob 链接必须映射到真实仓库路径
                    rel = target[len(GH_BLOB):].split("#")[0]
                    if not (REPO / rel).exists():
                        err(f"{f.relative_to(REPO)}: GitHub link → repo path missing: {rel}")
                        bad += 1
                continue
            rel = target.split("#")[0]
            if rel and not (f.parent / rel).resolve().exists():
                err(f"{f.relative_to(REPO)}: broken relative link: {target}")
                bad += 1
    if not bad:
        ok("all markdown links resolve (relative + GitHub blob)")


def check_landing_stats() -> None:
    n_skills = len([d for d in (REPO / "skills").iterdir() if (d / "SKILL.md").exists()])
    js = (REPO / "YushioWeb" / "content.js").read_text(encoding="utf-8")
    nums = re.findall(r'k:\s*"(\d+)",\s*v:\s*"(?:层 SKILL|layered skills)"', js)
    if len(nums) >= 2 and all(int(n) == n_skills for n in nums):
        ok(f"landing stats == skill count ({n_skills})")
    else:
        err(f"landing stats {nums} != actual skill count {n_skills} (YushioWeb/content.js)")


def check_versions() -> None:
    mp = json.loads((REPO / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
    pl = json.loads((REPO / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
    versions = {mp["version"], mp["plugins"][0]["version"], pl["version"]}
    if len(versions) == 1:
        ok(f"plugin/marketplace versions in lockstep ({versions.pop()})")
    else:
        err(f"version mismatch across manifests: {versions}")


def check_no_personal_paths() -> None:
    pattern = "/Use" + "rs/"  # 拼接避免本文件自命中
    allow = {
        # 教学内容：硬编码"用户主目录绝对路径"的反例示范 + 检测它的 grep 模板自身
        # （该文件里的示例路径是泛指的 x 用户，不是真实泄漏）
        "skills/yushio-auditor/reference/quality-review.md",
    }
    hits = [
        str(f.relative_to(REPO))
        for f in tracked_files()
        if f.suffix in {".md", ".js", ".jsx", ".json", ".sh", ".py", ".mdc", ".yml", ".html", ".css"}
        and str(f.relative_to(REPO)) not in allow
        and pattern in f.read_text(encoding="utf-8", errors="ignore")
    ]
    if not hits:
        ok("no personal absolute paths in tracked files")
    else:
        err(f"personal absolute path leaked in: {hits}")


def check_frontmatter_names() -> None:
    bad = 0
    for d in sorted((REPO / "skills").iterdir()):
        sk = d / "SKILL.md"
        if not sk.exists():
            continue
        head = sk.read_text(encoding="utf-8").splitlines()[:3]
        m = re.match(r"name:\s*(\S+)", head[1]) if len(head) > 1 else None
        if not m or m.group(1) != d.name:
            err(f"frontmatter name mismatch in {sk.relative_to(REPO)}")
            bad += 1
    if not bad:
        ok("SKILL frontmatter names match directory names")


def main() -> int:
    check_build_sync()
    check_merged_identical()
    check_md_links()
    check_landing_stats()
    check_versions()
    check_no_personal_paths()
    check_frontmatter_names()
    if errors:
        print(f"\nverify FAILED: {len(errors)} problem(s).")
        return 1
    print("\nverify passed: all release invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
