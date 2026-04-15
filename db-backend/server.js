const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/execute-query', async (req, res) => {
  const { connection, sql } = req.body;
  
  const client = new Client({
    host: connection.host,
    database: connection.dbname,
    user: connection.user,
    password: connection.pass,
    port: 5432, // Standard PostgreSQL port
  });

  try {
    await client.connect();
    const result = await client.query(sql);
    res.json({ rows: result.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    await client.end();
  }
});

app.listen(5000, () => console.log('Backend engine is running on port 5000'));