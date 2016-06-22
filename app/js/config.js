const port = process.env.PORT || 5555;

module.exports = {
  baseUrl: 'http://localhost:' + port,
  fbAuthUrl: 'https://api.fitbit.com/oauth2/token',
  fbDataUrl: 'https://api.fitbit.com/1/user/'
};
