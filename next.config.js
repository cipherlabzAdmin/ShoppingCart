const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== "1";
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === "1";

  const env = {
    API_PROD_URL: (() => {
      if (isDev) return "http://localhost:3000/api/";
      if (isProd) {
        return "https://www.smartpickpack.com/api/";
      }
      if (isStaging) return "http://localhost:3000/api/";
      return "RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)";
    })(),
    API_BASE_URL: "https://pickpackuat.biscare.live/api/",
  };
  const redirects = () => {
    return [
      {
        source: "/",
        destination: "/en/theme/paris",
        permanent: true,
      },
    ];
  };
  const images = {
    domains: [
      "react.pixelstrap.net",
      "laravel.pixelstrap.net",
      "http://localhost:3000",
      "openskylabz.s3.ap-south-1.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "react.pixelstrap.net",
      },
    ],
  };


  return {
    env,
    redirects,
    images,
  };
};
