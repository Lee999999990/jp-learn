import Database from "@tauri-apps/plugin-sql";
import { chapters, lessons } from "./data/kana";

let dbPromise: Promise<Database> | null = null;

export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = Database.load("sqlite:jp-learn.db");
  }
  return dbPromise;
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
    "SELECT lesson_id, status FROM lesson_progress"
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
}
