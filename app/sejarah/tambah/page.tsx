"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const negeriList = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
  "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
  "Sarawak", "Selangor", "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Labuan",
];

export default function TambahSejarah() {
  const [jawatan, setJawatan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tarikhLapor, setTarikhLapor] = useState("");
  const [tarikhPindah, setTarikhPindah] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("Sesi pengguna tidak sah.");
      setLoading(false);
      return;
    }

    const { data: employee } = await supabase
      .from("employees")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!employee) {
      alert("Maklumat employee tidak dijumpai.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("sejarah_perkhidmatan").insert([
      {
        employee_id: employee.id,
        jawatan,
        jabatan,
        lokasi,
        tarikh_lapor_diri: tarikhLapor || null,
        tarikh_berpindah: tarikhPindah || null,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Gagal simpan rekod: " + error.message);
    } else {
      alert("Rekod berjaya disimpan!");
      router.push("/sejarah");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Tambah Sejarah Perkhidmatan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Jabatan"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Jawatan"
          value={jawatan}
          onChange={(e) => setJawatan(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <select
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Pilih Negeri --</option>
          {negeriList.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div>
          <label className="block text-sm font-medium">Tarikh Lapor Diri</label>
          <input
            type="date"
            value={tarikhLapor}
            onChange={(e) => setTarikhLapor(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tarikh Berpindah</label>
          <input
            type="date"
            value={tarikhPindah}
            onChange={(e) => setTarikhPindah(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/sejarah")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
