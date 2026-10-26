import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import Database from "@tauri-apps/plugin-sql";
import "./App.css";

function App() {
  const [version, setVersion] = useState("");
  const [dbMsg, setDbMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getVersion()
      .then(setVersion)
      .catch((e) => setVersion(`未知 (${String(e)})`));
  }, []);

  async function selfCheck() {
    setBusy(true);
    setDbMsg("");
    try {
      const db = await Database.load("sqlite:jp-learn.db");
      await db.execute(
        "CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)"
      );
      await db.execute(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
        ["self_check_at", new Date().toISOString()]
      );
      const rows = await db.select<{ key: string; value: string }[]>(
        "SELECT key, value FROM app_meta WHERE key = 'self_check_at'"
      );
      setDbMsg(`SQLite 读写正常 ✅　记录时间：${rows[0]?.value ?? "(空)"}`);
    } catch (e) {
      setDbMsg(`存储自检失败 ❌　${String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <h1>日语学习助手</h1>
      <p className="sub">本地离线 · 单机 · 无需注册登录</p>
      <p className="tech">Tauri 2 + React + TypeScript + SQLite</p>
      <p className="ver">版本 {version || "…"}</p>

      <div className="card">
        <h2>M0 · 存储自检</h2>
        <p>点击按钮验证本地 SQLite 数据库可正常读写（数据仅保存在本机，不联网）。</p>
        <button onClick={selfCheck} disabled={busy}>
          {busy ? "检测中…" : "运行存储自检"}
        </button>
        {dbMsg && <p className="result">{dbMsg}</p>}
      </div>
    </main>
  );
}

export default App;
