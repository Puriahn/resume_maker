import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
interface SidebarItemProps {
  id: string;
  label: string;
}
export default function SidebarItem({ id, label }: SidebarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
  transform: CSS.Translate.toString(transform),
  // فقط وقتی درگ نمی‌کنیم انیمیشن داشته باشه (برای وقتی که آیتم‌ها برمیگردن سر جاشون)
  transition: isDragging ? 'none' : transition, 
  touchAction: 'none',
  zIndex: isDragging ? 50 : 1,
  opacity: isDragging ? 0.8 : 1,
};

  return (
    <div
      ref={setNodeRef}
      style={style}
      
      className="p-3 bg-gray-50 rounded-lg select-none border-2 border-dashed border-gray-200  hover:border-blue-400 transition mb-4"
    >
      <span className="font-medium text-gray-700"> <span {...attributes}
      {...listeners} className=' cursor-move text-lg mr-1'>☰</span> {label}</span>
    </div>
  );
}