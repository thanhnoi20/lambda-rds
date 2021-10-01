const sql = require('mssql')
const sqlConfig = {
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  server: process.env.RDS_HOST,
  // pool: {
  //   max: 10,
  //   min: 0,
  //   idleTimeoutMillis: 30000
  // },
  port: 1433,
  options: {
    // encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

exports.handler = async () => {
 try {
  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  const result = await sql.query`SELECT * FROM SYS.SYSDATABASES`
  console.dir(result)
 } catch (err) {
  // ... error checks
 }
}
