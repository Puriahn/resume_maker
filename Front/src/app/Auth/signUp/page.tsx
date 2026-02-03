"use client";
import { useState, useEffect } from "react";
import PhoneNumber from "./opt";
import { loginAction, FormState } from "./action";
import { useActionState } from "react";
import { getAccessToken } from "@/libb/token";
import { z } from "zod";

const signupSchema = z
  .object({
    email: z.string().email("ایمیل معتبر نیست"),
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکی نیستند",
    path: ["confirmPassword"], // خطا روی این فیلد نمایش داده شود
  });

const initialState: FormState = {
  error: null,
  success: null,
};

export default function signUp() {
  const [states, setStates] = useState(1);
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const [showCondirmPassword, setShowCondirmPassword] = useState(false);

  useEffect(() => {
    // یک تابع داخلی async ایجاد می‌کنیم
    const fetchToken = async () => {
      const x = await getAccessToken();
      console.log(x, "ssss"); // اینجا مقدار واقعی "ss" چاپ می‌شود
    };

    fetchToken();
  }, []); // این فقط یک بار موقع لود شدن اجرا می‌شود

  const toggleshowCondirmPasswordVisibility = () => {
    setShowCondirmPassword((prev) => !prev);
  };

  if (states == 1) {
    return (
      <div className="bg-[#ffffe3] h-screen pt-32">
        {" "}
        <div className=" px-4 py-10 bg-[#6d8196] shadow-lg rounded-3xl sm:p-20 mx-5 md:max-w-xl md:mx-auto">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login</h1>
            </div>
            <form action={formAction} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="text"
                    suppressHydrationWarning
                    className="peer placeholder-transparent text-white h-10 w-full border-b-2 border-gray-300 focus:outline-none focus:border-rose-600"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-100 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-300 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative mt-6">
                  <input
                    autoComplete="new-password"
                    suppressHydrationWarning
                    id="password"
                    name="password"
                    // در اینجا باید متغیر حالت (state) را برای تغییر بین text و password قرار دهی
                    type={showCondirmPassword ? "text" : "password"}
                    className="peer placeholder-transparent text-white h-10 w-full border-b-2 border-gray-300 focus:outline-none focus:border-rose-600 bg-transparent pr-10" // pr-10 برای اینکه متن زیر آیکون نرود
                    placeholder="Password"
                  />

                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-100 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-300 peer-focus:text-sm"
                  >
                    Password
                  </label>

                  {/* آیکون چشم - خارج از لیبل و با موقعیت مطلق در سمت راست */}
                  <div className="absolute right-0 top-2 cursor-pointer z-10">
                    <img
                      onClick={toggleshowCondirmPasswordVisibility}
                      src="https://img.icons8.com/ios-glyphs/30/visible--v1.png"
                      alt="Toggle Password Visibility"
                      className="opacity-70 hover:opacity-100 invert" // invert برای اینکه روی پس‌زمینه تیره سفید دیده شود
                      width="20"
                      height="20"
                    />
                  </div>
                </div>

                <div className="relative mt-6">
                  <input
                    autoComplete="new-password"
                    id="repeat password"
                    name="repeat password"
                    type="repeat password"
                    suppressHydrationWarning
                    className="peer placeholder-transparent text-white h-10 w-full border-b-2 border-gray-300 focus:outline-none focus:border-rose-600"
                    placeholder="repeat password"
                  />
                  <label
                    htmlFor="repeat password"
                    className="absolute left-0 -top-3.5 text-gray-100 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-300 peer-focus:text-sm"
                  >
                    Repeat Password
                  </label>
                </div>
                <div className="relative">
                  <button className="bg-cyan-500 text-white rounded-md px-2 py-1">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return <PhoneNumber />;
}
