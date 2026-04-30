const { auth } = require("express-oauth2-jwt-bearer");

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_ALG,
});

module.exports = { requireAuth };