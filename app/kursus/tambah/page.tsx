"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NEGERI = [
  "Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang","Perak","Perlis",
  "Pulau Pinang","Sabah","Sarawak","Selangor","Terengganu",
  "Wilayah Persekutuan Kuala Lumpur","Wilayah Persekutuan Putrajaya","Wilayah Persekutuan Labuan",
];

export default function TambahKursusPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nama_kursus: "",
    anjuran: "",
    lokasi: "",
    tarikh_mula: "",
    tarikh_tamat: "",
  });

  useEffect(() => {
    // pastikan hanya baca localStorage di client
    if (typeof window !== "undefined") {
      setEmployeeId(localStorage.getItem("employee_id"));
    }
  }, []);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) {
      alert("Sesi pengguna tidak sah. Sila log masuk semula.");
      return;
    }
    setSaving(true);

    const { error } = await supabase.from("kursus").insert([
      {
        employee_id: employeeId,
        nama_kursus: form.nama_kursus,
        anjuran: form.anjuran,
        lokasi: form.lokasi,
        tarikh_mula: form.tarikh_mula || null,
        tarikh_tamat: form.tarikh_tamat || null,
      },
    ]);

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan kursus: " + error.message);
    } else {
      alert("Kursus berjaya disimpan!");
      router.push("/kursus");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Tambah Kursus</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Kursus</label>
          <input
            name="nama_kursus"
            value={form.nama_kursus}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="Contoh: Asas Pengurusan Rekod"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Anjuran</label>
          <input
            name="anjuran"
            value={form.anjuran}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="Contoh: JKSM / JAKIM / INTAN"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <select
            name="lokasi"
            value={form.lokasi}
            onChange={onChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Pilih Negeri --</option>
            {NEGERI.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tarikh Mula</label>
            <input
              type="date"
              name="tarikh_mula"
              value={form.tarikh_mula}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tarikh Tamat</label>
            <input
              type="date"
              name="tarikh_tamat"
              value={form.tarikh_tamat}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/kursus"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </Link>
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
