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

export default function AddSejarahPage() {
  const [formData, setFormData] = useState({
    jawatan: "",
    jabatan: "",
    lokasi: "",
    tarikh_lapor_diri: "",
    tarikh_berpindah: "",
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

    const { error } = await supabase.from("sejarah_perkhidmatan").insert([
      { ...formData, employee_id: userId },
    ]);

    if (error) {
      setError("Gagal simpan rekod.");
    } else {
      router.push("/sejarah");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Tambah Sejarah Perkhidmatan</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="jawatan" value={formData.jawatan} onChange={handleChange}
          placeholder="Jawatan" className="w-full border p-2 rounded" required />
        <input name="jabatan" value={formData.jabatan} onChange={handleChange}
          placeholder="Jabatan" className="w-full border p-2 rounded" required />
        <select name="lokasi" value={formData.lokasi} onChange={handleChange}
          className="w-full border p-2 rounded" required>
          <option value="">Pilih Lokasi</option>
          {negeriOptions.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <input type="date" name="tarikh_lapor_diri" value={formData.tarikh_lapor_diri}
          onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="date" name="tarikh_berpindah" value={formData.tarikh_berpindah}
          onChange={handleChange} className="w-full border p-2 rounded" />
        <div className="flex justify-between">
          <button type="button" onClick={() => router.push("/sejarah")}
            className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
          <button type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
        </div>
      </form>
    </div>
  );
}
