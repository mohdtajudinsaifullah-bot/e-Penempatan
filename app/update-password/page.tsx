"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function UpdatePasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Kemas Kini Kata Laluan</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}

        <input
          type="password"
          placeholder="Kata Laluan Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
