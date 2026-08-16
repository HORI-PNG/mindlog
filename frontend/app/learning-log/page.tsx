"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";

export default function LearningLog() {
  // 入力データの状態管理
  const [studyTime, setStudyTime] = useState<number>(60);
  const [concentration, setConcentration] = useState<number>(3);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // フォーム送信処理（後ほどAPIと連携させる）
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `保存しました！\n学習時間: ${studyTime}分\n集中度: 星${concentration}\nタスク: ${isCompleted ? "完了" : "未完了"}`,
    );
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">
          本日の学習記録
        </h1>
        <Link
          href="/"
          className="text-blue-500 hover:underline text-sm font-semibold"
        >
          ← ダッシュボードに戻る
        </Link>
      </div>

      <Card title="学習データを入力">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 学習時間（スライダー） */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              学習時間:{" "}
              <span className="text-blue-600 text-xl">{studyTime}</span> 分
            </label>
            <input
              type="range"
              min="0"
              max="240"
              step="10"
              value={studyTime}
              onChange={(e) => setStudyTime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* 2. 集中度（星評価風のボタン選択） */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              集中度（5段階）
            </label>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setConcentration(star)}
                  className={`w-10 h-10 rounded-full font-bold text-lg transition-colors ${
                    concentration >= star
                      ? "bg-yellow-400 text-white shadow-sm"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 3. タスク管理（チェックボックス） */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-bold">
                本日の目標タスクをすべて完了した
              </span>
            </label>
          </div>

          {/* 送信ボタン */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              記録を保存する
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}
