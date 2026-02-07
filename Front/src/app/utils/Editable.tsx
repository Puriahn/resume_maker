"use client";
import { useState, useRef, useEffect } from "react";

export default function EditableText({
  initialValue,
  name,
  className,
  placeholder = "Click to edit...",
  maxLength = 200
}: {
  name:string;
  initialValue: string;
  className: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) adjustHeight();
  }, [isEditing, value]);

  const handleFinishEditing = () => setIsEditing(false);

  if (isEditing) {
    return (
      <div className="w-full relative">
        <textarea
          ref={textareaRef}
          autoFocus
          maxLength={maxLength} 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleFinishEditing}
          className={`${className} border-b-2 border-blue-500 outline-none bg-blue-50 w-full resize-none overflow-hidden block`}
          rows={1}
        />
        <span className="absolute -bottom-5 right-0 text-[10px] text-gray-400">
          {value.length} / {maxLength}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-gray-100 rounded px-1 transition-all min-h-[1.5em] whitespace-pre-wrap`}
    >
      {value.trim() === "" ? initialValue : value}
    </div>
  );
}
