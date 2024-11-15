const { composePlugins, withNx } = require('@nx/next');
const { withContentlayer } = require('next-contentlayer2');
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.

  withNx,
];

module.exports = composePlugins(...plugins)(withContentlayer(nextConfig));
