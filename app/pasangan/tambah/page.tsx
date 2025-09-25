"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TambahPasangan() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Ambil user_id dari localStorage (hanya bila di client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("user_id");
      setUserId(id);
    }
  }, []);

  const [formData, setFormData] = useState({
    nama_pasangan: "",
    pekerjaan_pasangan: "",
    jabatan_pasangan: "",
    lokasi_pasangan: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Sesi pengguna tidak sah. Sila log masuk semula.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("pasangan").insert([
      {
        user_id: userId, // ✅ guna user_id
        nama_pasangan: formData.nama_pasangan,
        pekerjaan_pasangan: formData.pekerjaan_pasangan,
        jabatan_pasangan: formData.jabatan_pasangan,
        lokasi_pasangan: formData.lokasi_pasangan,
      },
    ]);

    setSaving(false);

    if (error) {
      console.error("❌ Ralat insert pasangan:", error.message);
      alert("Gagal simpan pasangan: " + error.message);
    } else {
      alert("Maklumat pasangan berjaya disimpan!");
      router.push("/pasangan");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Tambah Pasangan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Pasangan */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama Pasangan</label>
          <input
            type="text"
            name="nama_pasangan"
            value={formData.nama_pasangan}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Pekerjaan Pasangan */}
        <div>
          <label className="block text-sm font-medium mb-1">Pekerjaan Pasangan</label>
          <input
            type="text"
            name="pekerjaan_pasangan"
            value={formData.pekerjaan_pasangan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Jabatan Pasangan */}
        <div>
          <label className="block text-sm font-medium mb-1">Jabatan Pasangan</label>
          <input
            type="text"
            name="jabatan_pasangan"
            value={formData.jabatan_pasangan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Lokasi Pasangan */}
        <div>
          <label className="block text-sm font-medium mb-1">Lokasi Pasangan</label>
          <select
            name="lokasi_pasangan"
            value={formData.lokasi_pasangan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Pilih Negeri --</option>
            <option value="Johor">Johor</option>
            <option value="Kedah">Kedah</option>
            <option value="Kelantan">Kelantan</option>
            <option value="Melaka">Melaka</option>
            <option value="Negeri Sembilan">Negeri Sembilan</option>
            <option value="Pahang">Pahang</option>
            <option value="Perak">Perak</option>
            <option value="Perlis">Perlis</option>
            <option value="Pulau Pinang">Pulau Pinang</option>
            <option value="Sabah">Sabah</option>
            <option value="Sarawak">Sarawak</option>
            <option value="Selangor">Selangor</option>
            <option value="Terengganu">Terengganu</option>
            <option value="Wilayah Persekutuan Kuala Lumpur">
              Wilayah Persekutuan Kuala Lumpur
            </option>
            <option value="Wilayah Persekutuan Putrajaya">
              Wilayah Persekutuan Putrajaya
            </option>
            <option value="Wilayah Persekutuan Labuan">Wilayah Persekutuan Labuan</option>
          </select>
        </div>

        {/* Butang */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/pasangan")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
