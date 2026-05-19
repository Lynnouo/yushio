#!/usr/bin/env node
/**
 * build_audit_data.mjs · Node ES Modules 骨架 · 生成 public/audit-data.json
 *
 * 用法：
 *   node scripts/build_audit_data.mjs
 *
 * 输出：
 *   public/audit-data.json（按 _schema-template.md 契约）
 *
 * 适用：Node 18+ · 仅 stdlib（视项目加 papaparse / fast-glob 等）
 *
 * 要点：
 * - 按项目实际数据源改 §扫描函数
 * - lifecycle / orphans / 历史扫描 三件套不要省略
 * - 末尾跑验证 · 失败 process.exit(1)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// ============================================================
// 配置（按项目改）
// ============================================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(PROJECT_ROOT, "public", "audit-data.json");
const PROJECT_NAME = "<项目名>";
const PRIMARY_LANGUAGE = "<TypeScript / JavaScript / ...>";
const SCHEMA_VERSION = "1.0";

const CSV_DIR = path.join(PROJECT_ROOT, "src", "data");
const JSON_DIR = path.join(PROJECT_ROOT, "src", "configs");

const EXCLUDE_DIRS = ["node_modules", ".git", "dist", "build", ".next", ".turbo"];
const EXCLUDE_FILES_FOR_STALE_GREP = ["CHANGELOG.md"];

// ============================================================
// §1 · 扫源数据（按项目实际改）
// ============================================================

async function scanHeroes() {
  // 示例：从 kanban-characters.csv 读
  // const csv = await fs.readFile(path.join(CSV_DIR, "kanban-characters.csv"), "utf-8");
  // const rows = parseCsv(csv);
  // return rows.map(r => ({
  //   id: r.id,
  //   nameCn: r.nameCn,
  //   lifecycle: "active",
  //   sources: [...],
  //   sinks: [...],
  // }));
  return [];
}

async function scanItems() { return []; }

async function scanModules() {
  // 用 grep import + 简易扫 src/
  // 或考虑 ast-grep / dependency-cruiser 等专业工具
  return [];
}

async function scanApis() {
  // grep "router.get|post|put|delete" src/ · 或 framework 专属（Next.js pages/api · NestJS controllers）
  return [];
}

// ============================================================
// §2 · 历史扫描（#DK 防御核心 · 不要省略）
// ============================================================

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: PROJECT_ROOT, encoding: "utf-8" });
  } catch (e) {
    return "";
  }
}

async function scanRemovedEntities(category, parseFn) {
  const removed = [];
  const deletedFilesRaw = git('log --since="180 days ago" --diff-filter=D --name-only --pretty=format:');
  const deletedFiles = [...new Set(deletedFilesRaw.split("\n").filter(f => f.trim()))];

  for (const deletedFile of deletedFiles) {
    const log = git(`log --diff-filter=D --follow -1 --format=%H|%ai|%s -- "${deletedFile}"`);
    if (!log.trim()) continue;
    const [commitHash, commitDate, commitMsg] = log.trim().split("|", 3);

    let oldContent;
    try {
      oldContent = git(`show ${commitHash}~:"${deletedFile}"`);
    } catch { continue; }

    for (const entity of parseFn(deletedFile, oldContent)) {
      entity.lifecycle = "removed";
      entity.removedAt = commitDate.slice(0, 10);
      entity.removedBy = `commit ${commitHash.slice(0, 7)} · ${commitMsg}`;
      entity.lastReferencedIn = grepStaleReferences(entity.id);
      removed.push(entity);
    }
  }
  return removed;
}

function grepStaleReferences(entityId) {
  const excludeDirs = EXCLUDE_DIRS.map(d => `--exclude-dir=${d}`).join(" ");
  const excludeFiles = EXCLUDE_FILES_FOR_STALE_GREP.map(f => `--exclude=${f}`).join(" ");
  try {
    const result = execSync(
      `grep -rn "${entityId}" src/ docs/ ${excludeDirs} ${excludeFiles}`,
      { cwd: PROJECT_ROOT, encoding: "utf-8" }
    );
    return result.split("\n").filter(l => l.trim()).map(line => {
      const [file, lineno, ...rest] = line.split(":");
      return { file, line: lineno, context: rest.join(":").slice(0, 120) };
    });
  } catch { return []; }
}

// ============================================================
// §3 · 算孤儿（自动）
// ============================================================

function computeOrphans(data) {
  const orphans = {
    no_source: [],
    no_sink: [],
    removed_with_refs: [],
    modules_no_callers: [],
    apis_no_callers: [],
    external_deps_no_usage: [],
    deprecated_with_refs: [],
  };
  for (const [categoryKey, entities] of Object.entries(data)) {
    if (!Array.isArray(entities)) continue;
    for (const e of entities) {
      if (!e?.id) continue;
      if (!e.sources?.length) orphans.no_source.push(e.id);
      if (!e.sinks?.length) orphans.no_sink.push(e.id);
      if (e.lifecycle === "removed" && e.lastReferencedIn?.length) {
        orphans.removed_with_refs.push(e.id);
      }
      if (e.lifecycle === "deprecated" && (e.stale_references_count ?? 0) > 0) {
        orphans.deprecated_with_refs.push(e.id);
      }
      if (categoryKey === "modules" && !e.depended_by?.length) orphans.modules_no_callers.push(e.id);
      if (categoryKey === "apis" && !e.callers?.length) orphans.apis_no_callers.push(e.id);
      if (categoryKey === "external_deps" && !e.used_in?.length) orphans.external_deps_no_usage.push(e.name ?? e.id);
    }
  }
  return orphans;
}

// ============================================================
// §4 · 主流程
// ============================================================

async function build() {
  const data = {
    generated: new Date().toISOString(),
    schema_version: SCHEMA_VERSION,
    project: PROJECT_NAME,
    primary_language: PRIMARY_LANGUAGE,
    stats: {},
  };

  data.heroes = await scanHeroes();
  data.items = await scanItems();
  data.modules = await scanModules();
  data.apis = await scanApis();

  // 扫 removed entities（不可省）
  // data.heroes.push(...await scanRemovedEntities("heroes", parseHeroCsv));

  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) data.stats[k] = v.length;
  }
  data.orphans = computeOrphans(data);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf-8");

  validate(data);
  const totalEntities = Object.values(data.stats).reduce((a, b) => a + b, 0);
  const totalOrphans = Object.values(data.orphans).reduce((a, b) => a + b.length, 0);
  console.log(`✓ ${OUTPUT_PATH} · ${totalEntities} entities · ${totalOrphans} orphans`);
}

function validate(data) {
  const errors = [];
  const reservedKeys = new Set(["generated", "schema_version", "project", "primary_language", "stats", "orphans", "kinds_glossary"]);
  for (const [k, v] of Object.entries(data)) {
    if (reservedKeys.has(k) || !Array.isArray(v)) continue;
    for (const e of v) {
      if (!e?.id) continue;
      if (!e.lifecycle) errors.push(`${k}/${e.id}: missing lifecycle`);
      if (e.lifecycle === "removed" && !e.removedAt) {
        errors.push(`${k}/${e.id}: removed missing removedAt`);
      }
    }
  }
  if (errors.length) {
    console.error("[FAIL] schema validation:\n  " + errors.join("\n  "));
    process.exit(1);
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
