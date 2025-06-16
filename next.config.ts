import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Transpile packages that need to be processed by Next.js
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  
  // Webpack configuration to handle Three.js and R3F properly
  webpack: (config, { isServer }) => {
    // Handle canvas module for server-side
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    // Ensure proper module resolution for Three.js
    config.resolve.alias = {
      ...config.resolve.alias,
      three: 'three',
    };
    
    // Handle specific modules that can cause SSR issues
    if (isServer) {
      config.externals.push({
        '@react-three/fiber': '@react-three/fiber',
        '@react-three/drei': '@react-three/drei',
        'three': 'three',
      });
    }
    
    return config;
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
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/gmp-prodx-firebase-studio-app-images-us-west1/**',
      },
      {
        protocol: 'https',
        hostname: 'xtuifrsvhbydeqtmibbt.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;