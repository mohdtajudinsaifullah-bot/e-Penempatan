"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SejarahForm() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id"); // kalau ada = edit mode

  const [form, setForm] = useState({
    jabatan: "",
    jawatan: "",
    lokasi: "",
    tarikh_lapor_diri: "",
    tarikh_berpindah: "",
  });
  const [loading, setLoading] = useState(false);

  const negeriOptions = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Perak",
    "Perlis",
    "Pulau Pinang",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
    "Wilayah Persekutuan Kuala Lumpur",
    "Wilayah Persekutuan Putrajaya",
    "Wilayah Persekutuan Labuan",
  ];

  // fetch data kalau edit
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setForm({
          jabatan: data.jabatan || "",
          jawatan: data.jawatan || "",
          lokasi: data.lokasi || "",
          tarikh_lapor_diri: data.tarikh_lapor_diri || "",
          tarikh_berpindah: data.tarikh_berpindah || "",
        });
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const employee_id = localStorage.getItem("employee_id");
    if (!employee_id) {
      alert("Sesi pengguna tidak sah. Sila log masuk semula.");
      setLoading(false);
      return;
    }

    const payload = { ...form, employee_id };

    let res;
    if (id) {
      res = await supabase.from("sejarah_perkhidmatan").update(payload).eq("id", id);
    } else {
      res = await supabase.from("sejarah_perkhidmatan").insert([payload]);
    }

    if (res.error) {
      alert("Gagal simpan rekod: " + res.error.message);
    } else {
      router.push("/sejarah");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold text-blue-700 mb-4">
        {id ? "Kemaskini" : "Tambah"} Sejarah Perkhidmatan
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="jabatan"
          placeholder="Jabatan"
          value={form.jabatan}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="jawatan"
          placeholder="Jawatan"
          value={form.jawatan}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="lokasi"
          value={form.lokasi}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Pilih Negeri --</option>
          {negeriOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div>
          <label className="text-sm font-semibold">Tarikh Lapor Diri</label>
          <input
            type="date"
            name="tarikh_lapor_diri"
            value={form.tarikh_lapor_diri}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Tarikh Berpindah</label>
          <input
            type="date"
            name="tarikh_berpindah"
            value={form.tarikh_berpindah}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/sejarah")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
