import './globals.css';
import { Providers } from '../providers/Providers';

export const metadata = {
  title: 'Quilo Portal',
  description: 'Student & Teacher Portal - Quilo Multi-Tenant SaaS ERP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
