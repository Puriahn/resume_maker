import { setCookie, getCookie, deleteCookie, hasCookie } from "cookies-next";

/**
 * این تابع کمکی بررسی می‌کند که اگر در سمت سرور هستیم، 
 * هدرهای لازم برای دسترسی به کوکی‌ها را فراهم کند.
 */
const getOptions = async () => {
  if (typeof window === "undefined") {
    // ما فقط در سمت سرور به next/headers نیاز داریم
    const { cookies } = await import("next/headers");
    return { cookies };
  }
  return {}; // در سمت کلاینت نیازی به آپشن اضافه نیست
};

// --- تنظیمات توکن دسترسی (Access Token) ---

export const setAccessToken = async (token: string) => {
  console.log(token)
  const options = await getOptions();
  await setCookie("access_token", token, {
    ...options,
    maxAge: 60 * 60 * 24 * 7, // ۷ روز
    path: "/",
    sameSite: "lax",
    // secure: true, // در حالت HTTPS فعال شود
  });
};

export const getAccessToken = async () => {
  const options = await getOptions();
  const token = getCookie("access_token", options);
  return token ? token.toString() : null;
};

// --- تنظیمات توکن نوسازی (Refresh Token) ---

export const setRefreshToken = async (token: string) => {
  const options = await getOptions();
  await setCookie("refresh_token", token, {
    ...options,
    maxAge: 60 * 60 * 24 * 30, // ۳۰ روز
    path: "/",
    sameSite: "lax",
  });
};

export const getRefreshToken = async () => {
  const options = await getOptions();
  const token = getCookie("refresh_token", options);
  return token ? token.toString() : null;
};

// --- عملیات حذف و چک کردن ---

export const clearTokens = async () => {
  const options = await getOptions();
  deleteCookie("access_token", options);
  deleteCookie("refresh_token", options);
};

export const isAuthenticated = async () => {
  const options = await getOptions();
  return hasCookie("access_token", options);
};