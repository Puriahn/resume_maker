import { create } from "zustand";

interface ResumeState {
  resumeData: any;
  initialData: any;
  setResumeData: (data: any) => void;
  markAsSaved: () => void;
  updateDynamicField: (
    name: string,
    section: string | null,
    value: string | any[]| FormData,
    id?: number,
  ) => void;
  addNewItem: (listName: "experiences" | "educations" | "skills") => void;
  removeItem: (
    listName: "experiences" | "educations" | "skills",
    id: number,
  ) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumeData: null,
  initialData: null, 

  setResumeData: (data) => set({ 
      resumeData: data, 
      initialData: JSON.parse(JSON.stringify(data)) 
  }),
  markAsSaved: () => set((state) => ({ 
      initialData: JSON.parse(JSON.stringify(state.resumeData)) 
  })),

  updateDynamicField: (name, section, value, id) =>
    set((state) => {
      if (!state.resumeData) return state;

      const newData = { ...state.resumeData };


      if (name === "skills" || name==="section_order") {
      newData[name] = value; 
    }
      else if (
        name === "experiences" ||
        name === "educations" 
      ) {
        if (Array.isArray(newData[name])) {
          if (newData[name].length > 0) {
            newData[name].forEach((item: any) => {
              if (section) {
                item[section] = value;
              }
            });
          }
          else if (section) {
            const newItem = {
              id: Date.now(), 
              [section]: value,
            };
            newData[name] = [newItem];
          }
        }
      }

      else if (name === "summary" || name === "personal_info") {
       if (!newData[name]) newData[name] = {};

        newData[name] = {
          ...newData[name],
          [section!]: value,
        };
      }

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
          [listName]: [
            ...(state.resumeData[listName] || []),
            defaults[listName],
          ],
        },
      };
    }),

  removeItem: (listName, id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [listName]: state.resumeData[listName].filter(
          (item: any) => item.id !== id,
        ),
      },
    })),
}));
