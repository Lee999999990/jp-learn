import { useEffect, useState } from "react";
import { QuizQuestion, QuizScope } from "../lib/quiz";
import {
  MistakeRow,
  countMistakes,
  deleteMistake,
  listActiveMistakes,
  setMistakeMastery,
} from "../db";

export default function QuizView({
  onStart,
}: {
  onStart: (scope: QuizScope, count: number) => void;
}) {
  const [scope, setScope] = useState<QuizScope>("all");
  const [count, setCount] = useState(10);
  const [mistakes, setMistakes] = useState<MistakeRow[]>([]);
  const [counts, setCounts] = useState({ active: 0, total: 0 });

  async function refresh() {
    setMistakes(await listActiveMistakes());
    setCounts(await countMistakes());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h2>测试</h2>
      <div className="panel">
        <div className="field">
          <label>范围</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as QuizScope)}
          >
            <option value="all">全部内容（五十音 + 基础词汇）</option>
            <option value="mistakes">错题重练（{counts.active} 题待掌握）</option>
          </select>
        </div>
        <div className="field">
          <label>题数</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            <option value={5}>5 题</option>
            <option value={10}>10 题</option>
            <option value={20}>20 题</option>
          </select>
        </div>
        <button
          onClick={() => onStart(scope, count)}
          disabled={scope === "mistakes" && counts.active === 0}
        >
          开始测试
        </button>
      </div>

      <h3>错题本</h3>
      <p className="muted">
        答错的题自动收录；掌握后可标记移除。共 {counts.total} 条，{counts.active}{" "}
        条待掌握。
      </p>
      {mistakes.length === 0 ? (
        <p className="muted">暂无待掌握错题。</p>
      ) : (
        <ul className="mistake-list">
          {mistakes.map((m) => {
            const q = JSON.parse(m.question_json) as QuizQuestion;
            return (
              <li key={m.question_id}>
                <div className="mistake-q">
                  <span className="type-tag">{typeLabel(q.type)}</span> {q.prompt}
                </div>
                <div className="mistake-a">
                  <span>答案：{q.answer}</span>
                  <select
                    value={m.mastery}
                    onChange={(e) => {
                      setMistakeMastery(m.question_id, Number(e.target.value));
                      refresh();
                    }}
                  >
                    <option value={0}>未掌握</option>
                    <option value={1}>模糊</option>
                    <option value={2}>已掌握</option>
                  </select>
                  <button
                    className="link danger"
                    onClick={() => {
                      deleteMistake(m.question_id);
                      refresh();
                    }}
                  >
                    删除
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function typeLabel(t: string) {
  if (t === "choice") return "选择";
  if (t === "jp2zh") return "日译中";
  return "听音";
}
