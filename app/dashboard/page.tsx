"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Employee = {
  id: string;
  nama: string | null;
  no_ic: string | null;
  email: string | null;
  tarikh_lantikan: string | null;
  jawatan_sem: string | null;
  jabatan_sem: string | null;
  jabatan: string | null;
  alamat_semasa: string | null;
  lokasi?: string | null;
};

type Pasangan = {
  id: string;
  nama: string | null;
  no_ic: string | null;
  pekerjaan: string | null;
  jabatan: string | null;
  lokasi: string | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [pasangan, setPasangan] = useState<Pasangan[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      setError("");
      try {
        const userId = localStorage.getItem("user_id") || "";

        if (!userId) {
          setError("Sesi pengguna tidak sah. Sila log masuk semula.");
          return;
        }

        // 1) Dapatkan employee ikut user_id
        const employeeRes = await supabase
          .from("employees")
          .select(
            'id,nama,no_ic,email,tarikh_lantikan,jawatan_sem,jabatan_sem,jabatan,alamat_semasa,"lokasi"'
          )
          .eq("user_id", userId)
          .maybeSingle();

        if (employeeRes.error) throw employeeRes.error;
        if (!employeeRes.data) {
          setError("Maklumat pengguna tidak ditemui.");
          return;
        }

        setEmp(employeeRes.data);

        // Simpan id untuk kegunaan lain (fallback sahaja)
        localStorage.setItem("employee_id", employeeRes.data.id);

        // 2) Dapatkan senarai pasangan ikut user_id
        const pasanganRes = await supabase
          .from("pasangan")
          .select("id,nama,no_ic,pekerjaan,jabatan,lokasi")
          .eq("user_id", userId) // ✅ sudah selaras
          .order("created_at", { ascending: true });

        if (!pasanganRes.error && pasanganRes.data) {
          setPasangan(pasanganRes.data);
        }
      } catch (e: any) {
        setError(e?.message || "Ralat memuatkan data.");
      }
    })();
  }, []);

  const field = (label: string, value?: string | null) => (
    <div className="flex flex-col gap-1">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-[15px] font-medium text-gray-900">
        {value && value.trim() !== "" ? value : "—"}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">e-PS • Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/sejarah")}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Sejarah Perkhidmatan
          </button>
          <button
            onClick={() => router.push("/kursus")}
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Kursus
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
          >
            Log Keluar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Kad Maklumat Peribadi */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white/70 p-5 backdrop-blur md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                {emp?.nama?.slice(0, 2).toUpperCase() || "MT"}
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {emp?.nama || "—"}
                </div>
                <div className="text-sm text-gray-600">
                  No. IC: {emp?.no_ic || "—"}
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/employee/edit")}
              className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-black"
            >
              Kemaskini Profil
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {field("E-mel", emp?.email)}
            {field("Tarikh Lantikan", emp?.tarikh_lantikan)}
            {field("Jabatan Semasa", emp?.jabatan_sem || emp?.jabatan)}
            {field("Jawatan Semasa", emp?.jawatan_sem)}
            {field("Lokasi", emp?.lokasi ?? null)}
            {field("Alamat Semasa", emp?.alamat_semasa)}
          </div>
        </div>

        {/* Tindakan Pantas */}
        <div className="rounded-xl border bg-white/70 p-5 backdrop-blur">
          <div className="mb-4 text-base font-semibold">Tindakan Pantas</div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/sejarah/tambah")}
              className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-black"
            >
              Tambah Sejarah Perkhidmatan
            </button>
            <button
              onClick={() => router.push("/kursus/tambah")}
              className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-black"
            >
              Tambah Kursus
            </button>
            <button
              onClick={() => router.push("/sejarah")}
              className="rounded bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-200"
            >
              Lihat Sejarah Perkhidmatan
            </button>
            <button
              onClick={() => router.push("/kursus")}
              className="rounded bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-200"
            >
              Lihat Kursus
            </button>
          </div>
        </div>
      </div>

      {/* Seksyen Pasangan */}
      <div className="mt-6 rounded-xl border bg-white/70 p-5 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-semibold">Maklumat Pasangan</div>
          <button
            onClick={() => router.push("/pasangan")}
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Kemaskini
          </button>
        </div>

        {pasangan.length === 0 ? (
          <div className="py-3 text-sm text-gray-600">
            Tiada maklumat pasangan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">No. IC</th>
                  <th className="px-3 py-2">Pekerjaan</th>
                  <th className="px-3 py-2">Jabatan</th>
                  <th className="px-3 py-2">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {pasangan.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-3 py-2">{p.nama || "—"}</td>
                    <td className="px-3 py-2">{p.no_ic || "—"}</td>
                    <td className="px-3 py-2">{p.pekerjaan || "—"}</td>
                    <td className="px-3 py-2">{p.jabatan || "—"}</td>
                    <td className="px-3 py-2">{p.lokasi || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
