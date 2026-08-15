"use client";

import { useEffect, useState } from "react";
import { ConcentrationChart } from "../../components/ConcentrationChart";
import { ReviewNotification } from "../../components/ReviewNotification";

// Java APIから返ってくる学習ログの型定義
interface LearningLog {
  id: string;
  date: string;
  focusLevel: number;
}

export default function DashboardPage() {
  const [labels, setLabels] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcentrationData = async () => {
      try {
        // LocalStorageなどからJWTトークンを取得
        const token = localStorage.getItem("token");

        // Javaバックエンドの学習ログ取得APIを実行
        const response = await fetch("http://localhost:8080/api/daily-logs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data: LearningLog[] = await response.json();

        // 昇順（古い日付 → 新しい日付）にソート
        const sortedData = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        // 過去7件分を抽出
        const recentLogs = sortedData.slice(-7);

        // Chart.js用に日付とスコアの配列を生成
        const formattedLabels = recentLogs.map((log) => {
          const d = new Date(log.date);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        });
        const formattedScores = recentLogs.map((log) => log.focusLevel);

        setLabels(formattedLabels);
        setScores(formattedScores);
      } catch (err) {
        console.error(err);
        setError("データの読み込み中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchConcentrationData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        MindLog ダッシュボード
      </h1>

      {/* 👇 追加：復習通知バナー（グラフの上に表示） */}
      <ReviewNotification />

      {/* グラフを表示するカード */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mt-6">
        {loading ? (
          <p className="text-gray-500 text-center py-10">
            データを読み込み中...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : labels.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            記録データがまだありません。
          </p>
        ) : (
          <ConcentrationChart labels={labels} scores={scores} />
        )}
      </div>
    </div>
  );
}
