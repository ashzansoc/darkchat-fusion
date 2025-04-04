import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main content */}
      <main className="flex-1 flex flex-col max-w-[1000px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
} 