const getAuth0Id = (req) =>
  req.auth?.payload?.sub ?? req.auth?.sub ?? req.user?.sub;

module.exports = getAuth0Id;
