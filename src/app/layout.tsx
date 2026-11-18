import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'CVGenie — AI-Powered Professional CV Builder for Students',
  description:
    'Your Future Starts With a Better CV. Built for SMK, vocational students, university students, and fresh graduates with Student Mode, ATS scoring, and liquid glass design.',
  keywords: [
    'CV Builder',
    'Student CV',
    'Resume Maker',
    'SMK PKL Magang',
    'ATS Friendly CV',
    'AI CV Generator',
    'Fresh Graduate Resume',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
