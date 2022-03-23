const pool = require('./db');

const readData = async() => {
  const name = process.argv[2] ?? 'null';
  const entries = await pool.query('SELECT * FROM my_table WHERE name = $1;', [name]);
  console.log(`Database entries for ${name}: ${entries.rowCount} row(s)`);
  console.log(Object.keys(entries.rows?.[0]).join('\t'));
  console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);
}

readData();