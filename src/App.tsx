import { useEffect, useState } from "react";
import { initDb } from "./db";
import { QuizScope } from "./lib/quiz";
import CoursesView from "./views/CoursesView";
import LessonView from "./views/LessonView";
import QuizView from "./views/QuizView";
import QuizRunner from "./views/QuizRunner";
import "./App.css";

type View =
  | { name: "home" }
  | { name: "courses" }
  | { name: "lesson"; id: string }
  | { name: "quiz" }
  | { name: "quizRun"; scope: QuizScope; count: number }
  | { name: "stats" };

function App() {
  const [view, setView] = useState<View>({ name: "home" });
  const [ready, setReady] = useState(false);
  const [dbErr, setDbErr] = useState("");

  useEffect(() => {
    initDb()
      .then(() => setReady(true))
      .catch((e) => setDbErr(String(e)));
  }, []);

  if (dbErr) {
    return (
      <main className="app">
        <p className="error">数据库初始化失败：{dbErr}</p>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="topbar">
        <span className="brand">日语学习助手</span>
        <nav>
          <button
            className={view.name === "home" ? "active" : ""}
            onClick={() => setView({ name: "home" })}
          >
            首页
          </button>
          <button
            className={
              view.name === "courses" || view.name === "lesson" ? "active" : ""
            }
            onClick={() => setView({ name: "courses" })}
          >
            课程
          </button>
          <button
            className={
              view.name === "quiz" || view.name === "quizRun" ? "active" : ""
            }
            onClick={() => setView({ name: "quiz" })}
          >
            测试
          </button>
          <button
            className={view.name === "stats" ? "active" : ""}
            onClick={() => setView({ name: "stats" })}
          >
            统计
          </button>
        </nav>
      </header>
      <div className="content">
        {!ready ? (
          <p>加载中…</p>
        ) : view.name === "home" ? (
          <Home onStart={() => setView({ name: "courses" })} />
        ) : view.name === "courses" ? (
          <CoursesView onOpenLesson={(id) => setView({ name: "lesson", id })} />
        ) : view.name === "lesson" ? (
          <LessonView lessonId={view.id} onBack={() => setView({ name: "courses" })} />
        ) : view.name === "quiz" ? (
          <QuizView
            onStart={(scope, count) => setView({ name: "quizRun", scope, count })}
          />
        ) : view.name === "quizRun" ? (
          <QuizRunner
            scope={view.scope}
            count={view.count}
            onExit={() => setView({ name: "quiz" })}
          />
        ) : (
          <StatsPlaceholder />
        )}
      </div>
    </main>
  );
}

function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="home">
      <h1>こんにちは 👋</h1>
      <p className="muted">从五十音开始，每天 10～30 分钟，离线学日语。</p>
      <button onClick={onStart}>开始学习</button>
    </div>
  );
}

function StatsPlaceholder() {
  return (
    <div>
      <h2>学习统计</h2>
      <p className="muted">
        统计功能将在后续里程碑上线（已学课程数、测试正确率、错题数、连续学习天数）。
      </p>
    </div>
  );
}

export default App;
