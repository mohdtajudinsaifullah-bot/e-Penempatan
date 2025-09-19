"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Employee = {
  nama: string | null;
  no_ic: string | null;
  emel: string | null;
  jawatan_sem: string | null;
  jabatan_sem: string | null;
  lokasi: string | null;
  gambar_url?: string | null;
};

export default function ProfileFormPage() {
  const router = useRouter();
  const [form, setForm] = useState<Employee>({
    nama: "",
    no_ic: "",
    emel: "",
    jawatan_sem: "",
    jabatan_sem: "",
    lokasi: "",
    gambar_url: "",
  });
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("employees")
        .select("nama, no_ic, emel, jawatan_sem, jabatan_sem, lokasi, gambar_url")
        .eq("user_id", userId)
        .maybeSingle();
      if (data) setForm(data);
      setLoading(false);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGambarFile(e.target.files[0]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setMsg("Sesi tidak sah. Sila log masuk semula.");
      setSaving(false);
      return;
    }

    let uploadedUrl = form.gambar_url || null;

    // Upload gambar kalau ada file baru
    if (gambarFile) {
      const fileExt = gambarFile.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, gambarFile, { upsert: true });

      if (uploadError) {
        setMsg("Gagal upload gambar.");
        setSaving(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      uploadedUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase
      .from("employees")
      .upsert({
        user_id: userId,
        nama: form.nama,
        no_ic: form.no_ic,
        emel: form.emel,
        jawatan_sem: form.jawatan_sem,
        jabatan_sem: form.jabatan_sem,
        lokasi: form.lokasi,
        gambar_url: uploadedUrl,
      });

    setSaving(false);
    if (error) {
      setMsg("Gagal simpan maklumat.");
      return;
    }
    router.push("/dashboard");
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Memuatkan maklumat…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6">Kemaskini Maklumat Peribadi</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama Penuh"
          value={form.nama || ""}
          onChange={handleChange}
          required
          className="border rounded-lg w-full p-3"
        />
        <input
          type="text"
          name="no_ic"
          placeholder="No. IC"
          value={form.no_ic || ""}
          onChange={handleChange}
          required
          className="border rounded-lg w-full p-3"
        />
        <input
          type="email"
          name="emel"
          placeholder="Alamat Emel"
          value={form.emel || ""}
          onChange={handleChange}
          className="border rounded-lg w-full p-3"
        />
        <input
          type="text"
          name="jawatan_sem"
          placeholder="Jawatan (Semasa)"
          value={form.jawatan_sem || ""}
          onChange={handleChange}
          className="border rounded-lg w-full p-3"
        />
        <input
          type="text"
          name="jabatan_sem"
          placeholder="Jabatan / Seksyen (Semasa)"
          value={form.jabatan_sem || ""}
          onChange={handleChange}
          className="border rounded-lg w-full p-3"
        />
        <input
          type="text"
          name="lokasi"
          placeholder="Lokasi Bertugas"
          value={form.lokasi || ""}
          onChange={handleChange}
          className="border rounded-lg w-full p-3"
        />

        {/* Upload gambar */}
        <div>
          <label className="block mb-1 text-sm font-medium">Gambar Profil</label>
          {form.gambar_url && (
            <img
              src={form.gambar_url}
              alt="Gambar Profil"
              className="w-32 h-32 object-cover rounded-full mb-3"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {msg && <p className="text-red-600 text-sm">{msg}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan…" : "Simpan Maklumat"}
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
