"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const NEGERI = [
  "Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang",
  "Perak","Perlis","Pulau Pinang","Sabah","Sarawak","Selangor",
  "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan",
  "Wilayah Persekutuan Putrajaya",
];

type EmpForm = {
  nama: string;
  no_ic: string;
  email: string;
  tarikh_lantikan: string;
  jabatan_sem: string;
  jawatan_sem: string;
  lokasi: string;             // Kolum huruf besar
  alamat_semasa: string;
};

export default function EmployeeEditPage() {
  const router = useRouter();
  const [empId, setEmpId] = useState<string>("");
  const [form, setForm] = useState<EmpForm>({
    nama: "",
    no_ic: "",
    email: "",
    tarikh_lantikan: "",
    jabatan_sem: "",
    jawatan_sem: "",
    lokasi: "",
    alamat_semasa: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const employeeId = localStorage.getItem("employee_id") || "";
      setEmpId(employeeId);

      if (!employeeId) {
        // fallback guna user_id
        const userId = localStorage.getItem("user_id") || "";
        const r = await supabase
          .from("employees")
          .select('id')
          .eq("user_id", userId)
          .maybeSingle();
        if (r.data?.id) {
          localStorage.setItem("employee_id", r.data.id);
          setEmpId(r.data.id);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!empId) return;
      const { data, error } = await supabase
        .from("employees")
        .select('nama,no_ic,email,tarikh_lantikan,jabatan_sem,jawatan_sem,"lokasi",alamat_semasa')
        .eq("id", empId)
        .maybeSingle();
      if (data && !error) {
        setForm({
          nama: data.nama ?? "",
          no_ic: data.no_ic ?? "",
          email: data.email ?? "",
          tarikh_lantikan: data.tarikh_lantikan ?? "",
          jabatan_sem: data.jabatan_sem ?? "",
          jawatan_sem: data.jawatan_sem ?? "",
          lokasi: (data as any)?.lokasi ?? "",
          alamat_semasa: data.alamat_semasa ?? "",
        });
      }
    })();
  }, [empId]);

  const update = (k: keyof EmpForm, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId) {
      alert("ID pekerja tiada. Sila log masuk semula.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("employees")
      .update({
        nama: form.nama,
        no_ic: form.no_ic,
        email: form.email,
        tarikh_lantikan: form.tarikh_lantikan || null,
        jabatan_sem: form.jabatan_sem || null,
        jawatan_sem: form.jawatan_sem || null,
        // Kolum 'lokasi' huruf besar – perlu hantar dengan key yang sama
        ["lokasi"]: form.lokasi || null,
        alamat_semasa: form.alamat_semasa || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", empId);

    setSaving(false);
    if (error) {
      alert("Gagal simpan: " + error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Kemaskini Profil</h1>

      <form onSubmit={onSave} className="space-y-5 rounded-xl border bg-white/70 p-6 backdrop-blur">
        {/* 1. Nama penuh */}
        <div>
          <label className="mb-1 block text-sm font-medium">Nama Penuh</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={form.nama}
            onChange={(e) => update("nama", e.target.value)}
          />
        </div>

        {/* 2. No Kad Pengenalan */}
        <div>
          <label className="mb-1 block text-sm font-medium">No Kad Pengenalan</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={form.no_ic}
            onChange={(e) => update("no_ic", e.target.value)}
          />
        </div>

        {/* 3. Emel */}
        <div>
          <label className="mb-1 block text-sm font-medium">Emel</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        {/* 4. Tarikh lantikan ke Skim LS */}
        <div>
          <label className="mb-1 block text-sm font-medium">Tarikh Lantikan ke Skim LS</label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2"
            value={form.tarikh_lantikan || ""}
            onChange={(e) => update("tarikh_lantikan", e.target.value)}
          />
        </div>

        {/* 5. Jabatan Semasa */}
        <div>
          <label className="mb-1 block text-sm font-medium">Jabatan Semasa</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={form.jabatan_sem}
            onChange={(e) => update("jabatan_sem", e.target.value)}
          />
        </div>

        {/* 6. Jawatan Semasa */}
        <div>
          <label className="mb-1 block text-sm font-medium">Jawatan Semasa</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={form.jawatan_sem}
            onChange={(e) => update("jawatan_sem", e.target.value)}
          />
        </div>

        {/* 7. lokasi */}
        <div>
          <label className="mb-1 block text-sm font-medium">lokasi</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={form.lokasi || ""}
            onChange={(e) => update("lokasi", e.target.value)}
          >
            <option value="">-- Pilih lokasi --</option>
            {NEGERI.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Alamat Semasa (extra – kekalkan) */}
        <div>
          <label className="mb-1 block text-sm font-medium">Alamat Semasa</label>
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={3}
            value={form.alamat_semasa}
            onChange={(e) => update("alamat_semasa", e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
