"use client";
import { useState } from "react";
import { useResumeStore } from "../store/store";
import { useEffect } from "react";

export default function Skills() {
  const updateField = useResumeStore((state) => state.updateDynamicField);
  const initialSkills = useResumeStore((state) => state.resumeData?.skills || []);
  const initial=initialSkills.length===0?["React", "Next.js", "Tailwind"]:initialSkills
  const [skills, setSkills] = useState<string[]>(initial);
  const addSkill = () => {
    setSkills([...skills, "New Skill"]);
  };
  useEffect(() => {
    updateField("skills", null, skills);
  }, [skills]);

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, newValue: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = newValue;
    setSkills(updatedSkills);
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-blue-700 text-lg md:text-xl mb-4 pb-1 uppercase tracking-wider">
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="group flex text-sm md:text-lg items-center bg-gray-100 border border-gray-200 px-3 py-1 rounded-full hover:border-blue-400 transition-all shadow-sm"
          >
            <input
              value={skill}
              suppressHydrationWarning
              onChange={(e) => updateSkill(index, e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-gray-700 w-auto min-w-[50px]"
              style={{ width: `${skill.length + 1}ch` }}
            />
            
            <button 
              onClick={() => removeSkill(index)}
              className="ml-2 text-gray-400 hover:text-red-500 opacity-50 group-hover:opacity-100 transition-opacity text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={addSkill}
          className="flex print:hidden items-center justify-center px-4 py-1 border-2 border-dashed border-gray-300 rounded-full text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all text-sm font-bold"
        >
          + Add
        </button>
      </div>
    </div>
  );
}