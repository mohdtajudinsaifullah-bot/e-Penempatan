"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [nama, setNama] = useState("");
  const [noIc, setNoIc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("no_ic", noIc)
      .maybeSingle();

    if (existing) {
      setError("No IC sudah wujud. Sila hubungi admin.");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ nama, no_ic: noIc, email, password_hash: password }])
      .select()
      .single();

    if (error || !data) {
      setError("Gagal daftar akaun.");
      return;
    }

    await supabase.from("employees").insert([
      { user_id: data.id, nama, no_ic: noIc, email },
    ]);

    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Daftar Akaun Baru</h1>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="text"
          placeholder="No IC"
          value={noIc}
          onChange={(e) => setNoIc(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
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
          placeholder="Kata Laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Daftar Akaun
        </button>
      </form>
    </div>
  );
}
