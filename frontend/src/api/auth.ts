import api from "../lib/axios";
import { User } from "../types/User";

export const logout = async () => {
  return api.post("/api/logout");
};

export async function fetchUser(): Promise<User | null> {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}
