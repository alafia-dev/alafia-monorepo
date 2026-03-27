const healthCheck = async (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'alafia-backend',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  healthCheck,
};
