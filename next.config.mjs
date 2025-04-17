// next.config.js
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

export default withVanillaExtract(nextConfig);
