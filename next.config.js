module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/node',
        permanent: true
      }
    ];
  }
};
