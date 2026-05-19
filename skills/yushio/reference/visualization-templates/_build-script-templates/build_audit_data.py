#!/usr/bin/env python3
"""
build_audit_data.py · Python 骨架 · 生成 public/audit-data.json

用法：
    python scripts/build_audit_data.py

输出：
    public/audit-data.json（按 _schema-template.md 契约）

适用：Python 3.8+ · 无外部依赖（仅 stdlib · 视项目加 pandas/click 等）

要点：
- 按项目实际数据源改 §扫描函数
- lifecycle / orphans / 历史扫描 三件套不要省略
- 末尾跑验证 · 失败 exit 1
"""

import json
import subprocess
import sys
import re
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

# ============================================================
# 配置（按项目改）
# ============================================================
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_PATH = PROJECT_ROOT / "public" / "audit-data.json"
PROJECT_NAME = "<项目名>"
PRIMARY_LANGUAGE = "<TypeScript / Python / Rust / ...>"
SCHEMA_VERSION = "1.0"

# 数据源路径（按 _project-recon-report.md §2 调研结果填）
CSV_DIR = PROJECT_ROOT / "src" / "data"
JSON_DIR = PROJECT_ROOT / "src" / "configs"

# stale 扫描排除目录
EXCLUDE_DIRS = {"node_modules", ".git", "dist", "build", ".next", "__pycache__"}
EXCLUDE_FILES_FOR_STALE_GREP = {"CHANGELOG.md", "*.fix-log.md", "handoff-*.md"}


# ============================================================
# §1 · 扫源数据（按项目实际改）
# ============================================================

def scan_heroes() -> list[dict]:
    """从 CSV / JSON 扫角色 · 返回 entity list"""
    heroes = []
    # 示例：从 kanban-characters.csv 读
    # csv_path = CSV_DIR / "kanban-characters.csv"
    # if csv_path.exists():
    #     import csv
    #     with csv_path.open() as f:
    #         reader = csv.DictReader(f)
    #         for row in reader:
    #             heroes.append({
    #                 "id": row["id"],
    #                 "nameCn": row["nameCn"],
    #                 "rarity": row.get("rarity", "N"),
    #                 "lifecycle": "active",
    #                 "sources": [...],
    #                 "sinks": [...],
    #             })
    return heroes


def scan_items() -> list[dict]:
    """同上 · 扫道具"""
    return []


def scan_modules() -> list[dict]:
    """通用代码项目：扫 module / 依赖 / 调用关系（用 ast / grep import）"""
    return []


def scan_apis() -> list[dict]:
    """扫 API 路由（grep router.get/post · @app.route · #[get(...)] 等）"""
    return []


# ============================================================
# §2 · 历史扫描（#DK 防御核心 · 不要省略）
# ============================================================

def scan_removed_entities(category: str, parse_fn) -> list[dict]:
    """
    扫 git log 找最近 180 天被删的 entity · 标 lifecycle: removed

    参数：
        category: entity 类别（如 "heroes" / "items"）
        parse_fn: 解析旧版文件提 entity ID 的函数 (file_path, commit_hash) -> [entity_dict]
    """
    removed = []
    try:
        # 列出最近 180 天被删的文件
        result = subprocess.run(
            ["git", "log", "--since=180 days ago", "--diff-filter=D", "--name-only", "--pretty=format:"],
            capture_output=True, text=True, check=True, cwd=PROJECT_ROOT
        )
        deleted_files = sorted(set(f for f in result.stdout.split("\n") if f.strip()))

        for deleted_file in deleted_files:
            # 找到删除时的 commit
            log = subprocess.run(
                ["git", "log", "--diff-filter=D", "--follow", "-1", "--format=%H|%ai|%s", "--", deleted_file],
                capture_output=True, text=True, cwd=PROJECT_ROOT
            )
            if not log.stdout.strip():
                continue
            commit_hash, commit_date, commit_msg = log.stdout.strip().split("|", 2)

            # checkout 删除前一版 · 解析当时的 entity
            try:
                old_content = subprocess.run(
                    ["git", "show", f"{commit_hash}~:{deleted_file}"],
                    capture_output=True, text=True, check=True, cwd=PROJECT_ROOT
                ).stdout
            except subprocess.CalledProcessError:
                continue

            for entity in parse_fn(deleted_file, old_content):
                entity["lifecycle"] = "removed"
                entity["removedAt"] = commit_date[:10]
                entity["removedBy"] = f"commit {commit_hash[:7]} · {commit_msg}"
                entity["lastReferencedIn"] = grep_stale_references(entity["id"])
                removed.append(entity)
    except subprocess.CalledProcessError as e:
        print(f"[warn] git scan failed: {e}", file=sys.stderr)
    return removed


def grep_stale_references(entity_id: str) -> list[dict]:
    """grep 当前代码 / 文档找 stale 引用 · 排除变更日志类文件"""
    refs = []
    try:
        result = subprocess.run(
            ["grep", "-rn", entity_id, str(PROJECT_ROOT / "src"), str(PROJECT_ROOT / "docs"),
             "--exclude-dir=" + ",".join(EXCLUDE_DIRS),
             "--exclude=" + ",".join(EXCLUDE_FILES_FOR_STALE_GREP)],
            capture_output=True, text=True, cwd=PROJECT_ROOT
        )
        for line in result.stdout.split("\n"):
            if not line.strip():
                continue
            parts = line.split(":", 2)
            if len(parts) < 3:
                continue
            refs.append({"file": parts[0], "line": parts[1], "context": parts[2][:120]})
    except subprocess.CalledProcessError:
        pass
    return refs


# ============================================================
# §3 · 算孤儿（自动 · 不要手填）
# ============================================================

def compute_orphans(data: dict) -> dict:
    """从 entity arrays 算 orphans"""
    orphans = {
        "no_source": [],
        "no_sink": [],
        "removed_with_refs": [],
        "modules_no_callers": [],
        "apis_no_callers": [],
        "external_deps_no_usage": [],
        "deprecated_with_refs": [],
    }
    for category_key, entities in data.items():
        if not isinstance(entities, list):
            continue
        for e in entities:
            if not isinstance(e, dict) or "id" not in e:
                continue
            # 通用孤儿
            if not e.get("sources"):
                orphans["no_source"].append(e["id"])
            if not e.get("sinks"):
                orphans["no_sink"].append(e["id"])
            # lifecycle 孤儿
            if e.get("lifecycle") == "removed" and e.get("lastReferencedIn"):
                orphans["removed_with_refs"].append(e["id"])
            if e.get("lifecycle") == "deprecated" and e.get("stale_references_count", 0) > 0:
                orphans["deprecated_with_refs"].append(e["id"])
            # 模块特定孤儿
            if category_key == "modules" and not e.get("depended_by"):
                orphans["modules_no_callers"].append(e["id"])
            # API 特定孤儿
            if category_key == "apis" and not e.get("callers"):
                orphans["apis_no_callers"].append(e["id"])
            # External deps 特定孤儿
            if category_key == "external_deps" and not e.get("used_in"):
                orphans["external_deps_no_usage"].append(e.get("name", e["id"]))
    return orphans


# ============================================================
# §4 · 主流程
# ============================================================

def build():
    data = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "schema_version": SCHEMA_VERSION,
        "project": PROJECT_NAME,
        "primary_language": PRIMARY_LANGUAGE,
        "stats": {},
    }

    # 扫现有 entities（按项目改）
    data["heroes"] = scan_heroes()
    data["items"] = scan_items()
    data["modules"] = scan_modules()
    data["apis"] = scan_apis()

    # 扫 removed entities（不可省）
    # data["heroes"].extend(scan_removed_entities("heroes", parse_hero_csv))
    # data["items"].extend(scan_removed_entities("items", parse_item_csv))

    # stats
    for k, v in data.items():
        if isinstance(v, list):
            data["stats"][k] = len(v)

    # orphans
    data["orphans"] = compute_orphans(data)

    # 写盘
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 验证
    validate(data)
    print(f"✓ {OUTPUT_PATH} · {sum(data['stats'].values())} entities · {sum(len(v) for v in data['orphans'].values())} orphans")


def validate(data: dict):
    """schema 合规性检查 · 失败 exit 1"""
    errors = []
    for k, v in data.items():
        if k in ("generated", "schema_version", "project", "primary_language", "stats", "orphans", "kinds_glossary"):
            continue
        if not isinstance(v, list):
            continue
        for e in v:
            if not isinstance(e, dict) or "id" not in e:
                continue
            if "lifecycle" not in e:
                errors.append(f"{k}/{e['id']}: missing lifecycle")
            if e.get("lifecycle") == "removed" and "removedAt" not in e:
                errors.append(f"{k}/{e['id']}: removed missing removedAt")
    if errors:
        print(f"[FAIL] schema validation:\n  " + "\n  ".join(errors), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    build()
