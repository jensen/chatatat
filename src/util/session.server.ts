import { createCookieSessionStorage } from "remix";

let cookieSessionKeyA = process.env.COOKIE_SESSION_KEY_A;
let cookieSessionKeyB = process.env.COOKIE_SESSION_KEY_B;

if (cookieSessionKeyA && typeof cookieSessionKeyA !== "string") {
  throw new Error("Most provide COOKIE_SESSION_KEY_A");
}

if (cookieSessionKeyB && typeof cookieSessionKeyB !== "string") {
  throw new Error("Most provide COOKIE_SESSION_KEY_B");
}

const LENGTH = 604_800;

export default function create() {
  return createCookieSessionStorage({
    cookie: {
      name: "auth",
      expires: new Date(Date.now() + LENGTH * 1000),
      httpOnly: true,
      maxAge: LENGTH,
      path: "/",
      sameSite: "lax",
      secrets: [cookieSessionKeyA, cookieSessionKeyB],
      secure: true,
    },
  });
}
