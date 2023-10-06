import "dotenv/config"

const env = {
  PORT: process.env.PORT,
  POSTGRESQL_USER: process.env.POSTGRESQL_USER,
  POSTGRESQL_PASS: process.env.POSTGRESQL_PASS,
  POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  JWT_KEY: process.env.JWT_KEY,
}

export default env
