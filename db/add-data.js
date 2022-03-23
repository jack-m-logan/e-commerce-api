const pool = require('./db');

const addData = async() => {
  const name = process.argv[2] ?? 'null';
  let insertRow = await pool.query('INSERT INTO my_table(name) VALUES($1);', [`${name}`]);
  console.log(`Inserted ${insertRow.rowCount} row`);
}

addData();