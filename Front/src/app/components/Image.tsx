"use client";
import React, { useRef } from "react";
import { useResumeStore } from "./../store/store";
import { toast } from "sonner";
import { useState } from "react";

const ProfileImage = ({ data }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateDynamicField = useResumeStore(
    (state) => state.updateDynamicField,
  );

  const handleSvgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (file) {
    // ۱. نمایش پیش‌نمایش (همان روش قبلی شما درست است)
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // ۲. تبدیل فایل به Base64
    const reader = new FileReader();
    reader.readAsDataURL(file); // فایل را می‌خواند و به فرمت Data URL تبدیل می‌کند

    reader.onload = () => {
      const base64String = reader.result as string;
      
      // ۳. ارسال رشته Base64 به تابع آپدیت
      // حالا مقدار img دقیقاً همان چیزی می‌شود که API می‌خواهد
      updateDynamicField("personal_info", "img", base64String);
      
      console.log("Base64 آماده شد:", base64String);
    };

    reader.onerror = (error) => {
      console.error("خطا در تبدیل فایل:", error);
    };
  }
};
  console.log(preview)
  return (
    <div className="relative">
      {data.personal_info?.img ? (
        <img
          src={data.personal_info.img}
          alt="Profile"
          className="size-18 rounded-full mb-2 shadow-primay shadow-md"
        />
      ) : (
        <>
          <img
            alt="Logo"
            src={preview ?? "/profile.png"}
            className="size-18 md:size-20 rounded-full mb-2 shadow-primay shadow-md"
          />
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div className="w-7 h-7 print:hidden rounded-full absolute -bottom-0 left-3 bg-white border dark:bg-back mb-2 items-center flex justify-center cursor-pointer">
              <img
                onClick={handleSvgClick}
                width="18"
                height="18"
                src="https://img.icons8.com/ios/50/000000/camera--v4.png"
                alt="camera--v4"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileImage;
