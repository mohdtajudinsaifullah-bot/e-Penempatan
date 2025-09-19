export function kiraTempoh(dariISO?: string | null, hinggaISO?: string | null) {
  if (!dariISO || !hinggaISO) return "-";
  const d1 = new Date(dariISO);
  const d2 = new Date(hinggaISO);
  if (Number.isNaN(+d1) || Number.isNaN(+d2)) return "-";

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();

  if (months < 0) { years -= 1; months += 12; }
  return `${years} tahun ${months} bulan`;
}
