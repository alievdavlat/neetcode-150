import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const code = JetBrains_Mono({
  variable: '--font-code',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'NeetCode Studio',
  description: '150 problems, one editor, your own runner.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${code.variable} h-full antialiased`}>
      <body className="grid-floor min-h-full">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
