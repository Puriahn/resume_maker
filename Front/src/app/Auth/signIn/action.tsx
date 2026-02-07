"use server";
import axios from "axios";
import api from "@/libb/axios";
import { redirect } from "next/navigation";
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
    const response = await api.post("/jwt/login/", {
      email: email,
      password: password
    });
    console.log(response)
    await setAccessToken(response.data.access)
    await setRefreshToken(response.data.refresh)
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
