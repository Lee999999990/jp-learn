import { useEffect, useState } from "react";
import { getSettings, initDb, setSetting } from "./db";
import { QuizScope } from "./lib/quiz";
import { setTtsEnabled } from "./lib/tts";
import CoursesView from "./views/CoursesView";
import LessonView from "./views/LessonView";
import QuizView from "./views/QuizView";
import QuizRunner from "./views/QuizRunner";
import StatsView from "./views/StatsView";
import SettingsView, { Settings } from "./views/SettingsView";
import "./App.css";

type View =
  | { name: "home" }
  | { name: "courses" }
  | { name: "lesson"; id: string }
  | { name: "quiz" }
  | { name: "quizRun"; scope: QuizScope; count: number }
  | { name: "stats" }
  | { name: "settings" };

const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 3,
  ttsEnabled: true,
  fontSize: "normal",
};

function App() {
  const [view, setView] = useState<View>({ name: "home" });
  const [ready, setReady] = useState(false);
  const [dbErr, setDbErr] = useState("");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    initDb()
      .then(async () => {
        const s = await getSettings();
        setSettings({
          dailyGoal: Number(s.daily_goal ?? "3"),
          ttsEnabled: (s.tts_enabled ?? "1") !== "0",
          fontSize: (s.font_size ?? "normal") as Settings["fontSize"],
        });
        setReady(true);
      })
      .catch((e) => setDbErr(String(e)));
  }, []);

  useEffect(() => {
    setTtsEnabled(settings.ttsEnabled);
    const px =
      settings.fontSize === "small"
        ? "14px"
        : settings.fontSize === "large"
          ? "18px"
          : "16px";
    document.documentElement.style.fontSize = px;
  }, [settings]);

  async function handleSettingsChange(s: Settings) {
    setSettings(s);
    await setSetting("daily_goal", String(s.dailyGoal));
    await setSetting("tts_enabled", s.ttsEnabled ? "1" : "0");
    await setSetting("font_size", s.fontSize);
  }

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
          <button
            className={view.name === "settings" ? "active" : ""}
            onClick={() => setView({ name: "settings" })}
          >
            设置
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
        ) : view.name === "stats" ? (
          <StatsView />
        ) : (
          <SettingsView settings={settings} onChange={handleSettingsChange} />
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

export default App;
