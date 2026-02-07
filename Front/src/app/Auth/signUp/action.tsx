"use server";
import axios from "axios";
import api from "@/libb/axios";
import { redirect } from "next/navigation";
import { setAccessToken } from "@/libb/token";
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
    const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        password2: password,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      console.log("Django Error:", data);

      const errorMessage =
        data.email?.at(-1) ||
        data.password?.at(-1) ||
        data.detail ;
      return { success: null, error: errorMessage };
    }

    return { success: "successed", error: null };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
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
