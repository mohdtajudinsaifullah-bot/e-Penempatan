import "./globals.css";

export const metadata = {
  title: "Sistem e-Perkhidmatan",
  description: "Login Sistem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
