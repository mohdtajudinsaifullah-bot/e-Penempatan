"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePage() {
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("history").insert([{ position, department, year }]);
    alert("Rekod berjaya ditambah!");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kemaskini Borang</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
        <input
          type="text"
          placeholder="Jawatan"
          className="border p-2 rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <input
          type="text"
          placeholder="Jabatan"
          className="border p-2 rounded"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tahun"
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white rounded p-2">
          Simpan
        </button>
      </form>
    </div>
  );
}
