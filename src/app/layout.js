// app/layout.js

import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import ThemeProviderWrapper from './components/ThemeProviderWrapper'; // Import the wrapper
import Footer from '@/app/components/Footer/Footer'; // Import the Footer component

export const metadata = {
  title: 'SWAP',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProviderWrapper>
            {children}
            <Footer /> {/* Add the Footer component */}
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}