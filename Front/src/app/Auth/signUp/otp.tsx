"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OtpProps {
  email: string;
}

export default function Otp({email}:OtpProps) {

  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [counter, setCounter] = useState(120); 
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 

    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); 
    }
  }, [counter]);

  if (!isClient) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  

  const handleVerify = async () => {
  const code = otp.join("");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: code,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("تایید موفقیت‌آمیز:", data);
      toast.success("ثبت‌نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...");

      // هدایت کاربر بعد از ۳ ثانیه (۳۰۰۰ میلی‌ثانیه)
      setTimeout(() => {
        router.push("/Auth/signIn");
      }, 3000);

    } else {
      toast.error(data.message || "کد وارد شده صحیح نیست");
    }
  } catch (error) {
    console.error("خطا در برقراری ارتباط:", error);
    toast.error("خطایی در اتصال به سرور رخ داد");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen  bg-linear-to-r from-pink-300 via-purple-300 to-indigo-400 pt-10">
      <div className=" rounded-3xl w-full max-w-md overflow-hidden ">
        <div className=" text-center">
          <span className="countdown font-mono text-6xl text-blue-800">
            <span
              style={
                {
                  "--value": counter,
                  "--digits": 2,
                } as React.CSSProperties
              }
              aria-live="polite"
              aria-label={`${counter} seconds remaining`}
            >
              {counter}
            </span>
          </span>

          <h2 className="text-2xl font-bold mb-2 mt-5 text-black">
            Verify OTP
          </h2>
          <p className="text-sm text-black mb-6">
            Enter the 6-digit code sent to your phone
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                suppressHydrationWarning
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-14 md:w-12 md:h-16 text-center text-2xl border-2 border-black rounded-xl 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                            text-white transition-all duration-300 hover:scale-110"
              />
            ))}
          </div>

          <div className="text-sm text-black  mb-6">
            Didn't receive code?{" "}
            <button className="text-blue-800 hover:underline font-medium">
              Resend OTP
            </button>
          </div>

          <button
            disabled={otp.some((v) => v === "")}
            onClick={handleVerify}
            className="w-fit md:w-full px-4 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                       transition-all duration-300 active:scale-95
                       dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/30"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}
