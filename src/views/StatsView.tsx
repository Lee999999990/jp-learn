import { useEffect, useState } from "react";
import { getStats, Stats } from "../db";

export default function StatsView() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return <p>加载中…</p>;

  const learned = stats.learned + stats.review;
  const rate =
    stats.quizTotal > 0
      ? Math.round((stats.quizCorrect / stats.quizTotal) * 100)
      : null;

  return (
    <div>
      <h2>学习统计</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">
            {learned}
            <span className="stat-den"> / {stats.totalLessons}</span>
          </div>
          <div className="stat-label">已学课程</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{rate === null ? "—" : `${rate}%`}</div>
          <div className="stat-label">测试正确率</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{stats.mistakeActive}</div>
          <div className="stat-label">待掌握错题</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{stats.streak}</div>
          <div className="stat-label">连续学习天数</div>
        </div>
      </div>
      <p className="muted">
        已学完 {stats.learned} 课 · 待复习 {stats.review} 课 · 累计错题{" "}
        {stats.mistakeTotal} · 测试 {stats.quizCount} 次（答对 {stats.quizCorrect}
        /{stats.quizTotal} 题）
      </p>
    </div>
  );
}
