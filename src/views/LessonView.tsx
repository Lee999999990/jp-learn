import { useEffect, useState } from "react";
import { KanaItem } from "../data/kana";
import { getDb, setProgress } from "../db";
import { speakJapanese } from "../lib/tts";

export default function LessonView({
  lessonId,
  onBack,
}: {
  lessonId: string;
  onBack: () => void;
}) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<KanaItem[]>([]);
  const [status, setStatus] = useState("not_started");

  useEffect(() => {
    (async () => {
      const db = await getDb();
      const rows = await db.select<{ title: string; content_json: string }[]>(
        "SELECT title, content_json FROM lessons WHERE id = ?",
        [lessonId]
      );
      if (rows[0]) {
        setTitle(rows[0].title);
        setItems(JSON.parse(rows[0].content_json) as KanaItem[]);
      }
      const p = await db.select<{ status: string }[]>(
        "SELECT status FROM lesson_progress WHERE lesson_id = ?",
        [lessonId]
      );
      if (p[0]) setStatus(p[0].status);
    })();
  }, [lessonId]);

  async function mark(s: string) {
    setStatus(s);
    await setProgress(lessonId, s);
  }

  return (
    <div>
      <button className="link" onClick={onBack}>
        ← 返回课程
      </button>
      <h2>{title}</h2>
      <p className="muted">点击卡片听发音，学完记得标记。</p>
      <div className="kana-grid">
        {items.map((k) => (
          <div
            className="kana-card"
            key={k.hiragana}
            onClick={() => speakJapanese(k.hiragana)}
            title="点击发音"
          >
            <div className="kana-hira">{k.hiragana}</div>
            <div className="kana-kata">{k.katakana}</div>
            <div className="kana-roma">{k.romaji}</div>
            <div className="kana-note">{k.note}</div>
            <div className="kana-speak">🔊 点击发音</div>
          </div>
        ))}
      </div>
      <div className="mark-row">
        <button
          className={status === "learned" ? "active" : ""}
          onClick={() => mark("learned")}
        >
          标记已学完
        </button>
        <button
          className={status === "review" ? "active" : ""}
          onClick={() => mark("review")}
        >
          标记待复习
        </button>
      </div>
    </div>
  );
}
