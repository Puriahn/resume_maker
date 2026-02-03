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
  console.log(email, password);

  if (!email || !password) {
    return { error: "فیلدها نباید خالی باشند", success: null };
  }
  try {
    /* const response = await api.post("https://api.example.com/login", {
      email,
      password,
    }); */
    console.log("before");
    await setAccessToken("hello");
    console.log("after");
    return { success: "کوکی با موفقیت ذخیره شد", error: null };
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
