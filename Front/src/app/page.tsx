"use client";
import { useState, useEffect } from "react";
import Resume from "./resume";
import SideBar from "./SideBar";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import api from "@/libb/axios";
import { useResumeStore } from "./store/store";

export default function Home() {
  const [sections, setSections] = useState([
    { id: "header", label: "Personal Info" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
  ]);
  const [loading, setLoading] = useState(true);
  const resumeData = useResumeStore((state) => state.resumeData);
  const updateField = useResumeStore((state) => state.updateDynamicField);

  console.log(resumeData,"tamam")
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get("profile/");
        useResumeStore.getState().setResumeData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

   useEffect(() => {
    updateField("section_order", null, sections);
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // ۲. جابه‌جایی در لحظه (همزمان شدن سایدبار و رزومه)
  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-linear-to-r from-pink-300 via-purple-300 to-indigo-400">
      
      {/* محدوده درگ فقط برای سایدبار تعریف شده تا گیج نزند */}
      <DndContext
        id="sidebar-dnd-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver} // عامل حرکت همزمان
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SideBar sections={sections} />
      </DndContext>

      {/* رزومه خارج از کانتکست است اما چون استیت sections را می‌گیرد، همزمان تغییر می‌کند */}
      <main className="flex-1 p-5 flex justify-center overflow-y-auto">
         <Resume sections={sections} data={resumeData}/>
      </main>

      {/* دکمه ذخیره کلی (اختیاری) */}
      <button 
        onClick={() => console.log("Final Save:", resumeData, sections)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all"
      >
        Save Changes
      </button>
      
    </div>
  );
}