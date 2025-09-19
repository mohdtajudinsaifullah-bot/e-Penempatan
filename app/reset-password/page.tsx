"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      setError("Email tidak wujud.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ password_hash: newPassword })
      .eq("id", user.id);

    if (error) {
      setError("Gagal reset kata laluan.");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Reset Kata Laluan</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="password"
          placeholder="Kata Laluan Baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Reset
        </button>
      </form>
    </div>
  );
}
