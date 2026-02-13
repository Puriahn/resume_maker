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
import { toast } from "sonner";

export default function Home() {
  
  
  const [loading, setLoading] = useState(true);
  const resumeData = useResumeStore((state) => state.resumeData);
  const updateField = useResumeStore((state) => state.updateDynamicField);
  const defaultSections = ["header", "summary", "experience", "education", "skills"];
  
  const sections = resumeData?.section_order && resumeData.section_order.length > 0
    ? resumeData.section_order
    : defaultSections;

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

 const handleDragOver = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over && active.id !== over.id) {
    
    const currentSections = resumeData?.section_order || ["header", "summary", "experience", "education", "skills"];

    const oldIndex = currentSections.indexOf(active.id as string);
    const newIndex = currentSections.indexOf(over.id as string);

    const newOrder = arrayMove(currentSections, oldIndex, newIndex);

    updateField("section_order", null, newOrder);
  }
};
  const handleSave = async () => {
    try{
      const responde=await api.patch("profile/",resumeData)
      if (responde.status === 200 || responde.status === 201) {
      toast.success("Resume saved successfully!");}
    }catch (error) {
        console.error(error);
        toast.error("Failed to save changes. Please try again.");
      }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-linear-to-r from-pink-300 via-purple-300 to-indigo-400">
      
      <DndContext
        id="sidebar-dnd-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver} 
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SideBar sections={sections} />
      </DndContext>

      <main className="flex-1 p-5 flex justify-center overflow-y-auto">
         <Resume sections={sections} data={resumeData}/>
      </main>


      <button 
        onClick={handleSave}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all"
      >
        Save Changes
      </button>
      
    </div>
  );
}