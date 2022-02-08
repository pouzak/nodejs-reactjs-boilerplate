const { Pool } = require("pg");
const pg = require("pg");
const types = require("pg").types;

//parse int
pg.types.setTypeParser(20, parseInt);

const parseFn = function (val) {
  return val === null ? null : val;
};
const parseTimestampTzToUTC = function (val) {
  return val === null ? null : new Date(val).toISOString();
};
types.setTypeParser(types.builtins.TIMESTAMPTZ, parseTimestampTzToUTC);
types.setTypeParser(types.builtins.TIMESTAMP, parseFn);

//production db
const db = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};


const pool = new Pool(db);
pool.on("connect", async (client) => {
  const systemtz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const pgtz = await client.query(
    `SELECT name FROM pg_timezone_names WHERE name=$1 LIMIT 1`,
    [systemtz]
  );

  if (pgtz && pgtz.rows.length && pgtz.rows[0].name === systemtz) {
    await client.query(`SET TIMEZONE = '${systemtz}'`);
  }
});
module.exports = {
  query: (text, params) => pool.query(text, params),
  getPool() {
    return pool;
  },
};


