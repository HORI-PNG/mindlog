"use client";

import { ConcentrationChart } from "../../components/ConcentrationChart";
import { ReviewNotification } from "../../components/ReviewNotification";
import useSWR from "swr"; //

interface LearningLog {
  id: string;
  date: string;
  focusLevel: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://mindlog-2nj7.onrender.com";

// fetcher関数を定義
const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }
  return response.json();
};

export default function DashboardPage() {
  // useEffectや複数のuseStateを削除し、useSWRで一元管理
  const { data, error, isLoading } = useSWR<LearningLog[]>(
    `${API_BASE_URL}/api/reviews/pending`,
    fetcher,
  );

  // 取得したデータをグラフ用にフォーマットする処理（データが存在する場合のみ実行）
  let labels: string[] = [];
  let scores: number[] = [];

  if (data) {
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const recentLogs = sortedData.slice(-7);

    labels = recentLogs.map((log) => {
      const d = new Date(log.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    scores = recentLogs.map((log) => log.focusLevel);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        MindLog ダッシュボード
      </h1>

      <ReviewNotification />

      <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mt-6">
        {isLoading ? (
          <p className="text-gray-500 text-center py-10">
            データを読み込み中...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">
            {error.message || "エラーが発生しました。"}
          </p>
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
