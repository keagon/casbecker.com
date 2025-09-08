/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure ffmpeg binaries and heavy deps are not bundled into serverless chunks
      config.externals = config.externals || [];
      config.externals.push(
        {
          '@ffmpeg-installer/ffmpeg': 'commonjs @ffmpeg-installer/ffmpeg',
          'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
          'ffmpeg-static': 'commonjs ffmpeg-static',
        }
      );
    }
    return config;
  },
};

export default nextConfig;
