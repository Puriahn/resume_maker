"use client";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SidebarItem from "./SidebarItem";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/libb/token";

export default function SideBar({ sections }: { sections: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // ۱. پاک کردن توکن‌ها
    await clearTokens();
    
    // ۲. رفرش کردن روتر (برای اینکه مطمئن بشیم دیتای کش شده پاک میشه)
    router.refresh();

    // ۳. هدایت به صفحه ورود
    router.replace("/Auth/signIn"); // یا /login
  };
  return (
    <div className="min-h-screen flex">
      {/* دکمه همبرگری فقط برای موبایل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md flex items-center justify-center h-10 w-10"
      >
        <div className="relative w-6 h-6">
          {/* خط اول */}
          <span
            className={`absolute left-0 h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isOpen ? "rotate-45 top-3" : "top-1"
            }`}
          ></span>
          {/* خط دوم (وسط) */}
          <span
            className={`absolute left-0 h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-0" : "top-3"
            }`}
          ></span>
          {/* خط سوم */}
          <span
            className={`absolute left-0 h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isOpen ? "-rotate-45 top-3" : "top-5"
            }`}
          ></span>
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0  left-0 z-40 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-screen flex flex-col p-6">
          <h2 className="text-2xl font-bold text-blue-600 lg:mt-1 mt-10 mb-8">
            Resume Maker
          </h2>


          <nav className="flex-1">

            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((s) => (
                <SidebarItem key={s} id={s} label={s} />
              ))}
            </SortableContext>
          </nav>

          <div className="mt-auto pt-6 border-t space-y-3">
      {/* دکمه دانلود (قبلی) */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
        Download PDF
      </button>

      {/* دکمه خروج (جدید) */}
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg font-bold border border-red-100 hover:bg-red-100 transition-colors"
      >
        <span>Log Out</span>
        {/* آیکون خروج (اختیاری) */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-2.062a.5.5 0 0 0 0-.708L15.75 12" />
        </svg>
      </button>
    </div>
        </div>
      </aside>
    </div>
  );
}
