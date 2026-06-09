import { setCookie, getCookie, deleteCookie, hasCookie } from "cookies-next";

const getOptions = async () => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    return { cookies };
  }
  return {};
};



export const setAccessToken = async (token: string) => {
  const options = await getOptions();
  await setCookie("access_token", token, {
    ...options,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",

  });
};

export const getAccessToken = async () => {
  const options = await getOptions();
  const token = getCookie("access_token", options);
  return token ? token.toString() : null;
};


export const setRefreshToken = async (token: string) => {
  const options = await getOptions();
  await setCookie("refresh_token", token, {
    ...options,
    maxAge: 60 * 60 * 24 * 30, 
    path: "/",
    sameSite: "lax",
  });
};

export const getRefreshToken = async () => {
  const options = await getOptions();
  const token = getCookie("refresh_token", options);
  return token ? token.toString() : null;
};


export const clearTokens = async () => {
  const options = await getOptions();
  deleteCookie("access_token", options);
  deleteCookie("refresh_token", options);
};

export const isAuthenticated = async () => {
  const options = await getOptions();
  return hasCookie("access_token", options);
};