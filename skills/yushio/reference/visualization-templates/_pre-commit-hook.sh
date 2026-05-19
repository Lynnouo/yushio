#!/usr/bin/env bash
# pre-commit hook · 鸟瞰站 audit-data.json 自动重生 + 验证
#
# 安装：
#   cp _pre-commit-hook.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# 或用 pre-commit framework（见 README §维护机制 选项 B）
#
# 注意：
# - 本 hook 是【可选】机制 · 默认走审计夕潮 §6 SOP 步骤 5 自动钩子（不依赖 git hook）
# - 适用：多人协作 / CI 严格项目 / 需要硬约束
# - 不适用：build 慢（> 5s）/ 单人快速迭代项目（拖慢提交体验）

set -e

# ============================================================
# 配置（按项目改）
# ============================================================
BUILD_SCRIPT="scripts/build_audit_data.py"   # 或 .mjs · 按项目主语言
AUDIT_DATA="public/audit-data.json"
SCHEMA_TEMPLATE_DOC="docs/audit/_schema-template.md"   # 可选 · 验证 schema_version

# ============================================================
# §1 · 跑 build script
# ============================================================
if [[ -f "$BUILD_SCRIPT" ]]; then
  echo "[audit] rebuilding $AUDIT_DATA ..."
  if [[ "$BUILD_SCRIPT" == *.py ]]; then
    python3 "$BUILD_SCRIPT" || { echo "[audit] build failed · abort commit"; exit 1; }
  elif [[ "$BUILD_SCRIPT" == *.mjs || "$BUILD_SCRIPT" == *.js ]]; then
    node "$BUILD_SCRIPT" || { echo "[audit] build failed · abort commit"; exit 1; }
  else
    echo "[audit] unsupported build script: $BUILD_SCRIPT" >&2
    exit 1
  fi
else
  echo "[audit] $BUILD_SCRIPT not found · skip" >&2
  exit 0
fi

# ============================================================
# §2 · audit-data.json 自动 add 进本次 commit
# ============================================================
if [[ -f "$AUDIT_DATA" ]]; then
  git add "$AUDIT_DATA"
  echo "[audit] $AUDIT_DATA staged"
else
  echo "[audit] $AUDIT_DATA not generated · abort commit" >&2
  exit 1
fi

# ============================================================
# §3 · 报告孤儿数变化（提示性 · 不阻塞 commit · 让 user 看见）
# ============================================================
PREV_ORPHANS=$(git show HEAD:"$AUDIT_DATA" 2>/dev/null | jq '[.orphans[] | length] | add' 2>/dev/null || echo "0")
NEW_ORPHANS=$(jq '[.orphans[] | length] | add' < "$AUDIT_DATA" 2>/dev/null || echo "0")
DELTA=$((NEW_ORPHANS - PREV_ORPHANS))

if [[ "$DELTA" -gt 0 ]]; then
  echo ""
  echo "  ⚠️ 孤儿数 $PREV_ORPHANS → $NEW_ORPHANS（+$DELTA）"
  echo "     建议在 commit message 加 Review 段解释"
  echo ""
elif [[ "$DELTA" -lt 0 ]]; then
  echo ""
  echo "  ✅ 孤儿数 $PREV_ORPHANS → $NEW_ORPHANS（$DELTA · 修了孤儿）"
  echo ""
fi

# ============================================================
# §4 · 检查是否有 removed entity 新增 stale 引用（重大警示 · 阻塞 commit）
# ============================================================
NEW_REMOVED_WITH_REFS=$(jq -r '.orphans.removed_with_refs[]' < "$AUDIT_DATA" 2>/dev/null | sort -u)
PREV_REMOVED_WITH_REFS=$(git show HEAD:"$AUDIT_DATA" 2>/dev/null | jq -r '.orphans.removed_with_refs[]' 2>/dev/null | sort -u || echo "")
NEW_LEAK=$(comm -23 <(echo "$NEW_REMOVED_WITH_REFS") <(echo "$PREV_REMOVED_WITH_REFS"))

if [[ -n "$NEW_LEAK" ]]; then
  echo ""
  echo "  🔴 新增 removed entity stale 引用（形状 #DK / #L 警示）："
  echo "$NEW_LEAK" | sed 's/^/     - /'
  echo ""
  echo "  这些 entity 已 lifecycle: removed · 但当前代码 / 文档仍引用 · 必须修。"
  echo "  如确认是有意保留（如反向调教关键词）· 在 audit-data.json 该 entity 的 lastReferencedIn 加 note 字段说明"
  echo "  并重跑 build script · 然后才能 commit"
  echo ""
  exit 1
fi

exit 0
