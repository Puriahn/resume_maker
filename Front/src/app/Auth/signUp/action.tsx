"use server";
import axios from "axios";
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
    const response = await fetch("https://resume-maker-ahvd.onrender.com/api/users/register/", {
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
    const rawError = data.error || "";
    if (rawError.includes("Error While sending email")) {
      console.log("Ignoring email error, proceeding to OTP stage...");
      return { success: "email didnt send but successefull", error: null }; 
    }

    const errorMessage =
      data.email?.at(-1) ||
      data.password?.at(-1) ||
      data.detail || 
      data.error || 
      "An unexpected error occurred";

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
    console.log(error)
    return {
      error: "یک خطای غیرمنتظره رخ داد",
      success: null,
    };
  }
}
