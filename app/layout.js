import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Studybug Flashcards Beta Test",
  description: "Studybug Flashcards Limited Beta Test",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
