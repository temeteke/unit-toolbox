/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// GitHub Pages プロジェクトページの場合、
// 公開 URL は https://<USER>.github.io/unit-toolbox/ を想定
const basePath = isProd ? '/unit-toolbox' : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // 静的エクスポート時に必要
  },
};

export default nextConfig;
