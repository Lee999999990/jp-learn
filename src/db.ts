import Database from "@tauri-apps/plugin-sql";
import { chapters, lessons } from "./data/kana";
import type { QuizQuestion } from "./lib/quiz";

let dbPromise: Promise<Database> | null = null;

export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = Database.load("sqlite:jp-learn.db");
  }
  return dbPromise;
}

function localDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export async function initDb(): Promise<void> {
  const db = await getDb();
  await db.execute(
    `CREATE TABLE IF NOT EXISTS chapters (
       id TEXT PRIMARY KEY,
       sort INTEGER NOT NULL,
       title TEXT NOT NULL,
       description TEXT NOT NULL
     )`
  );
  await db.execute(
    `CREATE TABLE IF NOT EXISTS lessons (
       id TEXT PRIMARY KEY,
       chapter_id TEXT NOT NULL,
       sort INTEGER NOT NULL,
       title TEXT NOT NULL,
       content_json TEXT NOT NULL
     )`
  );
  await db.execute(
    `CREATE TABLE IF NOT EXISTS lesson_progress (
       lesson_id TEXT PRIMARY KEY,
       status TEXT NOT NULL,
       updated_at TEXT NOT NULL
     )`
  );
  await db.execute(
    `CREATE TABLE IF NOT EXISTS mistakes (
       question_id TEXT PRIMARY KEY,
       question_json TEXT NOT NULL,
       mastery INTEGER NOT NULL DEFAULT 0,
       wrong_count INTEGER NOT NULL DEFAULT 1,
       updated_at TEXT NOT NULL
     )`
  );
  await db.execute(
    `CREATE TABLE IF NOT EXISTS quiz_results (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       scope TEXT NOT NULL,
       question_count INTEGER NOT NULL,
       correct_count INTEGER NOT NULL,
       created_at TEXT NOT NULL
     )`
  );
  await db.execute(
    `CREATE TABLE IF NOT EXISTS daily_activity (
       day TEXT PRIMARY KEY,
       first_at TEXT NOT NULL
     )`
  );
  await db.execute(
    `CREATE TABLE IF NOT EXISTS settings (
       key TEXT PRIMARY KEY,
       value TEXT NOT NULL
     )`
  );
  for (const c of chapters) {
    await db.execute(
      "INSERT OR IGNORE INTO chapters (id, sort, title, description) VALUES (?, ?, ?, ?)",
      [c.id, c.sort, c.title, c.description]
    );
  }
  for (const l of lessons) {
    await db.execute(
      "INSERT OR IGNORE INTO lessons (id, chapter_id, sort, title, content_json) VALUES (?, ?, ?, ?, ?)",
      [l.id, l.chapterId, l.sort, l.title, JSON.stringify(l.items)]
    );
  }
}

async function recordActivity(): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT OR IGNORE INTO daily_activity (day, first_at) VALUES (?, ?)",
    [localDay(new Date()), new Date().toISOString()]
  );
}

export interface ChapterRow {
  id: string;
  sort: number;
  title: string;
  description: string;
}

export interface LessonRow {
  id: string;
  chapter_id: string;
  sort: number;
  title: string;
  content_json: string;
}

export interface ProgressRow {
  lesson_id: string;
  status: string;
  updated_at: string;
}

export interface MistakeRow {
  question_id: string;
  question_json: string;
  mastery: number;
  wrong_count: number;
  updated_at: string;
}

export interface QuizResultRow {
  scope: string;
  question_count: number;
  correct_count: number;
  created_at: string;
}

export async function listChapters(): Promise<ChapterRow[]> {
  const db = await getDb();
  return db.select<ChapterRow[]>(
    "SELECT id, sort, title, description FROM chapters ORDER BY sort"
  );
}

export async function listLessons(chapterId: string): Promise<LessonRow[]> {
  const db = await getDb();
  return db.select<LessonRow[]>(
    "SELECT id, chapter_id, sort, title, content_json FROM lessons WHERE chapter_id = ? ORDER BY sort",
    [chapterId]
  );
}

export async function listProgress(): Promise<Map<string, string>> {
  const db = await getDb();
  const rows = await db.select<ProgressRow[]>(
    "SELECT lesson_id, status, updated_at FROM lesson_progress"
  );
  const m = new Map<string, string>();
  for (const r of rows) m.set(r.lesson_id, r.status);
  return m;
}

export async function setProgress(lessonId: string, status: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT OR REPLACE INTO lesson_progress (lesson_id, status, updated_at) VALUES (?, ?, ?)",
    [lessonId, status, new Date().toISOString()]
  );
  await recordActivity();
}

export async function recordMistake(q: QuizQuestion): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO mistakes (question_id, question_json, mastery, wrong_count, updated_at)
     VALUES (?, ?, 0, 1, ?)
     ON CONFLICT(question_id) DO UPDATE SET
       wrong_count = wrong_count + 1,
       updated_at = excluded.updated_at`,
    [q.id, JSON.stringify(q), new Date().toISOString()]
  );
}

export async function setMistakeMastery(
  questionId: string,
  mastery: number
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE mistakes SET mastery = ?, updated_at = ? WHERE question_id = ?",
    [mastery, new Date().toISOString(), questionId]
  );
}

export async function deleteMistake(questionId: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM mistakes WHERE question_id = ?", [questionId]);
}

export async function listActiveMistakes(): Promise<MistakeRow[]> {
  const db = await getDb();
  return db.select<MistakeRow[]>(
    "SELECT question_id, question_json, mastery, wrong_count, updated_at FROM mistakes WHERE mastery < 2 ORDER BY updated_at DESC"
  );
}

export async function countMistakes(): Promise<{ active: number; total: number }> {
  const db = await getDb();
  const active = await db.select<{ c: number }[]>(
    "SELECT COUNT(*) AS c FROM mistakes WHERE mastery < 2"
  );
  const total = await db.select<{ c: number }[]>(
    "SELECT COUNT(*) AS c FROM mistakes"
  );
  return { active: active[0]?.c ?? 0, total: total[0]?.c ?? 0 };
}

export async function saveQuizResult(
  scope: string,
  total: number,
  correct: number
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO quiz_results (scope, question_count, correct_count, created_at) VALUES (?, ?, ?, ?)",
    [scope, total, correct, new Date().toISOString()]
  );
  await recordActivity();
}

export async function getSettings(): Promise<Record<string, string>> {
  const db = await getDb();
  const rows = await db.select<{ key: string; value: string }[]>(
    "SELECT key, value FROM settings"
  );
  const m: Record<string, string> = {};
  for (const r of rows) m[r.key] = r.value;
  return m;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
    key,
    value,
  ]);
}

export interface Stats {
  learned: number;
  review: number;
  totalLessons: number;
  quizCount: number;
  quizCorrect: number;
  quizTotal: number;
  mistakeActive: number;
  mistakeTotal: number;
  streak: number;
  todayActive: boolean;
}

export async function getStats(): Promise<Stats> {
  const db = await getDb();
  const one = async <T>(sql: string): Promise<T | undefined> =>
    (await db.select<T[]>(sql))[0];

  const totalLessons =
    (await one<{ c: number }>("SELECT COUNT(*) AS c FROM lessons"))?.c ?? 0;
  const learned =
    (await one<{ c: number }>(
      "SELECT COUNT(*) AS c FROM lesson_progress WHERE status = 'learned'"
    ))?.c ?? 0;
  const review =
    (await one<{ c: number }>(
      "SELECT COUNT(*) AS c FROM lesson_progress WHERE status = 'review'"
    ))?.c ?? 0;
  const qa = await one<{ n: number; correct: number; total: number }>(
    "SELECT COUNT(*) AS n, COALESCE(SUM(correct_count),0) AS correct, COALESCE(SUM(question_count),0) AS total FROM quiz_results"
  );
  const mistakeActive =
    (await one<{ c: number }>("SELECT COUNT(*) AS c FROM mistakes WHERE mastery < 2"))?.c ?? 0;
  const mistakeTotal =
    (await one<{ c: number }>("SELECT COUNT(*) AS c FROM mistakes"))?.c ?? 0;

  const days = await db.select<{ day: string }[]>(
    "SELECT day FROM daily_activity ORDER BY day DESC"
  );
  const daySet = new Set(days.map((r) => r.day));
  const now = new Date();
  const today = localDay(now);
  const yesterday = localDay(new Date(now.getTime() - 86400000));

  let streak = 0;
  if (daySet.has(today) || daySet.has(yesterday)) {
    let cursor = daySet.has(today)
      ? now
      : new Date(now.getTime() - 86400000);
    while (daySet.has(localDay(cursor))) {
      streak++;
      cursor = new Date(cursor.getTime() - 86400000);
    }
  }

  return {
    learned,
    review,
    totalLessons,
    quizCount: qa?.n ?? 0,
    quizCorrect: qa?.correct ?? 0,
    quizTotal: qa?.total ?? 0,
    mistakeActive,
    mistakeTotal,
    streak,
    todayActive: daySet.has(today),
  };
}

export interface BackupData {
  version: number;
  exportedAt: string;
  lesson_progress: ProgressRow[];
  mistakes: MistakeRow[];
  quiz_results: QuizResultRow[];
  daily_activity: { day: string; first_at: string }[];
  settings: { key: string; value: string }[];
}

export async function dumpAll(): Promise<BackupData> {
  const db = await getDb();
  const lesson_progress = await db.select<ProgressRow[]>(
    "SELECT lesson_id, status, updated_at FROM lesson_progress"
  );
  const mistakes = await db.select<MistakeRow[]>(
    "SELECT question_id, question_json, mastery, wrong_count, updated_at FROM mistakes"
  );
  const quiz_results = await db.select<QuizResultRow[]>(
    "SELECT scope, question_count, correct_count, created_at FROM quiz_results ORDER BY id"
  );
  const daily_activity = await db.select<{ day: string; first_at: string }[]>(
    "SELECT day, first_at FROM daily_activity"
  );
  const settings = await db.select<{ key: string; value: string }[]>(
    "SELECT key, value FROM settings"
  );
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    lesson_progress,
    mistakes,
    quiz_results,
    daily_activity,
    settings,
  };
}

export async function restoreAll(data: BackupData): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM lesson_progress");
  await db.execute("DELETE FROM mistakes");
  await db.execute("DELETE FROM quiz_results");
  await db.execute("DELETE FROM daily_activity");
  await db.execute("DELETE FROM settings");
  for (const r of data.lesson_progress ?? []) {
    await db.execute(
      "INSERT INTO lesson_progress (lesson_id, status, updated_at) VALUES (?, ?, ?)",
      [r.lesson_id, r.status, r.updated_at]
    );
  }
  for (const r of data.mistakes ?? []) {
    await db.execute(
      "INSERT INTO mistakes (question_id, question_json, mastery, wrong_count, updated_at) VALUES (?, ?, ?, ?, ?)",
      [r.question_id, r.question_json, r.mastery, r.wrong_count, r.updated_at]
    );
  }
  for (const r of data.quiz_results ?? []) {
    await db.execute(
      "INSERT INTO quiz_results (scope, question_count, correct_count, created_at) VALUES (?, ?, ?, ?)",
      [r.scope, r.question_count, r.correct_count, r.created_at]
    );
  }
  for (const r of data.daily_activity ?? []) {
    await db.execute(
      "INSERT INTO daily_activity (day, first_at) VALUES (?, ?)",
      [r.day, r.first_at]
    );
  }
  for (const r of data.settings ?? []) {
    await db.execute("INSERT INTO settings (key, value) VALUES (?, ?)", [
      r.key,
      r.value,
    ]);
  }
}

export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM lesson_progress");
  await db.execute("DELETE FROM mistakes");
  await db.execute("DELETE FROM quiz_results");
  await db.execute("DELETE FROM daily_activity");
  await db.execute("DELETE FROM settings");
}
