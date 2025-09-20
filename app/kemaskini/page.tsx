"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function KemaskiniProfil() {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const router = useRouter();

  // 🔹 Pastikan localStorage hanya dipanggil di client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("employee_id");
      setEmployeeId(id);
    }
  }, []);

  useEffect(() => {
    async function fetchEmployee() {
      if (!employeeId) return;
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (error) {
        console.error("Ralat fetch employee:", error.message);
      } else {
        setEmployee(data);
      }
      setLoading(false);
    }
    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("employees")
      .update({
        nama: employee.nama,
        no_ic: employee.no_ic,
        email: employee.email,
        tarikh_lantikan: employee.tarikh_lantikan,
        jabatan_sem: employee.jabatan_sem,
        jawatan_sem: employee.jawatan_sem,
        lokasi: employee.lokasi,
        alamat_semasa: employee.alamat_semasa,
      })
      .eq("id", employeeId);

    setSaving(false);

    if (error) {
      alert("Ralat simpan: " + error.message);
    } else {
      alert("Profil berjaya dikemaskini!");
      router.push("/dashboard");
    }
  };

  if (loading) return <p className="p-6">Sedang memuat...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Kemaskini Profil</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium">Nama</label>
          <input
            type="text"
            name="nama"
            value={employee?.nama || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">No. IC</label>
          <input
            type="text"
            name="no_ic"
            value={employee?.no_ic || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">E-mel</label>
          <input
            type="email"
            name="email"
            value={employee?.email || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tarikh Lantikan</label>
          <input
            type="date"
            name="tarikh_lantikan"
            value={employee?.tarikh_lantikan || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Jabatan Semasa</label>
          <input
            type="text"
            name="jabatan_sem"
            value={employee?.jabatan_sem || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Jawatan Semasa</label>
          <input
            type="text"
            name="jawatan_sem"
            value={employee?.jawatan_sem || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Lokasi</label>
          <input
            type="text"
            name="lokasi"
            value={employee?.lokasi || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Alamat Semasa</label>
          <input
            type="text"
            name="alamat_semasa"
            value={employee?.alamat_semasa || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
