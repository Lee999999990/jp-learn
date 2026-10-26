import { useEffect, useState } from "react";
import { ChapterRow, LessonRow, listChapters, listLessons, listProgress } from "../db";

export default function CoursesView({
  onOpenLesson,
}: {
  onOpenLesson: (id: string) => void;
}) {
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [lessons, setLessons] = useState<Record<string, LessonRow[]>>({});
  const [progress, setProgress] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    (async () => {
      const cs = await listChapters();
      setChapters(cs);
      const pm = await listProgress();
      setProgress(pm);
      const ls: Record<string, LessonRow[]> = {};
      for (const c of cs) {
        ls[c.id] = await listLessons(c.id);
      }
      setLessons(ls);
    })();
  }, []);

  return (
    <div>
      {chapters.map((c) => (
        <section key={c.id} className="chapter">
          <h2>{c.title}</h2>
          <p className="muted">{c.description}</p>
          <ul className="lesson-list">
            {(lessons[c.id] ?? []).map((l) => {
              const st = progress.get(l.id) ?? "not_started";
              return (
                <li key={l.id} onClick={() => onOpenLesson(l.id)}>
                  <span className="lesson-title">{l.title}</span>
                  <span className={`badge badge-${st}`}>{statusLabel(st)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function statusLabel(s: string) {
  if (s === "learned") return "已学完";
  if (s === "review") return "待复习";
  return "未学";
}
