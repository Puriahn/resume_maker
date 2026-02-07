import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function ResumeSection({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition, // این همون انیمیشن نرمیه که دنبالشی
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}