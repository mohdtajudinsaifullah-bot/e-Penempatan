"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      // Dapatkan user login
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Ambil maklumat pekerja dari table "employees"
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!error) setEmployee(data);
      }
    }
    loadData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!user) return <p className="p-6">Sila log masuk dahulu.</p>;
  if (!employee) return <p className="p-6">Sedang memuatkan data...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold mb-4">Maklumat Peribadi</h1>

      <div className="space-y-2">
        <p><b>Nama:</b> {employee.nama}</p>
        <p><b>No. IC:</b> {employee.no_ic}</p>
        <p><b>Tarikh Lantikan:</b> {employee.tarikh_lantikan}</p>
        <p><b>Alamat:</b> {employee.alamat_tempat_tinggal}</p>
        <p><b>Jawatan Semasa:</b> {employee.jawatan_sem}</p>
        <p><b>Jabatan:</b> {employee.jabatan}</p>
        <p><b>Lokasi:</b> {employee.lokasi}</p>
        <p><b>Tarikh Lapor Diri:</b> {employee.tarikh_lapor_diri}</p>
        <p><b>Nama Pasangan:</b> {employee.nama_pasangan}</p>
        <p><b>Pekerjaan Pasangan:</b> {employee.pekerjaan_pasangan}</p>
        <p><b>Jabatan Pasangan:</b> {employee.jabatan_pasangan}</p>
        <p><b>Lokasi Pasangan:</b> {employee.lokasi_pasangan}</p>
      </div>

      <div className="flex gap-4 pt-4">
        <Link
          href="/kemaskini"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Kemaskini
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Log Keluar
        </button>
      </div>
    </div>
  );
}
