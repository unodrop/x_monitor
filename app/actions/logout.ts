"use server";

import { removeAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout() {
  await removeAuthToken();
  redirect("/login");
}

