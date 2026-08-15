import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        {/* ロゴ部分 */}
        <div className="text-2xl font-bold mb-4 md:mb-0 text-center md:text-left">
          <Link href="/">
            MindLog AI
            <span className="text-sm font-normal block mt-1">
              マインドログ AI
            </span>
          </Link>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex space-x-4 md:space-x-8 text-sm md:text-base font-semibold justify-center">
          <Link href="/" className="hover:text-blue-200 transition-colors">
            TOP
          </Link>
          <Link
            href="/learning-log"
            className="hover:text-blue-200 transition-colors"
          >
            学習記録
          </Link>
          <Link href="/diary" className="hover:text-blue-200 transition-colors">
            日記
          </Link>
          <Link
            href="/memory-map"
            className="hover:text-blue-200 transition-colors"
          >
            思い出マップ
          </Link>
          <Link
            href="/notifications"
            className="hover:text-blue-200 transition-colors"
          >
            通知
          </Link>
          <Link
            href="/login"
            className="hover:text-blue-200 transition-colors border border-white px-3 py-1 rounded-full"
          >
            ログイン
          </Link>
        </nav>
      </div>
    </header>
  );
}
