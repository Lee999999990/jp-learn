import { useEffect, useState } from "react";
import { QuizQuestion, QuizScope, sampleQuestions } from "../lib/quiz";
import {
  listActiveMistakes,
  recordMistake,
  saveQuizResult,
  setMistakeMastery,
} from "../db";
import { speakJapanese } from "../lib/tts";

export default function QuizRunner({
  scope,
  count,
  onExit,
}: {
  scope: QuizScope;
  count: number;
  onExit: () => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      let qs: QuizQuestion[];
      if (scope === "mistakes") {
        const rows = await listActiveMistakes();
        qs = rows
          .map((r) => JSON.parse(r.question_json) as QuizQuestion)
          .sort(() => Math.random() - 0.5)
          .slice(0, count);
      } else {
        qs = sampleQuestions(count);
      }
      setQuestions(qs);
      setLoaded(true);
    })();
  }, [scope, count]);

  const q = questions[idx];

  useEffect(() => {
    if (q && q.type === "listen") speakJapanese(q.audioText ?? q.prompt);
  }, [q]);

  if (!loaded) {
    return (
      <div>
        <p>加载题目中…</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div>
        <p className="muted">没有可用的题目。</p>
        <button onClick={onExit}>返回测试</button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="quiz-end">
        <h2>测试完成</h2>
        <p className="score">
          {correctCount} / {questions.length}（正确率 {pct}%）
        </p>
        <button onClick={onExit}>返回测试</button>
      </div>
    );
  }

  if (!q) return null;

  async function choose(opt: string) {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === q.answer) {
      setCorrectCount((c) => c + 1);
      if (scope === "mistakes") await setMistakeMastery(q.id, 2);
    } else {
      await recordMistake(q);
    }
  }

  async function next() {
    if (idx + 1 >= questions.length) {
      await saveQuizResult(scope, questions.length, correctCount);
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
    }
  }

  const isCorrect = selected === q.answer;

  return (
    <div>
      <div className="quiz-meta">
        <span>
          第 {idx + 1} / {questions.length} 题
        </span>
        <span>已答对 {correctCount}</span>
        <span className="type-tag">{typeLabel(q.type)}</span>
      </div>
      <h2 className="quiz-prompt">{q.prompt}</h2>
      {q.type === "listen" && (
        <button className="listen-btn" onClick={() => speakJapanese(q.audioText ?? "")}>
          🔊 再听一次
        </button>
      )}
      <div className="options">
        {q.options.map((opt) => {
          let cls = "option";
          if (selected !== null) {
            if (opt === q.answer) cls += " correct";
            else if (opt === selected) cls += " wrong";
          }
          return (
            <button
              key={opt}
              className={cls}
              onClick={() => choose(opt)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`feedback ${isCorrect ? "ok" : "no"}`}>
          <p className="fb-title">{isCorrect ? "✅ 回答正确" : "❌ 回答错误"}</p>
          <p className="muted">{q.explanation}</p>
          <button onClick={next}>
            {idx + 1 >= questions.length ? "查看结果" : "下一题"}
          </button>
        </div>
      )}
    </div>
  );
}

function typeLabel(t: string) {
  if (t === "choice") return "选择";
  if (t === "jp2zh") return "日译中";
  return "听音";
}
