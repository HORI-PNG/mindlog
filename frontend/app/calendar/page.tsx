// frontend/app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";

interface Diary {
  id: string;
  date: string;
  title: string;
  content: string;
  sentimentScore?: number;
  keywords?: string;
}

interface DailyLog {
  id: string;
  date: string;
  studyHours: number;
  focusLevel: number;
  sleepHours: number;
  mood: string;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      try {
        const [diaryRes, logRes] = await Promise.all([
          fetch(`${API_BASE}/api/diaries`, { headers }),
          fetch(`${API_BASE}/api/daily-logs`, { headers }),
        ]);

        if (diaryRes.ok) {
          const diaryData = await diaryRes.json();
          setDiaries(diaryData);
        }
        if (logRes.ok) {
          const logData = await logRes.json();
          setDailyLogs(logData);
        }
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE]);

  // 選択された日付のデータをフィルタリング
  const selectedDiary = diaries.find((d) => d.date === selectedDate);
  const selectedLog = dailyLogs.find((l) => l.date === selectedDate);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📅 カレンダー振り返り
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              指定した日付のデータと日記を振り返ることができます。
            </p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          />
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">読み込み中...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* コンディション・学習ログ */}
            <Card title={`📊 ${selectedDate} のコンディション`}>
              {selectedLog ? (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">学習時間</span>
                    <span className="font-bold text-blue-600">
                      {selectedLog.studyHours} 時間
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">集中度</span>
                    <span className="font-bold text-amber-500">
                      {"★".repeat(selectedLog.focusLevel || 0)} (
                      {selectedLog.focusLevel}/5)
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">睡眠時間</span>
                    <span className="font-bold text-gray-700">
                      {selectedLog.sleepHours} 時間
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">気分</span>
                    <span className="font-bold text-gray-700">
                      {selectedLog.mood || "未記録"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6">
                  この日のコンディション記録はありません。
                </p>
              )}
            </Card>

            {/* 日記・AI分析 */}
            <Card title={`📖 ${selectedDate} の日記 & AIインサイト`}>
              {selectedDiary ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedDiary.title}
                  </h3>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedDiary.content}
                  </p>

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {selectedDiary.sentimentScore !== undefined && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-500">感情スコア:</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">
                          {(selectedDiary.sentimentScore * 100).toFixed(0)}%
                          Positive
                        </span>
                      </div>
                    )}
                    {selectedDiary.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedDiary.keywords.split(",").map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6">
                  この日の日記記録はありません。
                </p>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
