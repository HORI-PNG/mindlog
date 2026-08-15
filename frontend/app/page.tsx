"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";

export default function Dashboard() {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 画面を開いたときに、Javaバックエンドからデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "ログインしていません。ログイン画面からやり直してください。",
          );
        }

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://mindlog-2nj7.onrender.com";

        const response = await fetch(`${API_BASE_URL}/api/diaries`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data = await response.json();
        setDiaries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            MindLog AI ダッシュボード
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            日々の学習とコンディションの記録プラットフォーム
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow"
        >
          ログアウト
        </button>
      </div>

      {/* アクションボタン用のカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/diary">
          <div className="p-6 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer">
            <h2 className="text-xl font-bold">📝 今日の一言日記を書く</h2>
            <p className="text-sm opacity-90 mt-1">
              思考や感情を言葉にしてAIに分析してもらいましょう
            </p>
          </div>
        </Link>

        <Link href="/daily">
          <div className="p-6 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer">
            <h2 className="text-xl font-bold">📊 コンディションを記録する</h2>
            <p className="text-sm opacity-90 mt-1">
              学習時間、集中度、生活習慣をトラッキング
            </p>
          </div>
        </Link>
      </div>

      {/* 過去の記録・日記一覧セクション */}
      <Card title="過去の振り返りとAIインサイト">
        {loading ? (
          <p className="text-gray-500 text-center py-6">
            データを読み込み中...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center py-6">{error}</p>
        ) : diaries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">まだ記録がありません。</p>
            <p className="text-sm text-gray-400">
              上のボタンから最初の日記を書いてみましょう！
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {diary.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {diary.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
                  {diary.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
