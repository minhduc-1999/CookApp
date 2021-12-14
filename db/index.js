const { MongoClient } = require('mongodb');
const fs = require('fs')


const url = 'mongodb://root:example@localhost:27017'; //change this connectionString
const client = new MongoClient(url);

// Config here
const dbName = 'cookapp'
const collectionName = 'foods'
const fileName = 'food_1.json'
//

async function main(filename) {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const raw = fs.readFileSync(fileName)


  const foods = JSON.parse(raw);
  console.log(foods)
  const iRe = await collection.insertMany(foods)
  console.log("insert result", iRe)

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());