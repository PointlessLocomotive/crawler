var config = {};

config.twitter = {
  twitterKey:process.env.TWITTER_KEY,
  twitterSecret: process.env.TWITTER_SECRET,
  token: process.env.TWITTER_TOKEN,
  secret: process.env.TWITTER_TOKEN_SECRET
};
config.db = {
  user: process.env.DB_USER, //env var: PGUSER
  database: process.env.DB_NAME, //env var: PGDATABASE
  password: process.env.DB_PASS, //env var: PGPASSWORD
  host: process.env.DB_HOST, // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  ssl:'require',
  max: 70, // max number of clients in the pool
  idleTimeoutMillis: 100000, // how long a client is allowed to remain idle before being closed
};


module.exports = config;
