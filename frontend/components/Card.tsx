import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
        {title}
      </h2>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
