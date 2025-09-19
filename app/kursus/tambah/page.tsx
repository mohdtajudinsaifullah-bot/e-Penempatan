"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TambahKursusPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_kursus: "",
    anjuran: "",
    lokasi: "",
    tarikh_mula: "",
    tarikh_tamat: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const { error } = await supabase.from("kursus").insert([
      {
        user_id: userId,
        ...formData,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Gagal simpan kursus: " + error.message);
    } else {
      router.push("/kursus");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-lg"
      >
        <h1 className="text-xl font-bold text-center">Tambah Kursus</h1>

        <input
          type="text"
          name="nama_kursus"
          placeholder="Nama Kursus"
          value={formData.nama_kursus}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          name="anjuran"
          placeholder="Anjuran"
          value={formData.anjuran}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <select
          name="lokasi"
          value={formData.lokasi}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Pilih Negeri</option>
          <option>Wilayah Persekutuan Kuala Lumpur</option>
          <option>Wilayah Persekutuan Labuan</option>
          <option>Wilayah Persekutuan Putrajaya</option>
          <option>Johor</option>
          <option>Kedah</option>
          <option>Kelantan</option>
          <option>Melaka</option>
          <option>Negeri Sembilan</option>
          <option>Pahang</option>
          <option>Perak</option>
          <option>Perlis</option>
          <option>Pulau Pinang</option>
          <option>Sabah</option>
          <option>Sarawak</option>
          <option>Selangor</option>
          <option>Terengganu</option>
        </select>

        <input
          type="date"
          name="tarikh_mula"
          value={formData.tarikh_mula}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="date"
          name="tarikh_tamat"
          value={formData.tarikh_tamat}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/kursus")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
