import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import ReduxProvider from '../components/ReduxProvider';
import PublicLayout from '../components/PublicLayout';

export const metadata = {
  title: 'MPSC Student Protest | Stand for Our Rights',
  description: 'Join the protest to demand fair and timely MPSC exams. Register to show your support and download the protest demands certificate.',
  keywords: ['MPSC Protest', 'MPSC Students', 'Maharashtra Public Service Commission', 'Student Demands', 'Exam Schedule', 'Justice for Students'],
  openGraph: {
    title: 'MPSC Student Protest Support',
    description: 'Join the protest to demand fair and timely MPSC exams. Register to show your support.',
    url: 'https://veaglespace.com',
    siteName: 'MPSC Protest Support',
    images: [
      {
        url: '/logo.webp',
        width: 800,
        height: 600,
        alt: 'MPSC Protest Support',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPSC Student Protest Support',
    description: 'Join the protest to demand fair and timely MPSC exams. Register to show your support.',
    images: ['/logo.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
