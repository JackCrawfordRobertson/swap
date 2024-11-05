// app/layout.js

import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import ThemeProviderWrapper from './components/ThemeProviderWrapper'; // Import the wrapper
import Footer from '@/app/components/Footer/Footer'; // Import the Footer component
import Script from 'next/script';

export const metadata = {
  title: 'SWAP | Event Space Sharing Made Simple',
  description: 'Discover and share unique event spaces with SWAP. Find affordable venues and connect with hosts across central London for any occasion.',
  keywords: 'event spaces, venue sharing, affordable venues, central London, event planning, venue hosting, SWAP app, space sharing',
  author: 'Jack Robertson',
  robots: 'index, follow',
  openGraph: {
    title: 'SWAP | Event Space Sharing Made Simple',
    description: 'Discover affordable event spaces in central London with SWAP. Connect with hosts, find the perfect venue, and make your event a success.',
    type: 'website',
    url: 'https://swap.ice-hub.biz/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SWAP | Event Space Sharing Made Simple',
    description: 'Find and share unique event spaces across London with SWAP, designed for hosts and event organisers alike.',
  },
};

// Set viewport with the new generateViewport function
export const generateViewport = () => ({
  width: 'device-width',
  initialScale: 1.0,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Asynchronously load the Google Maps API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_GEOCODE_API_KEY}&libraries=places`}
          strategy="afterInteractive"
          async
          defer
        />
      </head>
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