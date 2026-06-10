#!/usr/bin/env bash
# sync.sh — 本地完整版 vs 仓库脱敏版的同步辅助
# 默认行为：只做 diff · 不复制（让 user 看见差异自己决定）
#
# Usage:
#   ./scripts/sync.sh diff             — 只对比本地 ~/.claude/skills/yushio* 与仓库 skills/ 的差异
#   ./scripts/sync.sh local-to-repo    — (危险) 把本地完整版拷贝到仓库 · 跑完后必须手动复跑 sanitize 流程
#   ./scripts/sync.sh repo-to-local --i-know-this-loses-local-content
#                                       — (极危) 把仓库脱敏版覆盖到本地 · 会丢本地的迭代日志和署名
#
# 默认 diff 模式安全无副作用。
# 任何修改 ~/.claude/skills/ 或 skills/ 的操作必须显式选择动词。

set -euo pipefail

REPO_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
LOCAL_BASE="$HOME/.claude/skills"
REPO_SKILLS="$REPO_ROOT/skills"

cmd="${1:-diff}"
case "$cmd" in
  diff)
    echo "==> Diff between local ~/.claude/skills/yushio* and repo skills/"
    for sk in yushio yushio-art-director yushio-auditor yushio-parallel; do
      if [ -d "$LOCAL_BASE/$sk" ] && [ -d "$REPO_SKILLS/$sk" ]; then
        echo
        echo "--- $sk ---"
        diff -rq "$LOCAL_BASE/$sk" "$REPO_SKILLS/$sk" || true
      else
        echo "SKIP $sk (one side missing)"
      fi
    done
    echo
    echo "==> Done. Repo and local are independently maintained."
    echo "    Repo = sanitized public version (no Lyn / project names / hard paths)."
    echo "    Local = full version with iteration logs + credits."
    echo "    Sync direction is a deliberate decision — see ABOUT.md."
    ;;

  local-to-repo)
    echo "==> WARNING: This copies LOCAL (full) to REPO (sanitized)."
    echo "    Repo's sanitization will be OVERWRITTEN."
    echo "    You must re-run: python3 ~/.claude/scripts/yushio-sanitize.py --suggest"
    echo "    (the sanitize map lives OUTSIDE this repo on purpose — its name mapping is itself sensitive)"
    echo "    Hit Ctrl-C to abort, Enter to continue."
    read -r _
    for sk in yushio yushio-art-director yushio-auditor yushio-parallel; do
      rsync -av --delete "$LOCAL_BASE/$sk/" "$REPO_SKILLS/$sk/"
    done
    echo "==> Copied. NOW: re-run sanitize script + commit."
    ;;

  repo-to-local)
    if [ "${2:-}" != "--i-know-this-loses-local-content" ]; then
      echo "ABORT: This command will overwrite ~/.claude/skills/yushio* with the sanitized repo version."
      echo "       You will LOSE local iteration logs, credits, and project-specific content."
      echo "       Pass --i-know-this-loses-local-content if you really mean it."
      exit 1
    fi
    echo "==> Copying REPO (sanitized) to LOCAL. This is destructive."
    echo "    Hit Ctrl-C to abort, Enter to continue."
    read -r _
    for sk in yushio yushio-art-director yushio-auditor yushio-parallel; do
      rsync -av --delete "$REPO_SKILLS/$sk/" "$LOCAL_BASE/$sk/"
    done
    echo "==> Done. Local is now the sanitized version. Hope you backed up."
    ;;

  *)
    echo "Usage: $0 {diff|local-to-repo|repo-to-local}"
    echo "See script header for details."
    exit 1
    ;;
esac
