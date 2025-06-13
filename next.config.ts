
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // Keep this if you might still use GCS for other things
        port: '',
        pathname: '/gmp-prodx-firebase-studio-app-images-us-west1/**',
      },
      {
        protocol: 'https',
        // IMPORTANT: Replace 'YOUR_SUPABASE_PROJECT_REF.supabase.co'
        // with your actual Supabase project reference and domain.
        // Example: 'abcdefghijk.supabase.co'
        hostname: 'YOUR_SUPABASE_PROJECT_REF.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Standard path for Supabase public storage
      },
    ],
  },
};

export default nextConfig;
