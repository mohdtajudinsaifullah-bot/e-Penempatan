"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [noIC, setNoIC] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Cari email berdasarkan IC
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select("email")
      .eq("no_ic", noIC)
      .maybeSingle();

    if (empError || !employee) {
      setError("No IC tidak wujud dalam sistem.");
      return;
    }

    // Hantar link reset ke email sebenar
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      employee.email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (resetError) {
      setError("Ralat: " + resetError.message);
    } else {
      setMessage("Link reset kata laluan dihantar ke emel anda.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Lupa Kata Laluan</h1>
        <input
          type="text"
          value={noIC}
          onChange={(e) => setNoIC(e.target.value)}
          placeholder="Masukkan No IC"
          required
          className="border p-2 w-full rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Set Semula Kata Laluan
        </button>
      </form>
    </div>
  );
}
