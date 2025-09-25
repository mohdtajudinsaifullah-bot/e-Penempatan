"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Dashboard() {
  const [employee, setEmployee] = useState<any>(null);
  const [pasangan, setPasangan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Dapatkan user_id dari Supabase Auth atau localStorage
  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        localStorage.setItem("user_id", data.user.id); // simpan utk next reload
      } else {
        const id = localStorage.getItem("user_id");
        if (id) setUserId(id);
      }
    }
    getUser();
  }, []);

  // 🔹 Fetch data dari table
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      // Employee
      const { data: empData, error: empError } = await supabase
        .from("employees")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (empError) console.error("Ralat employee:", empError.message);
      else setEmployee(empData);

      // Pasangan
      const { data: pasanganData, error: pasanganError } = await supabase
        .from("pasangan")
        .select(
          "id, nama_pasangan, pekerjaan_pasangan, jabatan_pasangan, lokasi_pasangan"
        )
        .eq("user_id", userId);

      if (pasanganError) console.error("Ralat pasangan:", pasanganError.message);
      else setPasangan(pasanganData || []);

      setLoading(false);
    }
    fetchData();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">e-PS • Dashboard</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Log Keluar
        </button>
      </div>

      {loading ? (
        <p>Sedang memuat...</p>
      ) : (
        <>
          {/* Profil Pegawai */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow p-4 rounded">
              <h2 className="text-lg font-semibold mb-3">
                {employee?.nama || "Tiada Nama"}
              </h2>
              <p className="text-sm text-gray-600">
                No. IC: {employee?.no_ic || "-"}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div><strong>E-mel:</strong> {employee?.email || "-"}</div>
                <div><strong>Tarikh Lantikan:</strong> {employee?.tarikh_lantikan || "-"}</div>
                <div><strong>Jabatan Semasa:</strong> {employee?.jabatan_sem || "-"}</div>
                <div><strong>Jawatan Semasa:</strong> {employee?.jawatan_sem || "-"}</div>
                <div><strong>Lokasi:</strong> {employee?.lokasi || "-"}</div>
                <div><strong>Alamat:</strong> {employee?.alamat_semasa || "-"}</div>
              </div>

              <Link
                href="/kemaskini"
                className="mt-4 inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Kemaskini Profil
              </Link>
            </div>

            {/* Tindakan Pantas */}
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-md font-semibold mb-4">Tindakan Pantas</h3>
              <div className="flex flex-col gap-2">
                <Link href="/sejarah/tambah" className="px-4 py-2 bg-black text-white rounded">
                  Tambah Sejarah Perkhidmatan
                </Link>
                <Link href="/kursus/tambah" className="px-4 py-2 bg-black text-white rounded">
                  Tambah Kursus
                </Link>
                <Link href="/kenaikan-pangkat" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Sejarah Kenaikan Pangkat
                </Link>
                <Link href="/sejarah" className="px-4 py-2 bg-gray-200 text-black rounded">
                  Lihat Sejarah Perkhidmatan
                </Link>
                <Link href="/kursus" className="px-4 py-2 bg-gray-200 text-black rounded">
                  Lihat Kursus
                </Link>
              </div>
            </div>
          </div>

          {/* Maklumat Pasangan */}
          <div className="bg-white shadow p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Maklumat Pasangan</h2>
              <Link href="/pasangan" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Kemaskini
              </Link>
            </div>
            {pasangan.length === 0 ? (
              <p className="text-gray-500">Tiada maklumat pasangan.</p>
            ) : (
              <table className="w-full border-collapse bg-white shadow rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Nama</th>
                    <th className="border px-4 py-2 text-left">Pekerjaan</th>
                    <th className="border px-4 py-2 text-left">Jabatan</th>
                    <th className="border px-4 py-2 text-left">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {pasangan.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{p.nama_pasangan}</td>
                      <td className="border px-4 py-2">{p.pekerjaan_pasangan}</td>
                      <td className="border px-4 py-2">{p.jabatan_pasangan}</td>
                      <td className="border px-4 py-2">{p.lokasi_pasangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
