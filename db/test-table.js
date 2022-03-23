const pool = require('./db');

pool.query(`    
  CREATE TABLE IF NOT EXISTS my_table(
  id BIGSERIAL PRIMARY KEY NOT NULL ,
  name varchar,
  date TIMESTAMP NOT NULL DEFAULT current_timestamp
);`, (err, res) => {
  if (err) {
    return new Error(err)
  } else {
    console.log('Table added!')
  }
});

