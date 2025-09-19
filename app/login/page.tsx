"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [noIc, setNoIc] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Semak user berdasarkan No IC & Password
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, no_ic, password_hash")
        .eq("no_ic", noIc)
        .eq("password_hash", password)
        .maybeSingle();

      if (userError || !user) {
        setError("No IC atau Kata Laluan salah.");
        return;
      }

      // ✅ Dapatkan employee_id berdasarkan user.id
      const { data: employee, error: empError } = await supabase
        .from("employees")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (empError) {
        setError("Ralat mendapatkan maklumat pekerja.");
        return;
      }

      if (employee) {
        // ✅ Simpan employee_id ke localStorage (boleh dipakai semua page)
        localStorage.setItem("employee_id", employee.id);
      }

      // ✅ Redirect ke dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Ralat tidak dijangka semasa log masuk.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Log Masuk</h1>

        {/* Input No IC */}
        <input
          type="text"
          placeholder="No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
          className="border rounded w-full p-2"
          required
        />

        {/* Input Password */}
        <input
          type="password"
          placeholder="Kata Laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Butang Log Masuk */}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
        >
          Log Masuk
        </button>

        {/* Link Daftar & Lupa Password */}
        <div className="flex justify-between text-sm">
          <a href="/signup" className="text-green-600 hover:underline">
            Daftar Baru
          </a>
          <a href="/reset-password" className="text-blue-600 hover:underline">
            Lupa Password?
          </a>
        </div>
      </form>
    </div>
  );
}
