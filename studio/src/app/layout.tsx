import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { AppSidebar } from '@/components/app-sidebar';
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
  title: 'Problems',
  description: '150 problems, one editor, real verdicts.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${code.variable} h-full antialiased`}>
      <body className="grid-floor min-h-full">
        <div className="flex min-h-dvh">
          <AppSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
