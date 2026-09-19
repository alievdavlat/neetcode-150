import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { translator } from '@/i18n/lookup';
import { I18nProvider } from '@/i18n/provider';
import { getDictionary, getLocale } from '@/i18n/server';
import './globals.css';

const display = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/** Cyrillic is loaded because Russian is one of the three languages. */
const code = JetBrains_Mono({
  variable: '--font-code',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
});

/**
 * The tab title and the description are prose, so they come out of the
 * dictionary too. Metadata is resolved before the tree renders, which is why
 * this reads the locale for itself rather than sharing the layout's copy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = translator(await getDictionary(locale), locale);

  return {
    title: t('nav.problems'),
    description: t('common.appDescription'),
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`dark ${display.variable} ${code.variable} h-full antialiased`}>
      <body className="grid-floor min-h-full">
        <I18nProvider locale={locale} dictionary={dictionary}>
          <div className="flex min-h-dvh">
            <AppSidebar />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </I18nProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
