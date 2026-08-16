"use client";

import React, { useEffect, useState } from "react";

interface ReviewItem {
  id: string;
  title: string;
  recommendedReviewDate: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mindlog-2nj7.onrender.com";

export const ReviewNotification: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        // テンプレートリテラルでURLを結合する
        const response = await fetch(`${API_BASE_URL}/api/reviews/pending`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.ok) {
          const data: ReviewItem[] = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("復習データの取得に失敗しました", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null; // データがない場合は何も表示しない
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-xl shadow-sm">
      <div className="flex items-center">
        <div className="ml-3">
          <p className="text-sm font-medium text-amber-800">
            忘却曲線に基づく復習のタイミングです！ ({reviews.length}
            件のアイテム)
          </p>
          <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
            {reviews.map((item) => (
              <li key={item.id}>
                <span className="font-semibold">{item.title}</span> (推奨復習日:{" "}
                {item.recommendedReviewDate})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
