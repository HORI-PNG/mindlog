"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 先ほど統一したAPIのベースURLを使用
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://mindlog-2nj7.onrender.com";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Javaバックエンドの新規登録APIを呼び出す
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error(
          "ユーザー登録に失敗しました。既に使われているメールアドレスの可能性があります。",
        );
      }

      // 登録成功時
      alert("ユーザー登録が完了しました！ログイン画面に移動します。");
      router.push("/login"); // ログイン画面へリダイレクト
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <Card title="MindLog AI に新規登録">
        <form onSubmit={handleSignUp} className="space-y-6 mt-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="MindLog 太郎"
            />
          </div>

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
              パスワード (6文字以上)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-3 px-4 rounded-xl transition-colors shadow-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "登録中..." : "アカウントを作成する"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちですか？{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-bold"
              >
                ログインはこちら
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </main>
  );
}
