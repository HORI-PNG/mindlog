"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";

export default function DailyLogPage() {
  const [studyHours, setStudyHours] = useState(2);
  const [focusLevel, setFocusLevel] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [caffeineAmount, setCaffeineAmount] = useState(1);
  const [mood, setMood] = useState("良い");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("ログインしていません。再度ログインしてください。");
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://mindlog-2nj7.onrender.com";

      // 日次データをJavaバックエンドへ送信
      const response = await fetch(`${API_BASE_URL}/api/daily-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          studyMinutes: studyHours * 60,
          focusLevel: Number(focusLevel),
          sleepHours: Number(sleepHours),
          caffeineAmount: Number(caffeineAmount),
          mood: mood,
        }),
      });

      if (!response.ok) {
        throw new Error("日次データの保存に失敗しました");
      }

      alert("本日のコンディションを保存しました");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("予期せぬエラーが発生しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">
          日次コンディションの記録
        </h1>
        <Link
          href="/"
          className="text-blue-500 hover:underline text-sm font-semibold"
        >
          ← ダッシュボードに戻る
        </Link>
      </div>

      <Card title="今日の学習・生活習慣を振り返る">
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* 学習時間スライダー */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              学習時間: <span className="text-blue-600">{studyHours}</span> 時間
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* 集中度セレクター */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              集中度 (1〜5)
            </label>
            <select
              value={focusLevel}
              onChange={(e) => setFocusLevel(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="1">⭐ 1 (あまり集中できなかった)</option>
              <option value="2">⭐⭐ 2 (やや散漫)</option>
              <option value="3">⭐⭐⭐ 3 (普通)</option>
              <option value="4">⭐⭐⭐⭐ 4 (集中できた)</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 (ゾーンに入った！)</option>
            </select>
          </div>

          {/* 睡眠時間 */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              睡眠時間 (時間)
            </label>
            <input
              type="number"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* カフェイン量 */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              カフェイン摂取量 (杯)
            </label>
            <input
              type="number"
              value={caffeineAmount}
              onChange={(e) => setCaffeineAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 気分 */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              今日の気分
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="良い">😊 良い</option>
              <option value="普通">😐 普通</option>
              <option value="疲れた">疲れた・不調</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-md ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "保存中..." : "日次データを保存する 📊"}
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}
