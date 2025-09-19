"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function KemaskiniPasangan() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    nama_pasangan: "",
    pekerjaan_pasangan: "",
    jabatan_pasangan: "",
    lokasi_pasangan: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("pasangan")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Gagal ambil data pasangan: " + error.message);
      } else if (data) {
        setFormData({
          nama_pasangan: data.nama_pasangan || "",
          pekerjaan_pasangan: data.pekerjaan_pasangan || "",
          jabatan_pasangan: data.jabatan_pasangan || "",
          lokasi_pasangan: data.lokasi_pasangan || "",
        });
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("pasangan")
      .update({
        nama_pasangan: formData.nama_pasangan,
        pekerjaan_pasangan: formData.pekerjaan_pasangan,
        jabatan_pasangan: formData.jabatan_pasangan,
        lokasi_pasangan: formData.lokasi_pasangan,
        updated_at: new Date(),
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert("Gagal kemaskini pasangan: " + error.message);
    } else {
      alert("Berjaya kemaskini pasangan!");
      router.push("/pasangan");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Kemaskini Pasangan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nama Pasangan</label>
          <input
            type="text"
            name="nama_pasangan"
            value={formData.nama_pasangan}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Pekerjaan</label>
          <input
            type="text"
            name="pekerjaan_pasangan"
            value={formData.pekerjaan_pasangan}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Jabatan</label>
          <input
            type="text"
            name="jabatan_pasangan"
            value={formData.jabatan_pasangan}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Lokasi</label>
          <select
            name="lokasi_pasangan"
            value={formData.lokasi_pasangan}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Pilih Lokasi --</option>
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
            <option value="Wilayah Persekutuan Kuala Lumpur">Wilayah Persekutuan Kuala Lumpur</option>
            <option value="Wilayah Persekutuan Putrajaya">Wilayah Persekutuan Putrajaya</option>
            <option value="Wilayah Persekutuan Labuan">Wilayah Persekutuan Labuan</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/pasangan")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
