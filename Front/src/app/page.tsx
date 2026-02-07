"use client";
import { useState } from "react";
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

export default function Home() {
  const [sections, setSections] = useState([
    { id: "header", label: "Personal Info" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
  ]);

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  }),
  useSensor(TouchSensor, {
    // این بخش خیلی مهمه:
    activationConstraint: {
      delay: 250, // باید ۲۵۰ میلی‌ثانیه انگشت رو نگه داره تا درگ شروع بشه
      tolerance: 5, // اگه انگشتش لرزید و بیشتر از ۵ پیکسل تکون خورد، درگ کنسل بشه و اسکرول کنه
    },
  })
);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      id="resume-dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <div className="flex min-h-screen bg-linear-to-r from-pink-300 via-purple-300 to-indigo-400">
        <SideBar sections={sections} />
        <Resume sections={sections} />
      </div>
    </DndContext>
  );
}
