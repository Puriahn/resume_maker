"use server";
import axios from "axios";
import { setAccessToken, setRefreshToken } from "@/libb/token";
export type FormState = {
  error: string | null;
  success: string | null;
};

export async function loginAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
     const response = await fetch("http://127.0.0.1:8000/api/users/jwt/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.detail || data.message || "ایمیل یا رمز عبور اشتباه است",
        success: null,
      };
    }

    await setAccessToken(data.access);
    await setRefreshToken(data.refresh);
    return { success: "successed", error: null };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(error)
      const errorMessage =
        error.response?.data?.message ||
        "خطایی در برقراری ارتباط با سرور رخ داد";
      return {
        error: errorMessage,
        success: null,
      };
    }

    return {
      error: "یک خطای غیرمنتظره رخ داد",
      success: null,
    };
  }
}
