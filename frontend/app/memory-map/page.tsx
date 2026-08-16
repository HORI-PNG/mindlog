// frontend/app/memory-map/page.tsx
"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";

interface Diary {
  id: string;
  date: string;
  title: string;
  content: string;
  sentimentScore?: number;
  keywords?: string;
}

export default function MemoryMapPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://mindlog-2nj7.onrender.com";

  useEffect(() => {
    const fetchDiaries = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/api/diaries`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDiaries(data);
        }
      } catch (error) {
        console.error("日記一覧の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [API_BASE_URL]);

  // すべての抽出キーワードを収集・整理
  const allKeywords = Array.from(
    new Set(
      diaries
        .flatMap((d) => (d.keywords ? d.keywords.split(",") : []))
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    ),
  );

  // フィルタリング処理
  const filteredDiaries = diaries.filter((diary) => {
    const matchesSearch =
      diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diary.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag
      ? diary.keywords?.includes(selectedTag)
      : true;
    return matchesSearch && matchesTag;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🗺️ 思い出マップ</h1>
          <p className="text-gray-500 text-sm mt-1">
            AIが抽出したキーワードや検索で過去の体験・学びを俯瞰できます。
          </p>
        </div>

        {/* 検索バー */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="タイトルや本文から検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          />
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition"
            >
              タグ解除: #{selectedTag} ✕
            </button>
          )}
        </div>

        {/* AIキーワードクラウド */}
        <Card title="🏷️ AI抽出キーワードクラウド">
          {allKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allKeywords.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              キーワードタグは日記を入力・AI分析すると自動生成されます。
            </p>
          )}
        </Card>

        {/* タイムライン・結果一覧 */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">読み込み中...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDiaries.length > 0 ? (
              filteredDiaries.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {diary.date}
                    </span>
                    {diary.sentimentScore !== undefined && (
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        ポジティブ度: {(diary.sentimentScore * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    {diary.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {diary.content}
                  </p>
                  {diary.keywords && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {diary.keywords.split(",").map((k, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                        >
                          #{k.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-10 col-span-2">
                該当する記録が見つかりませんでした。
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
