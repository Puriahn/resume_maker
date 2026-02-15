import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ResumeSection } from "./ResumeSection"; 
import Header from "./components/header";
import Summary from "./components/summary";
import Experience from "./components/experience";
import Education from "./components/education";
import Skills from "./components/skills";

interface ResumeProps {
  sections: any[];
  data: any; 
}

export default function Resume({ sections, data }: ResumeProps) {
  return (
    <main className="flex-1 p-3 md:p-10 flex justify-center overflow-y-auto">
      <div id="resume-content" className="bg-white w-[210mm] min-h-[297mm]  p-5 md:p-10" style={{
      minHeight: '297mm',
      backgroundImage: 'linear-gradient(to bottom, transparent 296.5mm, #e5e7eb 296.5mm, #e5e7eb 297mm)',
      backgroundSize: '100% 297mm'
    }}>
        
    
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map((section, index) => (
            <ResumeSection key={section} id={section}>
              <div className="py-3 text-gray-700">
                {section === "header" && <Header data={data} />}
                {section === "summary" && <Summary data={data}/>}
                {section === "experience" && <Experience data={data}/>}
                {section === "education" && <Education data={data}/>}
                {section === "skills" && <Skills/>}
              </div>

              {index !== sections.length - 1 && (
                <hr className="border-t border-gray-300 my-2 opacity-50" />
              )}
            </ResumeSection>
          ))}
        </SortableContext>
        
      </div>
    </main>
  );
}