/** @type {import('next').NextConfig} */

module.exports = {
  async redirects() {
    return [
      //   {
      //     source: "/",
      //     destination: "/dashboard",
      //     permanent: true,
      //   },
      {
        source: "/admin",
        destination: "/admin/dashboard/dashboard",
        permanent: false,
      },
      {
        source: "/personnel",
        destination: "/personnel/dashboard/dashboard",
        permanent: false,
      },
      //   {
      //     source: "/dashboard",
      //     destination: "/dashboard/dashboard",
      //     permanent: true,
      //   },
    ];
  },
};
