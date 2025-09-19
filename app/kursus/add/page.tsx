"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const negeriOptions = [
  "Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang",
  "Perak","Perlis","Pulau Pinang","Sabah","Sarawak","Selangor",
  "Terengganu","Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan","Wilayah Persekutuan Putrajaya"
];

export default function AddKursusPage() {
  const [formData, setFormData] = useState({
    nama_kursus: "",
    anjuran: "",
    lokasi: "",
    tarikh_mula: "",
    tarikh_tamat: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("Sesi tidak sah. Sila log masuk semula.");
      return;
    }

    const { error } = await supabase.from("kursus").insert([
      { ...formData, user_id: userId },
    ]);

    if (error) {
      setError("Gagal simpan kursus.");
    } else {
      router.push("/kursus");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Tambah Kursus</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="nama_kursus" value={formData.nama_kursus} onChange={handleChange}
          placeholder="Nama Kursus" className="w-full border p-2 rounded" required />
        <input name="anjuran" value={formData.anjuran} onChange={handleChange}
          placeholder="Anjuran" className="w-full border p-2 rounded" required />
        <select name="lokasi" value={formData.lokasi} onChange={handleChange}
          className="w-full border p-2 rounded" required>
          <option value="">Pilih Lokasi</option>
          {negeriOptions.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <input type="date" name="tarikh_mula" value={formData.tarikh_mula}
          onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="date" name="tarikh_tamat" value={formData.tarikh_tamat}
          onChange={handleChange} className="w-full border p-2 rounded" required />
        <div className="flex justify-between">
          <button type="button" onClick={() => router.push("/kursus")}
            className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
          <button type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
        </div>
      </form>
    </div>
  );
}
