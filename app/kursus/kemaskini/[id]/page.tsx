"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function KemaskiniKursusPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    nama_kursus: "",
    anjuran: "",
    lokasi: "",
    tarikh_mula: "",
    tarikh_tamat: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      supabase.from("kursus").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setFormData(data);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("kursus").update(formData).eq("id", id);

    setLoading(false);

    if (error) {
      alert("Gagal kemaskini kursus: " + error.message);
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
        <h1 className="text-xl font-bold text-center">Kemaskini Kursus</h1>

        <input
          type="text"
          name="nama_kursus"
          value={formData.nama_kursus}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          name="anjuran"
          value={formData.anjuran || ""}
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
          value={formData.tarikh_mula || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="date"
          name="tarikh_tamat"
          value={formData.tarikh_tamat || ""}
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Mengemaskini..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
