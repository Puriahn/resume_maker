import { create } from 'zustand';

interface ResumeState {
  resumeData: any;
  setResumeData: (data: any) => void;
  updateDynamicField: (name: string, section: string | null, value: string, id?: number) => void;
  addNewItem: (listName: "experiences" | "educations" | "skills") => void;
  removeItem: (listName: "experiences" | "educations" | "skills", id: number) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumeData: null,

  setResumeData: (data) => set({ resumeData: data }),

  updateDynamicField: (name, section, value, id) =>
    set((state) => {
      if (!state.resumeData) return state;

      // یک کپی عمیق از کل دیتا می‌گیریم
      const newData = { ...state.resumeData };

      // ۱. منطق مخصوص لیست‌ها (Experiences, Educations, Skills)
      if (name === "experiences" || name === "educations" || name === "skills") {
          if (Array.isArray(newData[name])) {
            console.log("inside ex and ed and skills")
          newData[name] = newData[name].map((item: any) =>
            item.id === id ? { ...item, [section!]: value } : item
          );
        }
      }
      
      // ۲. منطق مخصوص اشیاء تودرتو (Summary, Personal_info)
      else if (name === "summary" || name === "personal_info") {
        // اگر نال بود، تبدیل به آبجکت خالی کن تا کرش نکند
        if (!newData[name]) newData[name] = {};
        
        newData[name] = { 
          ...newData[name], 
          [section!]: value 
        };
      }
      
      // ۳. فیلدهای ریشه (مثل Job Title اگر بیرون از personal_info باشد)
      else {
        newData[name] = value;
      }

      return { resumeData: newData };
    }),

  addNewItem: (listName) =>
    set((state) => {
      if (!state.resumeData) return state;

      const newId = Date.now();
      const defaults: any = {
        experiences: { id: newId, company_name: "", info: "", date: "" },
        educations: { id: newId, institute_name: "", date: "" },
        skills: { id: newId, name: "" },
      };

      return {
        resumeData: {
          ...state.resumeData,
          [listName]: [...(state.resumeData[listName] || []), defaults[listName]],
        },
      };
    }),

  removeItem: (listName, id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [listName]: state.resumeData[listName].filter((item: any) => item.id !== id),
      },
    })),
}));