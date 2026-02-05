import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ResumeSection } from "./ResumeSection"; // کامپوننتی که بالا ساختیم
import Header from "./components/header";
import Summary from "./components/summary";
import Experience from "./components/experience";
import Education from "./components/education";
import Skills from "./components/skills";

export default function Resume({ sections }: { sections: any[] }) {
  return (
    <main className="flex-1 p-3 md:p-10 flex justify-center overflow-y-auto">
      <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-12">
        
        {/* اضافه کردن Context برای انیمیشن‌های صفحه A4 */}
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section, index) => (
            <ResumeSection key={section.id} id={section.id}>
              <div className="py-3 text-gray-700">
                {section.id === "header" && <Header />}
                {section.id === "summary" && <Summary />}
                {section.id === "experience" && <Experience/>}
                {section.id === "education" && <Education/>}
                {section.id === "skills" && <Skills/>}
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