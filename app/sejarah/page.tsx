"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SenaraiSejarahPage() {
  const [sejarah, setSejarah] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSejarah = async () => {
      const employee_id = localStorage.getItem("employee_id");
      if (!employee_id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("sejarah_perkhidmatan")
        .select("*")
        .eq("employee_id", employee_id)
        .order("tarikh_lapor_diri", { ascending: false });

      if (error) {
        console.error("Error fetch sejarah:", error);
      } else {
        setSejarah(data || []);
      }
      setLoading(false);
    };

    fetchSejarah();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-700">Sejarah Perkhidmatan</h1>
        <Link
          href="/sejarah/form"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Tambah Sejarah
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sejarah.length === 0 ? (
        <p className="text-gray-500">Tiada rekod</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full border-collapse bg-white shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3 border">Jabatan</th>
                <th className="p-3 border">Jawatan</th>
                <th className="p-3 border">Lokasi</th>
                <th className="p-3 border">Tarikh Lapor Diri</th>
                <th className="p-3 border">Tarikh Berpindah</th>
                <th className="p-3 border">Tempoh</th>
                <th className="p-3 border">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sejarah.map((item) => {
                const mula = new Date(item.tarikh_lapor_diri);
                const tamat = item.tarikh_berpindah
                  ? new Date(item.tarikh_berpindah)
                  : new Date();
                const years = tamat.getFullYear() - mula.getFullYear();
                const months =
                  tamat.getMonth() - mula.getMonth() + (years * 12);
                const tempoh = `${Math.floor(months / 12)} thn ${months % 12} bln`;

                return (
                  <tr key={item.id} className="border-t text-sm">
                    <td className="p-3 border">{item.jabatan}</td>
                    <td className="p-3 border">{item.jawatan}</td>
                    <td className="p-3 border">{item.lokasi}</td>
                    <td className="p-3 border">{item.tarikh_lapor_diri}</td>
                    <td className="p-3 border">{item.tarikh_berpindah || "-"}</td>
                    <td className="p-3 border">{tempoh}</td>
                    <td className="p-3 border">
                      <Link
                        href={`/sejarah/form?id=${item.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Kemaskini
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
