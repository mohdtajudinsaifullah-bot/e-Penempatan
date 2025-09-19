"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

const negeriList = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
  "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
  "Sarawak", "Selangor", "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Putrajaya",
  "Wilayah Persekutuan Labuan",
];

export default function KemaskiniSejarah() {
  const [jawatan, setJawatan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tarikhLapor, setTarikhLapor] = useState("");
  const [tarikhPindah, setTarikhPindah] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setJawatan(data.jawatan || "");
        setJabatan(data.jabatan || "");
        setLokasi(data.lokasi || "");
        setTarikhLapor(data.tarikh_lapor_diri || "");
        setTarikhPindah(data.tarikh_berpindah || "");
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("sejarah_perkhidmatan")
      .update({
        jawatan,
        jabatan,
        lokasi,
        tarikh_lapor_diri: tarikhLapor || null,
        tarikh_berpindah: tarikhPindah || null,
      })
      .eq("id", params.id);

    setLoading(false);

    if (error) {
      alert("Gagal simpan rekod: " + error.message);
    } else {
      alert("Rekod berjaya dikemaskini!");
      router.push("/sejarah");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Kemaskini Sejarah Perkhidmatan
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
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
