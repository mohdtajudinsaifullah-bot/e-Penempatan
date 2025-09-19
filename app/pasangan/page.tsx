"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SenaraiPasangan() {
  const [pasangan, setPasangan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const employeeId =
    typeof window !== "undefined" ? localStorage.getItem("employee_id") : null;

  useEffect(() => {
    async function fetchPasangan() {
      if (!employeeId) return;
      const { data, error } = await supabase
        .from("pasangan")
        .select(
          "id, nama_pasangan, pekerjaan_pasangan, jabatan_pasangan, lokasi_pasangan"
        )
        .eq("employee_id", employeeId);

      if (error) {
        console.error("Ralat fetch pasangan:", error.message);
      } else {
        setPasangan(data || []);
      }
      setLoading(false);
    }
    fetchPasangan();
  }, [employeeId]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Senarai Pasangan</h1>
        <Link
          href="/pasangan/tambah"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Tambah Pasangan
        </Link>
      </div>

      <Link
        href="/dashboard"
        className="text-blue-600 hover:underline block mb-4"
      >
        ← Kembali ke Dashboard
      </Link>

      {loading ? (
        <p>Sedang memuat...</p>
      ) : pasangan.length === 0 ? (
        <p className="text-gray-500">Tiada maklumat pasangan.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nama</th>
              <th className="border px-4 py-2 text-left">Pekerjaan</th>
              <th className="border px-4 py-2 text-left">Jabatan</th>
              <th className="border px-4 py-2 text-left">Lokasi</th>
              <th className="border px-4 py-2 text-left">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {pasangan.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{p.nama_pasangan || "—"}</td>
                <td className="border px-4 py-2">{p.pekerjaan_pasangan || "—"}</td>
                <td className="border px-4 py-2">{p.jabatan_pasangan || "—"}</td>
                <td className="border px-4 py-2">{p.lokasi_pasangan || "—"}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    href={`/pasangan/kemaskini/${p.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Kemaskini
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
