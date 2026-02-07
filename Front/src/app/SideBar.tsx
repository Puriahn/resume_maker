"use client";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SidebarItem from "./SidebarItem";
import { useState } from "react";
export default function SideBar({ sections }: { sections: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
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
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col p-6">
          <h2 className="text-2xl font-bold text-blue-600 lg:mt-1 mt-10 mb-8">
            Resume Maker
          </h2>


          <nav className="flex-1">

            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((s) => (
                <SidebarItem key={s.id} id={s.id} label={s.label} />
              ))}
            </SortableContext>
          </nav>

          <div className="mt-auto pt-6 border-t">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
              Download PDF
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
