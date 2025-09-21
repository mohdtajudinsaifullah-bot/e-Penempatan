"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function KursusPage() {
  const [kursus, setKursus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Ambil employee_id dari localStorage bila client ready
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("employee_id");
      setEmployeeId(id);
    }
  }, []);

  // Fetch kursus bila employeeId dah dapat
  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    async function fetchKursus() {
      const { data, error } = await supabase
        .from("kursus")
        .select("*")
        .eq("employee_id", employeeId)
        .order("tarikh_mula", { ascending: false });

      if (error) {
        console.error("Ralat fetch kursus:", error.message);
      } else {
        setKursus(data || []);
      }
      setLoading(false);
    }

    fetchKursus();
  }, [employeeId]);

  if (loading) return <p className="p-6">Memuatkan...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Senarai Kursus</h1>
        <Link
          href="/kursus/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Kursus
        </Link>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nama Kursus</th>
            <th className="border p-2">Anjuran</th>
            <th className="border p-2">Lokasi</th>
            <th className="border p-2">Tarikh Mula</th>
            <th className="border p-2">Tarikh Tamat</th>
            <th className="border p-2">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {kursus.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                Tiada rekod
              </td>
            </tr>
          ) : (
            kursus.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="border p-2">{k.nama_kursus}</td>
                <td className="border p-2">{k.anjuran}</td>
                <td className="border p-2">{k.lokasi}</td>
                <td className="border p-2">{k.tarikh_mula}</td>
                <td className="border p-2">{k.tarikh_tamat}</td>
                <td className="border p-2 text-center">
                  <Link
                    href={`/kursus/kemaskini/${k.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Kemaskini
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
          ← Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
