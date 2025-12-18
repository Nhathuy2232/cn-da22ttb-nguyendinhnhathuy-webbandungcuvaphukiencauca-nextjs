import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: "Cần Thủ Shop | Dụng Cụ & Phụ Kiện Câu Cá Chất Lượng Cao",
  description:
    "Chuyên cung cấp cần câu, máy câu, dây cước, mồi câu và phụ kiện câu cá chính hãng. Giao hàng toàn quốc, thanh toán linh hoạt.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="bg-gray-100 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

