import { useState } from "react";
import { confirm, open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import {
  BackupData,
  clearAllData,
  dumpAll,
  getSettings,
  restoreAll,
} from "../db";

export interface Settings {
  dailyGoal: number;
  ttsEnabled: boolean;
  fontSize: "small" | "normal" | "large";
}

export default function SettingsView({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
}) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  function syncFromDb() {
    getSettings().then((s) =>
      onChange({
        dailyGoal: Number(s.daily_goal ?? "3"),
        ttsEnabled: (s.tts_enabled ?? "1") !== "0",
        fontSize: (s.font_size ?? "normal") as Settings["fontSize"],
      })
    );
  }

  async function doBackup() {
    setBusy(true);
    try {
      const data = await dumpAll();
      const path = await save({
        defaultPath: `jp-learn-backup-${stamp()}.json`,
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (path) {
        await writeTextFile(path, JSON.stringify(data, null, 2));
        setMsg(`已备份到：${path}`);
      }
    } catch (e) {
      setMsg(`备份失败：${String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function doRestore() {
    setBusy(true);
    try {
      const p = await open({
        multiple: false,
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (typeof p === "string") {
        const json = await readTextFile(p);
        const data = JSON.parse(json) as BackupData;
        if (
          !data ||
          !Array.isArray(data.lesson_progress) ||
          !Array.isArray(data.mistakes)
        ) {
          throw new Error("备份文件格式不正确");
        }
        await restoreAll(data);
        syncFromDb();
        setMsg("恢复成功，学习数据已还原。");
      }
    } catch (e) {
      setMsg(`恢复失败：${String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function doClear() {
    const ok = await confirm("确定要清空所有学习数据吗？此操作不可撤销。", {
      title: "清空数据",
      kind: "warning",
    });
    if (!ok) return;
    setBusy(true);
    try {
      await clearAllData();
      syncFromDb();
      setMsg("已清空所有学习数据。");
    } catch (e) {
      setMsg(`清空失败：${String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  function update(patch: Partial<Settings>) {
    onChange({ ...settings, ...patch });
  }

  return (
    <div>
      <h2>设置</h2>

      <section className="settings-group">
        <h3>每日目标</h3>
        <label>
          每天学习课程数：
          <select
            value={settings.dailyGoal}
            onChange={(e) => update({ dailyGoal: Number(e.target.value) })}
          >
            {[1, 2, 3, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n} 课
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="settings-group">
        <h3>发音</h3>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.ttsEnabled}
            onChange={(e) => update({ ttsEnabled: e.target.checked })}
          />
          启用发音朗读（本地 TTS，离线）
        </label>
      </section>

      <section className="settings-group">
        <h3>字体大小</h3>
        <select
          value={settings.fontSize}
          onChange={(e) => update({ fontSize: e.target.value as Settings["fontSize"] })}
        >
          <option value="small">小</option>
          <option value="normal">中</option>
          <option value="large">大</option>
        </select>
      </section>

      <section className="settings-group">
        <h3>数据</h3>
        <div className="row-actions">
          <button onClick={doBackup} disabled={busy}>
            备份 / 导出
          </button>
          <button onClick={doRestore} disabled={busy}>
            恢复 / 导入
          </button>
          <button className="danger-btn" onClick={doClear} disabled={busy}>
            清空数据
          </button>
        </div>
        {msg && <p className="msg">{msg}</p>}
      </section>
    </div>
  );
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(
    d.getHours()
  )}${p(d.getMinutes())}`;
}
