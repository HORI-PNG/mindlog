"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";

export default function Diary() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 本物のAPI通信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("ログインしていません。再度ログインしてください。");
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://mindlog-2nj7.onrender.com";

      const response = await fetch(`${API_BASE_URL}/api/diaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error("日記の保存に失敗しました");
      }

      alert("データベースへの保存が完了しました！ ✨");
      setTitle("");
      setContent("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-800">
          今日の日記を書く
        </h1>
        <Link
          href="/"
          className="text-blue-500 hover:underline text-sm font-semibold"
        >
          ← ダッシュボードに戻る
        </Link>
      </div>

      <Card title="あなたの思考や感情を記録しましょう">
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="title"
            >
              タイトル
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="content"
            >
              日記の本文
            </label>
            <textarea
              id="content"
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isAnalyzing || !title || !content}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-md ${
                isAnalyzing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white hover:shadow-lg"
              }`}
            >
              {isAnalyzing ? "保存中..." : "保存してAIの分析を受ける ✨"}
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}
