"use client";
import { useState, useEffect, startTransition } from "react";
import { loginAction, FormState } from "./action";
import { useActionState } from "react";
import { getAccessToken } from "@/libb/token";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupInput = z.infer<typeof signupSchema>;

const initialState: FormState = {
  error: null,
  success: null,
};

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    console.log(state);

    if (state?.success) {
      toast.success("Login successful!");

      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const processForm = (data: SignupInput) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="bg-linear-to-r from-pink-300 via-purple-300 to-indigo-400 h-screen pt-32">
      <div className="px-4 py-10 rounded-3xl sm:p-20 mx-5 md:max-w-xl md:mx-auto backdrop-blur-md">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl text-black font-semibold">Sign Up</h1>

          <form
            onSubmit={handleSubmit(processForm)}
            className="divide-y divide-gray-200"
          >
            <div className="py-8 text-base leading-6 text-gray-800 space-y-4 sm:text-lg sm:leading-7">
              <div className="relative">
                <input
                  autoComplete="email"
                  {...register("email")}
                  type="text"
                  id="email"
                  suppressHydrationWarning
                  className="peer placeholder-transparent h-10 w-full border-b border-gray-500 focus:outline-none focus:border-black bg-transparent"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-focus:-top-3.5"
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative mt-6">
                <input
                  autoComplete="new-password"
                  {...register("password")}
                  id="password"
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  className="peer placeholder-transparent h-10 w-full border-b border-gray-500 focus:outline-none focus:border-black bg-transparent pr-10"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-focus:-top-3.5"
                >
                  Password
                </label>
                <div
                  className="absolute right-0 top-2 cursor-pointer z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src="https://img.icons8.com/ios-glyphs/30/visible--v1.png"
                    width="20"
                    className="opacity-70"
                    alt="toggle"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative pt-4">
                <button
                  disabled={isPending || !!state?.success}
                  className="bg-cyan-500 text-white rounded-md px-4 py-2 disabled:bg-gray-400 w-full transition-colors"
                >
                  {isPending
                    ? "pending..."
                    : state?.success
                      ? "Redirecting..."
                      : "SignIn"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
