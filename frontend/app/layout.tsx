import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // 作成したヘッダーをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindLog AI",
  description: "AIが分析・予測するパーソナライズ型学習管理プラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-sky-50 text-gray-800`}>
        <Header /> {/* すべてのページの上部にヘッダーを表示 */}
        {children}
      </body>
    </html>
  );
}
