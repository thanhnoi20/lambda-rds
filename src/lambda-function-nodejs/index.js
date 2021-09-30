const sql = require('mssql');

exports.handler = async event => {
  try {
    await sql.connect('mssql://username:password@12.23.33.2:74/database');
    return 'connected';

  } catch (err) {
    console.error('cannot connect', err.message);
  }
  return 'connect failed';
}