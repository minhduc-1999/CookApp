const { MongoClient } = require('mongodb');
const fs = require('fs')
require('dotenv').config()

const url = process.env.DB_CONNECTION; //change this connectionString
const client = new MongoClient(url);

// Config here
const dbName = 'tastify-db'
const pair = [
  {
    colName: 'foods',
    fileName: "foods.json"
  },
  {
    colName: 'units',
    fileName: "units.json"
  },
  {
    colName: 'ingredients',
    fileName: "ingredients.json"
  },
]
//

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  for (const p of pair) {
    const collection = db.collection(p.colName);
    const raw = fs.readFileSync(p.fileName)

    const objs = JSON.parse(raw);
    const insertResult = await collection.insertMany(objs)
    console.log("insert result", insertResult)
  }

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
