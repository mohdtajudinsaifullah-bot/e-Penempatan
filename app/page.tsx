// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Auto-redirect user ke halaman log masuk
  redirect("/login");
  return null;
}
