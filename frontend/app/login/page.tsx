"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation"; // 画面遷移用

// 環境変数からベースURLを取得（設定されていない場合はローカルの8080を使用）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://mindlog-2nj7.onrender.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 2章で作成したJavaバックエンドのログインAPIを呼び出す
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Spring Boot側の要件に合わせてJSONを送信
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(
          "ログインに失敗しました。メールアドレスかパスワードが間違っています。",
        );
      }

      const data = await response.json();

      // 成功したら、取得したJWTトークンをブラウザのローカルストレージに保存
      localStorage.setItem("token", data.token); // ※APIのレスポンス形式に合わせてdata.token部分は調整が必要な場合があります

      alert("ログイン成功！ダッシュボードに移動します。");
      router.push("/"); // トップページへリダイレクト
    } catch (err: unknown) {
      // ▼ err が Error クラスのインスタンスかどうかを確認してから .message を使う
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <Card title="MindLog AI にログイン">
        <form onSubmit={handleLogin} className="space-y-6 mt-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              パスワード
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            ログイン
          </button>
        </form>
      </Card>
    </main>
  );
}
