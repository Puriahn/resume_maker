import { create } from 'zustand';

interface ResumeState {
  resumeData: any;
  setResumeData: (data: any) => void;
  // تابع هوشمند برای آپدیت فیلدهای ساده، اشیاء تودرتو و لیست‌ها
  updateDynamicField: (name: string, section: string | null, value: string, id?: number) => void;
  // تابع برای اضافه کردن آیتم جدید به لیست‌ها (با فیلدهای پیش‌فرض)
  addNewItem: (listName: "experiences" | "educations" | "skills") => void;
  // تابع برای حذف یک آیتم از لیست‌ها
  removeItem: (listName: "experiences" | "educations" | "skills", id: number) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumeData: null,

  setResumeData: (data) => set({ resumeData: data }),

  updateDynamicField: (name, section, value, id) => set((state) => {
    if (!state.resumeData) return state;

    const newData = { ...state.resumeData };

    // ۱. آپدیت لیست‌ها (experiences, educations, skills) بر اساس ID
    if (Array.isArray(newData[name]) && id !== undefined) {
      newData[name] = newData[name].map((item: any) =>
        item.id === id ? { ...item, [section!]: value } : item
      );
    } 
    // ۲. آپدیت اشیاء تودرتو (personal_info و summary)
    else if (section && typeof newData[name] === 'object' && newData[name] !== null) {
      newData[name] = { ...newData[name], [section]: value };
    } 
    // ۳. آپدیت فیلدهای ریشه (مثل section_order)
    else {
      newData[name] = value;
    }

    return { resumeData: newData };
  }),

  addNewItem: (listName) => set((state) => {
    if (!state.resumeData) return state;

    // تعریف ساختار اولیه برای هر بخش جهت جلوگیری از ارور
    const defaults = {
      experiences: { id: Date.now(), company_name: "", info: "", date: "" },
      educations: { id: Date.now(), institute_name: "", date: "" },
      skills: { id: Date.now(), name: "" }
    };

    return {
      resumeData: {
        ...state.resumeData,
        [listName]: [...(state.resumeData[listName] || []), defaults[listName]]
      }
    };
  }),

  removeItem: (listName, id) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      [listName]: state.resumeData[listName].filter((item: any) => item.id !== id)
    }
  })),
}));