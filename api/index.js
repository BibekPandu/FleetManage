const { app, initializeIfNeeded } = require('../backend/server');

module.exports = async (req, res) => {
  await initializeIfNeeded();
  return app(req, res);
};


