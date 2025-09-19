"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const negeriOptions = [
  "Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang",
  "Perak","Perlis","Pulau Pinang","Sabah","Sarawak","Selangor",
  "Terengganu","Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan","Wilayah Persekutuan Putrajaya"
];

export default function EditSejarahPage() {
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (id) {
      supabase.from("sejarah_perkhidmatan").select("*").eq("id", id).single()
        .then(({ data }) => setFormData(data));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("sejarah_perkhidmatan").update(formData).eq("id", id);
    if (error) {
      setError("Gagal kemaskini rekod.");
    } else {
      router.push("/sejarah");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Kemaskini Sejarah</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="jawatan" value={formData.jawatan} onChange={handleChange}
          placeholder="Jawatan" className="w-full border p-2 rounded" required />
        <input name="jabatan" value={formData.jabatan} onChange={handleChange}
          placeholder="Jabatan" className="w-full border p-2 rounded" required />
        <select name="lokasi" value={formData.lokasi} onChange={handleChange}
          className="w-full border p-2 rounded" required>
          {negeriOptions.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <input type="date" name="tarikh_lapor_diri" value={formData.tarikh_lapor_diri || ""}
          onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="date" name="tarikh_berpindah" value={formData.tarikh_berpindah || ""}
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
