"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
//import api from "@/app/utils/axios";

const forgotPassword = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear error as user types
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setError(""); // Clear error as user types
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  function handleChange(e) {
    if (step === 1) {
      setPhoneNumber(e.target.value);
    }
    if (step === 2) {
      setCode(e.target.value);
    }
  }

  const handleSubmit = async () => {
    if (phoneNumber?.length !== 11) {
      toast.error("شماره تلفن درست نمی باشد.");
      return;
    }
    if (code?.length !== 6 && step === 2) {
      toast.error("کد تایید باید 6 رقم باشد.");
      return;
    }

    if (password !== confirmPassword && step === 3) {
      toast.error("رمز عبور متفاوت می باشند.");
      return;
    } else if (password?.length < 8 && step === 3) {
      toast.error("رمز عبور باید بیشتر از 8 حرف باشد.");
      return;
    }
    try {
      setIsLoading(true);
      if (step === 1) {
        try {
          const response = await api.post("/password-reset/request/", {
            phone: phoneNumber,
          });
          toast.success("کد با موفقیت ارسال شد.");
          setIsLoading(false);
          setStep(2);
        } catch (error) {
          setIsLoading(false);
          console.error(error);
          toast.error("کد ارسال نشد لطفا دوباره تلاش کنید.");
        }
      }
      if (step === 2) {
        try {
          const response = await api.post("/password-reset/verify-otp/", {
            phone: phoneNumber,
            otp: code,
          });
          toast.success("کد تایید شد.");
          setIsLoading(false);
          setStep(3);
        } catch (error) {
          setIsLoading(false);
          console.error(error);
          toast.error("خطا در تایید کد...");
        }
      }
      if (step === 3) {
        const response = await api.post("/password-reset/reset/", {
          phone: phoneNumber,
          otp: code,
          new_password: password,
          confirm_password: confirmPassword,
        });
        setIsLoading(false);
        toast.success("رمز شما با موفقیت تغییر یافت.", {
          duration: 3000, // Toast duration in milliseconds
        });
        setTimeout(() => {
          window.location.href = "/authentication/login";
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.error);
      console.error(error);
    }
  };

  return (
    <div
      className={`min-h-dvh bg-white flex flex-col lg:flex-row justify-center  w-full text-right`}
    >
      <div
        className="rounded-md px-3 py-1 absolute flex flex-row-reverse right-8 top-4 items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        {/* <ArrowForward className=" text-lg " /> */}
        <p className=" text-sm">بازگشت</p>
      </div>

      <div
        className=" w-full flex flex-col h-screen justify-start p-10 pt-32 md:pt-64 lg:pr-0 shadow-lg "
        dir="rtl"
      >
        <div className=" rounded-lg pb-4 px-3 w-fit  min-w-64 md:min-w-96  h-fit mx-auto">
          <h1 className="text-xl font-semibold mb-4 text-center ">
            بازیابی رمز عبور
          </h1>

          {loginError && (
            <div className="p-3 text-orange-500 min-w-64 md:max-w-96 text-sm rounded ">
              {loginError}
            </div>
          )}
          <div className="mt-8">
            {step === 1 && (
              <div className="mb-4">
                <input
                  maxLength={11}
                  value={phoneNumber}
                  
                  type="text"
                  onChange={handleChange}
                  className={`w-full p-2 border text-sm rounded-lg ${
                    false
                      ? " border-red-500 bg-red-100  inputError shadow-[0_0_15px_5px_rgba(255,0,0,0.6)]"
                      : "placeholder-black text-black border-white dark:border-black"
                  }  focus:outline-none`}
                />
              </div>
            )}
            {step === 2 && (
              <div className="mb-4">
                <input
                  placeholder={" کد "}
                  type="text"
                  value={code}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg ${
                    false
                      ? " border-red-500 bg-red-100 inputError shadow-[0_0_15px_5px_rgba(255,0,0,0.6)]"
                      : "placeholder-black text-black border-white dark:border-black"
                  }  focus:outline-none`}
                />
              </div>
            )}
            {step === 3 && (
              <div className="mb-4">
                <div className="relative w-full">
                  <input
                    placeholder="رمز"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleChangePassword}
                    className={`w-full p-2 mb-4 border rounded-lg ${
                      error && password !== confirmPassword
                        ? "border-red-500 bg-red-100 inputError shadow-[0_0_15px_5px_rgba(255,0,0,0.6)]"
                        : "placeholder-black text-black border-white dark:border-black"
                    }  focus:outline-none`}
                  />
                  <input
                    placeholder="تایید رمز"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    className={`w-full p-2 border rounded-lg ${
                      error && password !== confirmPassword
                        ? "border-red-500 bg-red-100 inputError shadow-[0_0_15px_5px_rgba(255,0,0,0.6)]"
                        : "placeholder-black text-black border-white dark:border-black"
                    }  focus:outline-none`}
                  />
                  <img
                    onClick={togglePasswordVisibility}
                    src="https://img.icons8.com/ios-glyphs/30/visible--v1.png"
                    alt="Toggle Password Visibility"
                    className="absolute left-3 bottom-0 transform -translate-y-1/2 cursor-pointer"
                    width="20"
                    height="20"
                  />
                </div>
              </div>
            )}

            <div className="mx-auto text-center justify-start items-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className=" mx-auto shadow-md shadow-black text-sm justify-center text-center flex  cursor-pointer  rounded-lg  w-fit px-6 py-3"
              >
                {!isLoading ? (
                  <div>
                    {step === 1
                      ? "درخواست کد"
                      : step === 2
                      ? "ارسال کد"
                      : "ثبت"}
                  </div>
                ) : (
                  <img
                    src="https://img.icons8.com/dotty/80/auction.png"
                    alt="auction"
                    className="w-7 h-7 text-gray-200 animate-spin invert dark:invert-0"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forgotPassword;
